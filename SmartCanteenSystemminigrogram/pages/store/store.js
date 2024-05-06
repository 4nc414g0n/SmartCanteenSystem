// pages/store/store.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      list: [],
      list_id:'',
      inputData:''
  },
  input(e) {
    this.setData({
      inputData: e.detail.value // 将输入框数据存储到变量中
    });
    this.search(e.detail.value)
  },
  confirm(e) {
    this.data.inputData = e.currentTarget.dataset.input; // 获取按钮上存储的输入框数据
    console.log("输入框数据为：",this.data.inputData);
    this.search(this.data.inputData)
  },

  search(key) {
    var that = this
    //从本地缓存中异步获取指定 key 的内容
    var list = wx.getStorage({
      key: 'list',
      //从Storage中取出存储的数据
      success:(res)=>{
        console.log("storage res", res)
        if (key == '') { //用户没有输入时全部显示
          var arr = []; //临时数组，用于存放匹配到的数组, 全部添加show=true
          for (let i in res.data) {
            res.data[i].show = true; //让匹配到的数据显示
            arr.push(res.data[i])
          }
          this.setData({
            list: arr
          })
          console.log("arr数组", this.data.list)
          return;
        }
        var arr = []; //临时数组，用于存放匹配到的数组
        for (let i in res.data) {
          res.data[i].show = false; //所有数据隐藏 （新加一个show项）
          if (res.data[i].storename.indexOf(key) >= 0) {
            res.data[i].show = true; //让匹配到的数据显示
            arr.push(res.data[i])
          }
        }
        console.log("arr数组", arr)
        if (arr.length == 0) {
          that.setData({
            list: [{
              show: false,
              storename: '没有相关数据！'
            }]
          })
        } else {
          that.setData({
            list: arr
          })
        }
      },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      list_id:options.list_id
    })
    console.log( this.data.list_id),
    wx.request({
      url: 'http://47.100.50.78:8081/wx_json',
      method: "POST",
      header: {
        'content-type': 'application/json' //设置请求的 header
      },
      data: {
        rqType: 'queryallstore', //需要发送的请求参数
        dbType: 'Store',
        insert: '0',
      },
      success:(res)=>{
        console.log("res",res)
        wx.setStorage({
          key: 'list',
          data: res.data.slice(1)
        })
        this.setData({
          list: res.data.slice(1),
        })
      }
    })      
  },
  showbs:function(e){
    console.log(e.currentTarget.dataset.storename)
    wx.navigateTo({
      url:'/pages/cart/cart?storename='+e.currentTarget.dataset.storename,
  })
},
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})