// pages/dingdan/dingdan.js
const app = getApp();
var currentDate = new Date(); //获取时间戳用
let tmpallorder = [];
let tmpallfetchedorder = [];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user_id: '',
    openid: '',

    orderfetchedShow: false, //false显示待取订单 true显示已取订单 
    orderids:[],     
    //以orderid分组,每一项的orderid都不同，包括[{"orderid":"12131314","timestamp1":"13351","allprice",reserved_locker_id}{}...]
    allorder: [], //订单最多一百条
    //下标和orderid下标对应一个[]内的orderid都是一样的如：[{}{}{}][][][][]
    orderfetchedids:[],     
    //同理
    allfetchedorder:[],
    //同理
  },
  fetch(e){
    this.setData({
      orderfetchedShow:false
    })
  },
  fetched(e){
    this.setData({
      orderfetchedShow:true
    })
  },
  openlocker(e){
    let timestamp2 = currentDate.getTime();
    let orderid = e.currentTarget.dataset.orderid;
    let reserved_locker_id = e.currentTarget.dataset.reserved_locker_id;
    wx.request({                         //设置订单
      url: 'http://47.100.50.78:8081/wx_json',
      method: "POST",
      header: {
        'content-type': 'application/json' //设置请求的 header
      },
      data: {
        rqType: 'changeorderidfetched', //需要发送的请求参数
        dbType: 'OrderRecord',
        insert: '0',
        orderid: orderid,
        timestamp2:timestamp2,
      },
      success:(res)=>{
        // console.log("res",res)
        // wx.reLaunch({
        //   url: '../dingdan/dingdan', // 替换为当前页面路径
        // });
        let pages = getCurrentPages();
        let currentPage = pages[pages.length - 1];
        currentPage.onLoad();
      },
    }) 
    wx.request({                                 //   开锁异步进行
      url: 'http://47.100.50.78:8081/wx_json',
      method: "POST",
      header: {
        'content-type': 'application/json' //设置请求的 header
      },
      data: {
        rqType: 'openlocker', //需要发送的请求参数
        dbType: 'wxUser',
        insert: '0',
        openid:this.data.openid,
        reserved_locker_id:reserved_locker_id,
      },
      success:(res)=>{
      },
    })
  },

  showsq: function () {
    wx.switchTab({
      url: '../user/user',
    })
  },
  QueryAllOrder1(length){
    tmpallorder = [];
    var that = this;
    let i = 0;
    const _QueryAllOrder1 = () => {
        if (i < length) {
          let suballorder = [];
          wx.request({
            url: 'http://47.100.50.78:8081/wx_json',
            method: "POST",
            header: {
              'content-type': 'application/json' //设置请求的 header
            },
            data: {
              rqType: 'queryallorderid',
              dbType: 'OrderRecord',
              insert: '0',
              orderid: this.data.orderids[i].orderid,
              openid: app.globalData.openid,
            },
            success: (res) => {
              // console.log("内部res",res)
              suballorder = res.data.slice(1);
              console.log("内部suballorder", suballorder);
              tmpallorder.push(suballorder);
              // console.log("push进tmpallorder：",tmpallorder)
              i++;
              if (i == length) {
                console.log("最后一次tmpallorder：", tmpallorder);
                console.log("最后一次tmpallorder[0]：", tmpallorder[0]);
                this.setData({
                  allorder: tmpallorder
                });
                console.log("最后一次that allorder：", this.data.allorder[0]);
              }
              _QueryAllOrder1();
            },
          });
      };
    }
    _QueryAllOrder1()
  },
  QueryAllOrder2(length){
    tmpallfetchedorder = [];
    var that = this;
    let i = 0;
    const _QueryAllOrder2 = () => {
        if (i < length) {
          let suballorder = [];
          wx.request({
            url: 'http://47.100.50.78:8081/wx_json',
            method: "POST",
            header: {
              'content-type': 'application/json' //设置请求的 header
            },
            data: {
              rqType: 'queryallorderid',
              dbType: 'OrderRecord',
              insert: '0',
              orderid: this.data.orderfetchedids[i].orderid,
              openid: app.globalData.openid,
            },
            success: (res) => {
              // console.log("内部res",res)
              suballorder = res.data.slice(1);
              console.log("内部suballorder", suballorder);
              tmpallfetchedorder.push(suballorder);
              // console.log("push进tmpallorder：",tmpallorder)
              i++;
              if (i == length) {
                console.log("最后一次tmpallfetchorder：", tmpallfetchedorder);
                console.log("最后一次tmpallfetchorder[0]：", tmpallfetchedorder[0]);
                this.setData({
                  allfetchedorder: tmpallfetchedorder
                });
                console.log("最后一次that allfetchedorder：", this.data.allfetchedorder);
              }
              _QueryAllOrder2();
            },
          });
      };
    }
    _QueryAllOrder2()
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      orderids: [],
      allorder: [],
      orderfetchedids: [],
      allfetchedorder: [],
    })
    var user_id = app.globalData.user_id
    var openid = app.globalData.openid
    this.setData({
      user_id: user_id,
      openid:openid,
    })
    wx.request({
      url: 'http://47.100.50.78:8081/wx_json',
      method: "POST",
      header: {
        'content-type': 'application/json' //设置请求的 header
      },
      data: {
        rqType: 'queryorderid', //需要发送的请求参数
        dbType: 'OrderRecord',
        insert: '0',
        fetched: '0',
        openid: app.globalData.openid,
      },
      success:(res)=>{
        // console.log("res",res)
        if(res.data[0].sqlstatus == "1")
        {
          this.setData({
            orderids:res.data.slice(1)
          })
          tmpallorder = [];
          this.QueryAllOrder1(this.data.orderids.length); //递归调用保证获取顺序
        }
      },
    }) 
    wx.request({
      url: 'http://47.100.50.78:8081/wx_json',
      method: "POST",
      header: {
        'content-type': 'application/json' //设置请求的 header
      },
      data: {
        rqType: 'queryorderid', //需要发送的请求参数
        dbType: 'OrderRecord',
        insert: '0',
        fetched: '1',
        openid: app.globalData.openid,
      },
      success:(res)=>{
        console.log("orderfetchedids",res.data)
        if(res.data[0].sqlstatus == "1")
        {
          this.setData({
            orderfetchedids:res.data.slice(1)
          })
          this.QueryAllOrder2(this.data.orderfetchedids.length); //递归调用保证获取顺序
        }
      },
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
    this.setData({
      orderids: [],
      allorder: [],
      orderfetchedids: [],
      allfetchedorder: [],
    })
    var user_id = app.globalData.user_id
    this.setData({
      user_id: user_id,
    })
    wx.request({
      url: 'http://47.100.50.78:8081/wx_json',
      method: "POST",
      header: {
        'content-type': 'application/json' //设置请求的 header
      },
      data: {
        rqType: 'queryorderid', //需要发送的请求参数
        dbType: 'OrderRecord',
        insert: '0',
        fetched: '0',
        openid: app.globalData.openid,
      },
      success:(res)=>{
        // console.log("res",res)
        if(res.data[0].sqlstatus == "1")
        {
          this.setData({
            orderids:res.data.slice(1)
          })
          tmpallorder = [];
          this.QueryAllOrder1(this.data.orderids.length); //递归调用保证获取顺序
        }
      },
    }) 
    wx.request({
      url: 'http://47.100.50.78:8081/wx_json',
      method: "POST",
      header: {
        'content-type': 'application/json' //设置请求的 header
      },
      data: {
        rqType: 'queryorderid', //需要发送的请求参数
        dbType: 'OrderRecord',
        insert: '0',
        fetched: '1',
        openid: app.globalData.openid,
      },
      success:(res)=>{
        // console.log("res",res)
        if(res.data[0].sqlstatus == "1")
        {
          this.setData({
            orderfetchedids:res.data.slice(1)
          })
          tmpallorder = [];
          this.QueryAllOrder2(this.data.orderfetchedids.length); //递归调用保证获取顺序
        }
      },
    }) 
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