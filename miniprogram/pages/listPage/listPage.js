// miniprogram/pages/listPage/listPage.js
import router from '../../router/index'
const computedBehavior = require("miniprogram-computed").behavior;
Component({
  behaviors: [computedBehavior],
  /**
   * 页面的初始数据
   */
  data: {
    thingName: '',
    remark: '',
    time: '',
    list: '',
    thingList: [],
    projectTitle: [],
    type: -1,
    done: false,
    index: '',
    name: '',

    addThingDone: '',
    addThingName: '',
    addThingNote: '',
    addThingTime: '',
  },

  methods: {
    handleChange(e) {
      this.setData({
        time: e.detail.dateString
      })
    },
    onLoad(options) {
      this.setData({
        listId: options.index
        // listId: '3'
      })
      if (this.data.listId == 0) {
        this.setData({
          listName: '收集箱',
          img: '收集',
          list: 0
        })
      } else if (this.data.listId == 1) {
        this.setData({
          listName: '执行清单',
          img: '执行',
          list: 1
        })
      } else if (this.data.listId == 2) {
        this.setData({
          listName: '等待清单',
          img: '等待',
          list: 2
        })
      } else if (this.data.listId == 3) {
        this.setData({
          listName: '可能清单',
          img: '可能',
          list: 3
        })
      } else if (this.data.listId == 4) {
        this.setData({
          listName: '已完成',
          img: '完成',
          list: 4
        })
      } else {
        this.setData({
          listName: options.name,
          img: '',
          list: 5
        })
      }
      this.getList();
    },
    async getList() {
      if (this.data.list != 5) {
        const info = await wx.cloud.callContainer({
          "config": {
            "env": "prod-2gwzli5a668f1961"
          },
          "path": `/TodoList/listController.do?operate=getListThings&listId=${this.data.listId}`,
          "header": {
            "X-WX-SERVICE": "todo-list",
            "content-type": "application/json"
          },
          "method": "GET",
          "data": ""
        })
        if (info.data.data.things != undefined) {
          this.setData({
            thingList: info.data.data.things
          })
        }else{
          this.setData({
            thingList : []
          })
        }
      }
      else {
        const info = await wx.cloud.callContainer({
          "config": {
            "env": "prod-2gwzli5a668f1961"
          },
          "path": `/TodoList/projectController.do?operate=getListThings&listId=${this.data.listId - 5}`,
          "header": {
            "X-WX-SERVICE": "todo-list",
            "content-type": "application/json"
          },
          "method": "GET",
          "data": ""
        })
        this.setData({
          thingList: info.data.data.things
        })
      }
    },
    showModal(e) {
      this.setData({
        index: e.currentTarget.dataset.index
      })
      this.setData({
        thingName: this.data.thingList[this.data.index].title,
        remark: this.data.thingList[this.data.index].remark,
        modalName: 'Modal',

      })
    },
    async showModal1(e) {
      this.setData({
        modalName1: e.currentTarget.dataset.target
      })
      this.setData({
        modalName: null,
      })

      const project = await wx.cloud.callContainer({
        "config": {
          "env": "prod-2gwzli5a668f1961"
        },
        "path": "/TodoList/projectController.do?operate=getProject",
        "header": {
          "X-WX-SERVICE": "todo-list",
          "content-type": "application/json"
        },
        "method": "GET",
        "data": ""
      })
      this.setData({
        projectTitle: project.data.data.project
      })
    },
    hideModal(e) {
      this.setData({
        modalName: null,
      })
    },
    hideModal1(e) {
      this.setData({
        modalName1: null,
        modalName: 'Modal'
      })
    },
    changeList(e) {
      this.setData({
        type: e.currentTarget.dataset.type,
        name: e.currentTarget.dataset.name,

        modalName1: null,
        modalName: 'Modal'
      })
    },
    async submitThing() {
      let id = -1
      if (this.data.listId >= 5) {
        id = this.data.listId - 5
      } else {
        id = this.data.listId
      }
      await wx.cloud.callContainer({
        "config": {
          "env": "prod-2gwzli5a668f1961"
        },
        "path": `/TodoList/thingsController.do?operate=updateThing&listId=${id}&index=${this.data.index}&title=${encodeURIComponent(this.data.thingName)}&type=${this.data.type}&name=${encodeURIComponent(this.data.name)}&time=${this.data.time}&remark=${encodeURIComponent(this.data.remark)}&done=${this.data.done}`,
        "header": {
          "X-WX-SERVICE": "todo-list",
          "content-type": "application/json"
        },
        "method": "GET",
        "data": ""
      })
      this.hideModal()
      this.getList()
    },

    async delThing() {
      let id = -1
      if (this.data.listId >= 5) {
        id = this.data.listId - 5
      } else {
        id = this.data.listId
      }
      await wx.cloud.callContainer({
        "config": {
          "env": "prod-2gwzli5a668f1961"
        },
        "path": `/TodoList/thingsController.do?operate=delete&listId=${id}&index=${this.data.index}`,
        "header": {
          "X-WX-SERVICE": "todo-list",
          "content-type": "application/json"
        },
        "method": "GET",
        "data": ""
      })
      this.hideModal()
      this.getList()
    },

    showAddThing() {
      this.setData({
        showAddThings: true,
        addList: false,
        addThingName: '',
        addThingNote: '',
        addThingTime: '',
      })
    },

    handleChange(e) {
      this.setData({
        addThingTime: e.detail.dateString
      })
    },
    async submitThing1() {

      if (this.data.addThingTime != '') {
        var that = this;
        wx.requestSubscribeMessage({
          tmplIds: ['TXI-MQahiffvtlk7OYdAldaCcwG741kv3rZu6huMB_o'],
          success(res) {
            var now_time = new Date().getTime()
            var end_time = new Date(that.data.addThingTime).getTime()
            var remark = that.data.remark
            if (remark === undefined || remark === null || remark === '') {
              remark = '无'
            }
            console.log(remark, that.data.addThingName, that.data.addThingTime)
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
                  }).then(res => console.log('成功', res)).catch(res => console.log('失败', res))
                }, end_time - now_time);
            }
          },
          fail(err) {
            console.log('错误', err)
          }
        })
      }

      let itype = -1;
      if (this.data.listId != 5) {
        itype = 0
      } else {
        itype = 1
      }

      const res = await wx.cloud.callContainer({
        "config": {
          "env": "prod-2gwzli5a668f1961"
        },
        "path": `/TodoList/thingsController.do?operate=addThing&title=${encodeURIComponent(this.data.addThingName)}&remark=${encodeURIComponent(this.data.addThingNote)}&time=${encodeURIComponent(this.data.addThingTime)}&type=${itype}&name=${encodeURIComponent(this.data.listName)}`,
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
        showAddThings: false
      })

      await this.getList()


    },

    async doneThing(e) {
      let index = e.currentTarget.dataset.index
      await wx.cloud.callContainer({
        "config": {
          "env": "prod-2gwzli5a668f1961"
        },
        "path": `/TodoList/thingsController.do?operate=doneThing&listId=${this.data.listId}&index=${index}`,
        "header": {
          "X-WX-SERVICE": "todo-list",
          "content-type": "application/json"
        },
        "method": "GET",
        "data": ""
      })
      await this.getList()
    },

    async delProject(e) {
      let name = e.currentTarget.dataset.name
      await wx.cloud.callContainer({
        "config": {
          "env": "prod-2gwzli5a668f1961"
        },
        "path": `/TodoList/projectController.do?operate=delProject&name=${encodeURIComponent(name)}`,
        "header": {
          "X-WX-SERVICE": "todo-list",
          "content-type": "application/json"
        },
        "method": "GET",
        "data": ""
      })

      router.gotoPage('/index')
    }
  }
})