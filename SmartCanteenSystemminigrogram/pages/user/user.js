// pages/user/user.js

var QRCode = require('../../utils/weapp-qrcode.js'); //页面js中引入 onload中初始化二维码 定义按钮的事件处理函数
var qrcode;
//console.log("全局data", app.globalData);
const app = getApp();
//生成20位随机字符

Page({
    /**
     * 页面的初始数据
     */
    data: {
        nickname: '',
        avatar: 'http://47.100.50.78:8081/images/avatar.jpg',
        user_id: '',  
        openid: '',
        submit: 'no',
        balance: '',
        isShow1:false, //充值弹窗
        isShow2:false, //二维码弹窗
        addbalance:'',
        tmpnickname: 'http://47.100.50.78:8081/images/avatar.jpg',
    },
    // QueryDb(){
    //   let openid1 =wx.getStorage('openid');
      
    // },
    getinput(e){
      console.log("balance",e.detail.value)
      this.setData({
        addbalance:e.detail.value
      })
    },
    nickName(e){
      // var that = this
      this.setData({
        nickname:e.detail.value
      })
      console.log("数据集", this.data)
   }, 
    onChooseAvatar(e) {
      // var that = this
      this.setData({
        tmpnickname:e.detail.avatarUrl
      })
      console.log("tmpdata",this.data.tmpnickname)
    //   //将头像保存到后端
    //   wx.uploadFile({
    //     url: 'http://47.100.50.78:8081/upload',
    //     filePath: e.detail.avatarUrl, //头像文件
    //     name: 'file',
    //     header: {
          
    //     },
    //     success: (uploadFileRes) => {
    //       console.log("上传文件",uploadFileRes.data);
    //       that.setData({
    //         avatar:uploadFileRes.data.avatar
    //       })
    //     },
    //     fail: (uploadFileRes) => {
    //       console.log("失败",uploadFileRes);
    //     }
    //   });
    //   console.log("选择头像完成",this.data)
    },
    setsubmit(){ //提交页面
      var sqlfailed = 0;
      wx.login({
        success: (res) =>{
          if (res.code) {
            var d = app.globalData;//这里存储了appid、secret、token串
            var l = 'https://api.weixin.qq.com/sns/jscode2session?appid=' + d.appid + '&secret=' + d.secret + '&js_code=' + res.code + '&grant_type=authorization_code';
            wx.request({
              url: l,
              data: {},
              method: 'GET',
              success:(res) => {
                console.log("GET res: ",res)
                // var obj = {};
                // obj.openid = res.data.openid;
                // obj.expires_in = Date.now() + res.data.expires_in;
                wx.setStorageSync('openid', res.data.openid);
                app.globalData.openid = res.data.openid
                console.log("全局openid",app.globalData.openid)
                this.setData({
                  openid : res.data.openid
                }),
                //存储openid
                console.log("openid", this.data.openid)
                console.log("data",this.data)
                wx.request({
                  url: 'http://47.100.50.78:8081/wx_json',
                  method: "POST",
                  header: {
                    'content-type': 'application/json' //设置请求的 header
                  },
                  data: {
                    rqType: 'checklogin', //需要发送的请求参数
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
                          balance:res.data[1].balance
                      })
                      app.globalData.user_id = res.data[1].user_id
                      this.setData({
                        submit:''
                      })
                      console.log("data",this.data)
                    }else if(res.data[0].sqlstatus == "0")//查询数据库失败，查无此人
                    {
                      console.log("查无此人")
                      console.log("开始注册")
                      this.setData({
                        submit:'yes'
                      })
                    } 
                  }
                })
              }
            });
          } else {
            console.log('获取用户登录态失败！' + res.errMsg)
          }
        }
      });
    },
    login(){
      wx.request({
        url: 'http://47.100.50.78:8081/wx_json',
        method: "POST",
        header: {
          'content-type': 'application/json' //设置请求的 header
        },
        data: {
          rqType: 'register', //需要发送的请求参数
          dbType: 'wxUser',
          insert: '1',
          openid: this.data.openid,
          nickname: this.data.nickname,
          avatar: this.data.avatar,
        },
        success:(res)=>{
          console.log("已上传",res.data)
          app.globalData.user_id = res.data.user_id
          this.setData({
              balance:res.data.balance,
              user_id:res.data.user_id,
          })
          console.log("全局user_id",app.globalData.user_id)
        }
      })
      this.setData({
        submit:'no'
      })
      console.log("最后来看",this.data)
    },


    // login(){
    //   var that = this;
      
    // },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      qrcode = new QRCode('canvas', { ///先完成二维码初始工作
        text: "code=00000000000",
        width: 210,
        height: 210,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H,
      });
      let openid1 = wx.getStorageSync('openid')
      if(openid1!='')
      {
        app.globalData.openid = openid1
        //通过openid获取用户信息
        var that = this
        wx.request({
          url: 'http://47.100.50.78:8081/wx_json',
          method: "POST",
          header: {
            'content-type': 'application/json' //设置请求的 header
          },
          data: {
            rqType: 'checklogin', //需要发送的请求参数
            dbType: 'wxUser',
            insert: '0',
            openid: openid1
          },
          success:(res)=>{
            console.log("res",res)
            this.setData({
                nickname:res.data[1].nickname,
                avatar:res.data[1].avatar,
                balance:res.data[1].balance,
                openid:openid1
            })
            app.globalData.user_id = res.data[1].user_id
          },
          fail: (res) => {
            // 请求失败的处理
            console.log(res)
          }
        })
      }
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },
    hidepop(e){ //隐藏pop
      if(e.currentTarget.dataset.canclose)
      {
        if(this.data.isShow1 == true){
          this.setData({
            isShow1:!this.data.isShow1
          })
        }
        if(this.data.isShow2 == true){
          this.setData({
            isShow2:!this.data.isShow2
          })
        }
      }
    },
    showpop(){ //充值的pop
      if(this.data.openid=='')
      {
        wx.showToast({
          title: '未有权限请登录',
          icon: 'loading',
          duration: 2000 
        })
      }
      else{
        this.setData({
          isShow1:!this.data.isShow1
        })
      }
    },
    showqrcode(){ //二维码的pop
      console.log("openid",this.data.openid)
      if(this.data.openid=='')
      {
        wx.showToast({
          title: '未有权限请登录',
          icon: 'loading',
          duration: 2000 
        })
      }
      else{
        qrcode.makeCode(app.globalData.user_id);
        this.setData({
          isShow2:!this.data.isShow2
        })
      }
    },
    pay(e){ //充值
      wx.request({
        url: 'http://47.100.50.78:8081/wx_json',
        method: "POST",
        header: {
          'content-type': 'application/json' //设置请求的 header
        },
        data: {
          rqType: 'addbalance', //需要发送的请求参数
          dbType: 'wxUser',
          insert: '1',
          addbalance:this.data.addbalance,
          openid:this.data.openid
        },
        success:(res)=>{
          
          console.log("resdata",res.data)
        }
      })
      this.setData({
        isShow1:false
      })
    },
    showgrzl:function(e){  //也可直接判断openid是否为空
      if(e.currentTarget.id!=''){
        console.log(e.currentTarget.id);
        var openidto=e.currentTarget.id
        wx.navigateTo({
          url: '../userprofile/userprofile? list_id= '+openidto,
      })}else{
        wx.showToast({
          title: '请登录',
          icon: 'loading',
          duration: 2000
        })}
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
      let openid1 = wx.getStorageSync('openid')
      if(openid1!='')
      {
        app.globalData.openid = openid1
        //通过openid获取用户信息
        var that = this
        wx.request({
          url: 'http://47.100.50.78:8081/wx_json',
          method: "POST",
          header: {
            'content-type': 'application/json' //设置请求的 header
          },
          data: {
            rqType: 'checklogin', //需要发送的请求参数
            dbType: 'wxUser',
            insert: '0',
            openid: openid1
          },
          success:(res)=>{
            console.log("res",res)
            this.setData({
                nickname:res.data[1].nickname,
                avatar:res.data[1].avatar,
                balance:res.data[1].balance,
                openid:openid1,
                user_id:res.data[1].user_id
            })
            app.globalData.user_id = res.data[1].user_id
          },
          fail: (res) => {
            // 请求失败的处理
            console.log(res)
          }
        })
      }
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

    },
    onShareAppMessage() {
      const promise = new Promise(resolve => {
        setTimeout(() => {
          resolve({
            title: '自定义转发标题'
          })
        }, 2000)
      })
      return {
        title: '自定义转发标题',
        path: '/index/index',
        promise 
      }
    },
    onShareTimeline:function(){
      title: '自定义转发标题'
    }
})