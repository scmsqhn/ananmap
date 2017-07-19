/* path: ./zanui-weapp-master/app.js
 *
 */
var ananmap = require('./utils/ananmap.js');

App({
  globalData: {
    userInfo: null
  },
  onLaunch: function () {
    var that = this
      //调用API从本地缓存中获取数据
      console.log("onLauncher")
      var logs = wx.getStorageSync('logs') || []
      logs.unshift(Date.now())
      wx.setStorageSync('logs', logs)
      this.getUserInfo(console.log)//此处有重复,后续优化

      
  },
  getUserInfo: function (cb) {
    var that = this;
    console.log("getUserInfo")
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo;
              typeof cb == "function" && cb(that.globalData.userInfo);
              ananmap.loginIn(console.log)	    

            }
          })
        }
      });
    }
    console.log("login" + this.globalData)
  },
})
