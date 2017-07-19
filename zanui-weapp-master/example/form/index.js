var ananmap = require('../../utils/ananmap.js');
var app = getApp();
Page({
  data: {
    area: ['wind'],
//    area: ['roomname', 'snow', 'wind', 'follower', 'moon'],
//    area: ['可选房间号', '听音阁', '白虎堂', '聚义厅', '观澜湖', '内蒙古自治区', '辽宁省', '吉林省', '黑龙江省', '上海市', '江苏省', '浙江省', '安徽省', '福建省', '江西省', '山东省', '河南省', '湖北省', '湖南省', '广东省', '广西壮族自治区', '海南省', '重庆市', '四川省', '贵州省', '云南省', '西藏自治区', '陕西省', '甘肃省', '青海省', '宁夏回族自治区', '新疆维吾尔自治区', '台湾省', '香港特别行政区', '澳门特别行政区'],
    areaIndex: 0,
    myUserInfo: {},
  },

  onLoad: function () {
      var that = this
      console.log(app.globalData.userInfo)
      var userInfo = app.globalData.userInfo
      that.setData({
          myUserInfo: userInfo
      })
  },

  onShow: function () {
  },

  onAreaChange: function (e) {
    this.setData({
      areaIndex: e.detail.value
    });
  },
  createRoom: function(e) {
    wx.navigateTo({
        url: '../createroom/index'
  },
  confirmRoom: function(e) {
      var that = this
      console.log(that.data.area[that.data.areaIndex])
      ananmap.inRoom(that.data.area[that.data.areaIndex], console.log)
      console.log('[x] confirmroom ', that.data.area[that.data.areaIndex])
      var data = {};
	  data["curRoom"] = (that.data.area[that.data.areaIndex]);
	  data = JSON.stringify(data)
      wx.setStorageSync('curRoom', that.data.area[that.data.areaIndex])
//      that.data.setData({
//          areaIndex: wx.getStorageSync("areaIndex")
//      })
      console.log(data)
      console.log(wx.getStorageSync("curRoom"))
      wx.navigateTo({
        url: '../map/baidu'
      })      
  },
});
