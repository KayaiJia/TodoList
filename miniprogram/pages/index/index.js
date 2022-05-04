import { requestP } from '../../../app'
import router from '../../router/index'

const computedBehavior = require("miniprogram-computed").behavior;
Component({

  behaviors: [computedBehavior],
  data: {
    listCount : {inbox:0,todo:0,wait:0,maybe:0,done:0},
    projectTitle : [],
    addList : false,
    showAddThings:false,
    addThingName : '',
    addThingNote : '',
    addThingTime : '',
    addThingTag: '',
    addThingDone : false,
    showAddProject:false,
    addProjectName : '',
    keywords : '',
  },
  
  methods:{

    async onShow(){
      this.setData({
        keywords:''
      })
      this.init()
    },

    async init(){
      const user = await wx.cloud.callContainer({
        "config": {
          "env": "prod-2gwzli5a668f1961"
        },
        "path": "/TodoList/userController.do?operate=login",
        "header": {
          "X-WX-SERVICE": "todo-list",
          "content-type": "application/json"
        },
        "method": "GET",
        "data": ""
      })
      this.setData({
        projectTitle : user.data.data.user.projectsList
      })
      const list = await wx.cloud.callContainer({
        "config": {
          "env": "prod-2gwzli5a668f1961"
        },
        "path": "/TodoList/userController.do?operate=getListCount",
        "header": {
          "X-WX-SERVICE": "todo-list",
          "content-type": "application/json"
        },
        "method": "GET",
        "data": ""
      })
      this.setData({
        'listCount.inbox' : list.data.data.count[0],
        'listCount.todo' : list.data.data.count[1],
        'listCount.wait' : list.data.data.count[2],
        'listCount.maybe' : list.data.data.count[3],
        'listCount.done' : list.data.data.count[4]
      })
    },

    async onLoad(){
      await this.init()
    },
    showAdd(){
      this.setData({
        addList : true
      })
    },

    hideAdd(){
      this.setData({
        addList:false
      })
    },

    showAddThing(){
      this.setData({
        showAddThings:true,
        addList:false,
        addThingName:'',
        addThingNote:'',
        addThingTime:'',
      })
    },

    handleChange(e) {
      this.setData({
        addThingTime : e.detail.dateString
      })
    },

    toList(e){
      let index = e.currentTarget.dataset.index
      let name = e.currentTarget.dataset.name

      if (index !=5 ){
        router.gotoPage('/list',{'index':index})
      }else{
        router.gotoPage('/list',{'index':index,'name':name})
      }
    },

    async submitThing(){

      if (this.data.addThingTime != '') {
        var that = this;
        wx.requestSubscribeMessage({
          tmplIds: ['TXI-MQahiffvtlk7OYdAldaCcwG741kv3rZu6huMB_o'],
          success(res) {
            var now_time = new Date().getTime()
            var end_time = new Date(that.data.addThingTime).getTime()
            var remark = that.data.addThingNote
            if (remark === undefined || remark === null || remark === ''){
              remark = '无'
            }
            console.log(remark,that.data.addThingName,that.data.addThingTime)
            console.log(end_time - now_time)
            if (now_time < end_time) {
              
              that.data.timer = setTimeout(
                function () {
                  wx.cloud.callFunction({
                    name: 'putMessage',
                    data: {
                      title: that.data.addThingName,
                      time: that.data.addThingTime,
                      remark: remark
                    }
                  }).then(res=>console.log('成功',res)).catch(res=>console.log('失败',res))
                }, end_time - now_time);
            }
          },
          fail(err) {
            console.log('错误', err)
          }
        })
      }

      const res = await wx.cloud.callContainer({
        "config": {
          "env": "prod-2gwzli5a668f1961"
        },
        "path": `/TodoList/thingsController.do?operate=addThing&title=${encodeURIComponent(this.data.addThingName)}&remark=${encodeURIComponent(this.data.addThingNote)}&time=${encodeURIComponent(this.data.addThingTime)}&type=0&name=${encodeURIComponent('收集箱')}`,
        "header": {
          "X-WX-SERVICE": "todo-list",
          "content-type": "application/json"
        },
        "method": "GET",
        "data": ""
      })


       let name = decodeURIComponent(res.data.data.name)
       let title = decodeURIComponent(res.data.data.title)

       await wx.cloud.callContainer({
        "config": {
          "env": "prod-2gwzli5a668f1961"
        },
        "path": `/TodoList/thingsController.do?operate=${res.data.data.operate}&title=${encodeURIComponent(title)}&type=${res.data.data.type}&name=${encodeURIComponent(name)}`,
        "header": {
          "X-WX-SERVICE": "todo-list",
          "content-type": "application/json"
        },
        "method": "GET",
        "data": ""
      })

      this.setData({
        showAddThings:false
      })

      await this.init()
    },

    showAddProject(){
      this.setData({
        showAddProject : true,
        addList:false
      })
    },

    async submitProject(){
      await wx.cloud.callContainer({
        "config": {
          "env": "prod-2gwzli5a668f1961"
        },
        "path": `/TodoList/projectController.do?operate=addProject&projectName=${encodeURIComponent(this.data.addProjectName)}`,
        "header": {
          "X-WX-SERVICE": "todo-list",
          "content-type": "application/json"
        },
        "method": "GET",
        "data": ""
      })

      await this.init()

      this.hideProject()
    },
  
    hideProject(){
        this.setData({
          showAddProject:false
        })
    },
    search(){
      router.gotoPage('/search',{keywords:this.data.keywords})
    },

    
  }
})