import router from '../../router/index'

// miniprogram/pages/searchPage/searchPage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    keywords:'',
    things:[],
    thingName:'',
    id:0,
    addThingTime:'',
    remark:'',
  },

  async submitThing(e){
    await wx.cloud.callContainer({
      "config": {
        "env": "prod-2gwzli5a668f1961"
      },
      "path": `/TodoList/thingsController.do?operate=update&title=${encodeURIComponent(this.data.thingName)}&id=${this.data.id}&time=${this.data.addThingTime}&done=false&remark=${encodeURIComponent(this.data.remark)}`,
      "header": {
        "X-WX-SERVICE": "todo-list",
        "content-type": "application/json"
      },
      "method": "GET",
      "data": ""
    })
    this.hideModal()
    let _this = this
    _this.onShow()
  },

  async del(){
    await wx.cloud.callContainer({
      "config": {
        "env": "prod-2gwzli5a668f1961"
      },
      "path": `/TodoList/thingsController.do?operate=deleteID&id=${this.data.id}`,
      "header": {
        "X-WX-SERVICE": "todo-list",
        "content-type": "application/json"
      },
      "method": "GET",
      "data": ""
    })
    this.hideModal()
    let _this = this
    _this.onShow()
  },

  handleChange(e) {
    this.setData({
      addThingTime: e.detail.dateString
    })
  },

  showModal(e) {
    this.setData({
      index: e.currentTarget.dataset.index,
    })
    this.setData({
      thingName: this.data.things[this.data.index].title,
      remark: this.data.things[this.data.index].remark,
      id:this.data.things[this.data.index]._id,
      modalName: 'Modal',

    })
  },

  hideModal(e) {
    this.setData({
      modalName: null,
    })
  },

  async getThings(){
    const res = await wx.cloud.callContainer({
      "config": {
        "env": "prod-2gwzli5a668f1961"
      },
      "path": `/TodoList/thingsController.do?operate=search&keyword=${encodeURIComponent(this.data.keywords)}`,
      "header": {
        "X-WX-SERVICE": "todo-list",
        "content-type": "application/json"
      },
      "method": "GET",
      "data": ""
    })

    this.setData({
      things : res.data.data.results
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    this,this.setData({
      keywords : options.keywords
    })
    await this.getThings()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  async onShow() {
    await this.getThings()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})