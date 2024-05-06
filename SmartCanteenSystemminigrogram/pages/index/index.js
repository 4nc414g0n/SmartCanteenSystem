
Page({
  /**
   * 页面的初始数据
   */
  data: {
      mglist: ["http://47.100.50.78:8081/images/ptxy5.jpg","http://47.100.50.78:8081/images/ptxy.jpg","http://47.100.50.78:8081//images/ptxy1.jpg"],
      rmbs: "",
      msgList: [{text: "周日四餐不开"},{text: "周一三餐不开"},{text: "周二二餐不开"}]
  },
  POSThotstore(){
    wx.request({
      url: 'http://47.100.50.78:8081/wx_json',
      method: "POST",
      header: {
        'content-type': 'application/json' //设置请求的 header
      },
      data: {
        rqType: 'hotstore', //需要发送的请求参数
        dbType: 'Hot',
        insert:'0',
      },
      success:(res)=>{
        console.log(res)
        this.setData({
            rmbs:res.data.slice(1)
        })
      },
      fail: (res) => {
        // 请求失败的处理
        console.log(res)
      }
    })
  },
  showlist(){
    wx.switchTab({
      url: '../store/store',
    })
  },
  showbs:function(e){
    wx.navigateTo({
      url:'/pages/cart/cart?storename='+e.currentTarget.dataset.storename,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.POSThotstore();  ///获取热门店铺
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
