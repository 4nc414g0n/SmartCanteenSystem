// page/cart/cart.js
const app = getApp();
var currentDate = new Date(); //获取时间戳用
function generateRandomString(length) {
  const characters = '0123456789';
  let randomString = '';
  for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomString += characters.charAt(randomIndex);
  }
  return randomString;
}
Page({
    
    /**
     * 页面的初始数据
     */
    data: {
        user_id: '',   //用于授权此页面
        storename:'',  //店铺命，查库用
        rmb:'',        //店铺菜品集合
        rmblen: 0,     //food项数
        buttonshow: [],//每个项是否显示按钮(true显示按钮，false显示选择数量)
        // buttonindex: 0,//按钮所属项对应的下标
        cartnum: [],   //每个项对应加入购物车的数
        allmoney: '0.00',
        lockernum: 4, //默认4个locker
        locker: [], //bool判断locker 序号从1开始 判断是否可用
        tmpList: [],//用于弹窗选择餐柜显示问题(解决异步问题)
        reserved_locker_id: 0, //默认无locker
        balance: '',//余额
    }, 
    GetlockerAndBalance(){
      //查询储存柜占用信息
      let tmpArray = new Array(this.data.lockernum+1).fill(true);
      this.setData({
        locker:tmpArray
      })
      wx.request({
        url: 'http://47.100.50.78:8081/wx_json',
        method: "POST",
        header: {
          'content-type': 'application/json' //设置请求的 header
        },
        data: {
          rqType: 'queryreserved_locker_id', //需要发送的请求参数
          dbType: 'OrderRecord',
          insert: '0',
        },
        success:(res)=>{
          console.log("res",res)
          if(res.data[0].sqlstatus=="1") //locker已有被占用的
          {
            for(let i = 1;i<res.data.length;i++)
            {
              if(res.data[i].reserved_locker_id == "1") this.data.locker[0] = false;
              else if(res.data[i].reserved_locker_id == "2") this.data.locker[1] = false;
              else if(res.data[i].reserved_locker_id == "3") this.data.locker[2] = false;
              else if(res.data[i].reserved_locker_id == "4") this.data.locker[3] = false;
            }
            
          }
          console.log("GetlockerAndBalance:locker",this.data.locker);
          let tmpList = new Array(this.data.lockernum);
          console.log("选择餐柜",this.data.locker)
          for(let i = 0;i<this.data.lockernum;i++)
          {
            if(this.data.locker[i]==true){
              tmpList[i] = String(i+1)+"号餐柜可选"
            }
            else if((this.data.locker[i]==false)){
              tmpList[i] = String(i+1)+"号餐柜被占用不可选"
            }
          }
          this.setData({
            tmpList:tmpList
          })
          wx.request({        //请求余额
            url: 'http://47.100.50.78:8081/wx_json',
            method: "POST",
            header: {
              'content-type': 'application/json' //设置请求的 header
            },
            data: {
              rqType: 'querymoney', //需要发送的请求参数
              dbType: 'wxUser',
              insert: '0',
              openid:app.globalData.openid,
            },
            success:(res)=>{
              console.log("res",res)
              this.setData({
                balance:res.data[1].balance
              })
              console.log("GetlockerAndBalance:balance",this.data.balance);
            },
          }) 
        },
      }) 
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) { //初始化的时候应该先检查订单占用的餐柜(舵机)与用户的余额
        this.setData({
            storename:options.storename
          })
        console.log("storename", this.data.storename)
        const app = getApp()
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
            rqType: 'querystorefood', //需要发送的请求参数
            dbType: 'Food',
            insert: '0',
            storename:this.data.storename
          },
          success:(res)=>{
            console.log("res",res)
            this.setData({
              rmb: res.data.slice(1),
              rmblen: res.data.length-1,
            })
            console.log("rmb",this.data.rmb)
            //初始化填满buttonshow（true）
            let boolArray = new Array(this.data.rmblen).fill(true);
            console.log("buttonshow",boolArray)
            this.setData({
              buttonshow: boolArray,
            })
            //初始化填满cartnum（1）
            let tmpArray = new Array(this.data.rmblen).fill(0);
            console.log("cartnum",tmpArray)
            this.setData({
              cartnum: tmpArray,
            })
          },
        }) 
    },
    showsq: function () {
        wx.switchTab({
            url: '../user/user',
        })
    }, 
    add(e){
      let newArray1 = this.data.cartnum.slice(); // 创建副本，避免直接修改原数组
      newArray1[e.currentTarget.dataset.index] += 1; // 第一次加入购物车将数量设为1
      let summoney = ((parseFloat(this.data.allmoney) + parseFloat(this.data.rmb[e.currentTarget.dataset.index].price))).toFixed(2)
      this.setData({
          cartnum: newArray1,
          allmoney:summoney
      });
      console.log("cartnum",this.data.cartnum)
    },
    reduce(e){
      let newArray1 = this.data.cartnum.slice(); // 创建副本，避免直接修改原数组
      newArray1[e.currentTarget.dataset.index] -= 1; 
      let summoney = ((parseFloat(this.data.allmoney) - parseFloat(this.data.rmb[e.currentTarget.dataset.index].price))).toFixed(2)
      this.setData({
          cartnum: newArray1,
          allmoney:summoney
      });
      if(this.data.cartnum[e.currentTarget.dataset.index] == 0){ //重新显示button
        let newArray = this.data.buttonshow.slice(); // 创建副本，避免直接修改原数组
        newArray[e.currentTarget.dataset.index] = true; // 第一次加入购物车将数量设为1
        this.setData({
            buttonshow: newArray,
        });
      }
      console.log("cartnum",this.data.cartnum)
      
    },
    addCart(e){
      let newArray = this.data.buttonshow.slice(); // 创建副本，避免直接修改原数组
      newArray[e.currentTarget.dataset.index] = false; // 修改第 index 个元素为 false
      let newArray1 = this.data.cartnum.slice(); // 创建副本，避免直接修改原数组
      newArray1[e.currentTarget.dataset.index] += 1; // 第一次加入购物车将数量设为1
      let summoney = ((parseFloat(this.data.allmoney) + parseFloat(this.data.rmb[e.currentTarget.dataset.index].price))).toFixed(2)
      this.setData({
          buttonshow: newArray,
          cartnum: newArray1,
          allmoney:summoney
      });
      wx.showToast({
          title: '添加成功',
          icon: 'success',
          duration: 500
      })
      console.log("cartnum",this.data.cartnum)
      console.log("now buttonshow：",this.data.buttonshow);
    },
    payAll(){ //弹出选项选择餐柜
      this.GetlockerAndBalance()
      wx.showActionSheet({
        itemList: this.data.tmpList,
        success:(res)=>{
          if(this.data.locker[res.tapIndex] == false){ //已被选择
            wx.showToast({
              title: '餐柜不可用',
              icon:'error',
              duration: 500
            })
          }
          else{ //成功选择
            this.setData({
              reserved_locker_id:String(res.tapIndex+1) //设置柜锁
            })
            console.log("余额：",this.data.balance)
            console.log("一共：",this.data.allmoney)
            if(parseFloat(this.data.balance)>=parseFloat(this.data.allmoney))
            {
              let timestamp = currentDate.getTime();
              const orderid = generateRandomString(20);
              for(let i=0;i<this.data.rmblen;i++){ //有几个foodname发送几次
                if(this.data.buttonshow[i] == false)
                {
                  wx.request({
                    url: 'http://47.100.50.78:8081/wx_json',
                    method: "POST",
                    header: {
                      'content-type': 'application/json' //设置请求的 header
                    },
                    data: {
                      rqType: 'insertorder', //需要发送的请求参数
                      dbType: 'OrderRecord',
                      insert: '1',
                      timestamp1:timestamp,
                      orderid:orderid,
                      foodname:this.data.rmb[i].foodname,
                      number:this.data.cartnum[i],
                      price:this.data.rmb[i].price,
                      openid: app.globalData.openid,
                      storename: this.data.storename,
                      photo: this.data.rmb[i].photo,
                      reserved_locker_id: this.data.reserved_locker_id,
                      allprice:this.data.allmoney
                    },
                    success:(res)=>{
                      console.log("res",res)
                    },
                  }) 
                } 
              }
              wx.request({
                url: 'http://47.100.50.78:8081/wx_json',
                method: "POST",
                header: {
                  'content-type': 'application/json' //设置请求的 header
                },
                data: {
                  rqType: 'paycartmoney', //需要发送的请求参数
                  dbType: 'wxUser',
                  insert: '1',
                  allmoney:this.data.allmoney,
                  openid:app.globalData.openid,
                },
                success:(res)=>{
                  console.log("res",res)
                  wx.showToast({
                    title: '支付成功',
                    icon: 'success',
                    duration: 500
                  })
                  console.log("现在导航到订单页面")
                  wx.switchTab({
                    url: '../order/order',
                  })
                },
              })
            }
            else{
              wx.showToast({
                title: '余额不足',
                icon: 'error',
                duration: 500
              })
            }
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
    onShow: function () {  //初始化的时候应该先检查订单占用的餐柜(舵机)与用户的余额

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