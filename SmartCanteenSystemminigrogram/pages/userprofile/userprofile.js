// pages/userprofile/userprofile.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    change:'0',
    openid:'',
    userid:'',
    name:'',
    phone:'',
    school:'',
    address:'',
    age:'',
    vip:'',
    nickname:'',
    avatar:'',
    balance:'',
  },
  getinput(e){
    if(e.currentTarget.id=="name")
    {
      this.setData({
        name:e.detail.value,
      })
    }
    if(e.currentTarget.id=="phone")
    {
      this.setData({
        phone:e.detail.value,
      })
    }
    if(e.currentTarget.id=="school")
    {
      this.setData({
        school:e.detail.value,
      })
    }
    if(e.currentTarget.id=="address")
    {
      this.setData({
        address:e.detail.value,
      })
    }
    if(e.currentTarget.id=="age")
    {
      this.setData({
        age:e.detail.value,
      })
    }
    if(e.currentTarget.id=="vip")
    {
      this.setData({
        vip:e.detail.value,
      })
    }
    console.log("data getinput",this.data)
  },
  changeinfo(e){
    this.setData({
      change:'1',
    })
  },
  changeinfotoserver(e){
    wx.request({
      url: 'http://47.100.50.78:8081/wx_json',
      method: "POST",
      header: {
        'content-type': 'application/json' //设置请求的 header
      },
      data: {
        rqType: 'setuserinfo', //需要发送的请求参数
        dbType: 'wxUser',
        insert: '1',
        openid: this.data.openid,
        name:this.data.name,
        phone:this.data.phone,
        school:this.data.school,
        address:this.data.address,
        age:this.data.age,
        vip:this.data.vip,
      },
      success:(res)=>{
        console.log("res",res)
      }
    })
    this.setData({
      change:'0',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const app = getApp()
    var  openid1 = app.globalData.openid
    var  user_id1 = app.globalData.user_id
    this.setData({
      openid:openid1,
      user_id:user_id1
    }) 
    wx.request({
      url: 'http://47.100.50.78:8081/wx_json',
      method: "POST",
      header: {
        'content-type': 'application/json' //设置请求的 header
      },
      data: {
        rqType: 'getuserinfo', //需要发送的请求参数
        dbType: 'wxUser',
        insert: '0',
        openid: this.data.openid
      },
      success:(res)=>{
        console.log("res",res)
        if(res.data[0].sqlstatus == "1")
        {
          console.log("查有此人")
          this.setData({
              nickname:res.data[1].nickname,
              avatar:res.data[1].avatar,
              balance:res.data[1].balance,
              name:res.data[1].name,
              school:res.data[1].school,
              age:res.data[1].age,
              address:res.data[1].address,
              phone:res.data[1].phone,
              vip:res.data[1].vip,
          })
          console.log("data",this.data)
        }
      }
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