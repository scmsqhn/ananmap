var config = require('../config.js');

function formatTime(date) {
  var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()

    var hour = date.getHours()
    var minute = date.getMinutes()
    var second = date.getSeconds();

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
    return n[1] ? n : '0' + n
}

function loginIn(cb){
		console.log("=== loginln ===")

  var item = {}
  wx.getUserInfo({
    success: function (res) {
      console.log(res.userInfo)
      item["userinfo"] = res.userInfo
      wx.login({
          success: function (res) {
            console.log(res);
            item["code"] = res.code;
            console.log(item);
            wx.request({
              url: config.service.loginUrl,
              data: {
                userinfo: item["userinfo"],
                code: item["code"],
                item: item,
              },
              method: 'GET',
              header: {
                'content-type': 'application/json'
              },
              success: function (res) {
                if (200 == res.statusCode) {
                  var openid = res.data.openid;
                  console.log('[x] 从服务器返回的OPENID: ', openid);
                  item["openid"] = openid;
                  item["intime"] = Date.now();
                  wx.setStorageSync("item", item);
                  wx.setStorageSync("openid", openid);
                  typeof cb == "function" && cb(item);
				  inRoom("wind", console.log)
				  
                }
              },
              fail: function (e) {
                console.log('[x] fail=', e)
              },
              complete: function () {
                console.log('[x] complete')
              }
            });
          }
        })
    }
  })
}

function getRoomDevTime(){
    wx.request({
      url: config.service.getRoomDevTime,
      data: {
        room: 0,
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (200 == res.statusCode) {
          wx.setStorageSync("devlist", res.data)
//          wx.setStorageSync("areaIndex", name)
          typeof cb == "function" && cb("[x] getRoomDevTime: ", ", res.data")
        }
      },
      fail: function (e) {
        console.log('[x] fail=', e)
      },
      complete: function () {
        console.log('[x] complete')
      }
    });       
	
}

function obtainDev(room, cb){
		console.log("=== obtainDev ===")

    wx.request({
      url: config.service.getdev,
      data: {
        room: room,
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (200 == res.statusCode) {
          console.log('[x] obtainDev= ', res.data)
          typeof cb == "function" && cb(res.data)
          var curDev = wx.getStorageSync("curDev")
          console.log(curDev)
          wx.setStorageSync("devlist", res.data)
          wx.setStorageSync("device", res.data[curDev]["openid"])
          obtainTime(res.data[curDev]["openid"], console.log)
//          wx.setStorageSync("areaIndex", name)
        }
      },
      fail: function (e) {
        console.log('[x] fail=', e)
      },
      complete: function () {
        console.log('[x] complete')
      }
    });       
}

function obtainTime(openid,cb){
	console.log("=== obtainTime ===")
    wx.request({
      url: config.service.gettime,
      data: {
        openid: openid,
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (200 == res.statusCode) {
          console.log("[x] obtainTime= ", res.data)
          wx.setStorageSync("timelist", res.data)
//          wx.setStorageSync("areaIndex", name)
          console.log(res.data);
          typeof cb == "function" && cb(res.data);
 //          saveOpenidPlace(console.log);
        }
      },
      fail: function (e) {
        console.log('[x] fail=', e)
      },
      complete: function () {
        console.log('[x] complete')
      }
    });
}

function inRoom(name, cb) {
		console.log("=== inRoom ===")

  var item = wx.getStorageSync('item')
  var openid = wx.getStorageSync('openid')
  console.log("[x] openid", openid)
//    var openid = item["openid"]
  var latitude = wx.getStorageSync('latitude')
  var longitude = wx.getStorageSync('longitude')
    var myplace = getLocation()
    console.log(config.service.inroom, openid)
    wx.request({
      url: config.service.inroom,
      data: {
        openid: openid,
        latitude: latitude,
        longitude: longitude,
        room: name,
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (200 == res.statusCode) {
			console.log(res.data)
          wx.setStorageSync("room", res.data)
          wx.setStorageSync("areaIndex", name)
          cb(res.data[0]['openid'])
          typeof cb == "function" && cb("[x] inRoom = ", res.data, "")
        obtainDev("wind", cb)
        }
      },
      fail: function (e) {
        console.log('[x] fail=', e)
      },
      complete: function () {
        console.log('[x] complete')
      }
    });
}

function getLocation() {
  wx.getLocation({
    type: 'wgs84',
    success: function (res) {
      var latitude = res.latitude
        var longitude = res.longitude
        return [latitude, longitude]
        //            that.setData({ latitude: latitude, longitude: longitude })
    }
  })
  return [-1, -1]
}

function saveOpenidPlace(cb){
        var that = this;
//        var openid =wx.getStorageSync("device")["openid"]
        var openid =wx.getStorageSync("openid")
        wx.request({
              url: config.service.sqlhandle,
              data: {
                openid: openid,
                time: Date.now(),
                latitude: this.data.latitude,
                longitude: this.data.longitude,
              },
              method: 'GET',
              header: {
                'content-type': 'application/json'
              },
              success: function (res) {
                if (200 == res.statusCode) {
                  typeof cb == "function" && cb("[x] saveopenidplace",res.data);
                }
//                that.getRoomInfo(console.log)
              },
              fail: function (e) {
                console.log('[x] fail=', e)
              },
              complete: function () {
                console.log('[x] complete')
              }
            });
  
    }

module.exports = {
  formatTime: formatTime,
  inRoom: inRoom,
  loginIn: loginIn,
  obtainDev: obtainDev,
  obtainTime: obtainTime,
}
