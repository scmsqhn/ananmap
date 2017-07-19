var bmap = require('../../libs/bmap-wx.js');
var config = require('../../config.js');
var ananmap = require('../../utils/ananmap.js');
var data = require('../../utils/data.js');

var markersData = []

Page({
  data: {
    markers: [],
    latitude: '40.056892',
    longitude: '116.308022',
    placeData: {},
    BMap: {},
    sugData: "",
    roomId: 0,
    deviceId: 0, // member in room
    timeId: 0,
    roomMember: [],
    timeOnMember: [], // the place time on a member
    curRoom: 'wind',
    curDev: 0,
    curTime: 0,
    room: "wind",
    devlist: [],
    timelist: [],
    curroomname: 'wind',
    device: "",
    time: "",
    sise: 'mini',
  },
  makertap: function (e) {
    var that = this;
    var id = e.markerId;
    that.showSearchInfo(markersData, id);
    that.changeMarkerColor(markersData, id);
  },
  sortDev: function () {
    var that = this;
    if (wx.getStorageSync("devlist") != null) {
      that.setData({
        devlist: wx.getStorageSync("devlist"),
        curDev: 0,
      })
    }
  },
  sortTime: function () {
    var that = this;
    console.log('devlist= ', that.data.devlist)
    var dev = that.data.devlist[that.data.curDev];
    if (dev == null) {
      return
    }
    var ll = [];

    for (var i = 0; i < dev.length; i++) {
      ll[i] = (dev[i]);
    }

    that.setData({
      timelist: ll,
      curTime: 0,
    });
    console.log('[x] timelist', that.data.timelist)
  },
  onLoad: function () {
    var that = this;
    var cr = wx.getStorageSync("curRoom")
      var temp = wx.getStorageSync("curRoom")
      var curRoom = (temp == null) ? "wind" : temp;
    that.log();
    wx.setStorageSync("curDev", 0);

    //      console.log("[x] that.data.device", that.data.device)
    console.log('[x] baidu.onLoad.curRoom', cr)
    if (cr != null) {
      var data = {}
      data["curRoom"] = JSON.stringify(cr)
        that.setData(data)
    }
    that.setData({
      BMap: new bmap.BMapWX({
        ak: 'TGCPu8MSHKem10tW90avn9jsVvM5Nrbf'
      }),
    });
    console.log(wx.getStorageSync("room"))
    that.setData({
      room: wx.getStorageSync("room"),
      curTime: 0
    });
    console.log("[x] that.data.curTime", that.data.curTime)
    if (that.data.timelist != null) {
      var wgsdict = that.data.timelist[that.data.curTime];
      console.log(wgsdict);
    };
    console.log("[x] onload room=   ", that.data.room);
    //        wgsdict

    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        var latitude = res.latitude;
        var longitude = res.longitude;
        that.setData({
          latitude: latitude,
          longitude: longitude,
          curlatitude: latitude,
          curlongitude: longitude
        });
        wx.setStorageSync('latitude', latitude)
        wx.setStorageSync('longitude', longitude)
        that.saveOpenidPlace(console.log);
        ananmap.inRoom("wind", console.log)
      }
    });
    /*
    var data = {};
    var timelist = wx.getStorageSync("timelist");
    data["timelist"] = timelist;
    that.setData(data)
    data["device"] = JSON.stringify(that.data.curRoom["openid"]);
    that.setData(data)
    data["time"] = JSON.stringify(that.data.timelist[that.data.curTime]["time"]);
    that.setData(data);
    that.reloadMap();
    that.log()
     */
    //        that.sortDev();
    //        that.sortTime();
    //        console.log(that.data.devlist)
    //        console.log(that.data.timelist)
    //        console.log(that.data.devlist[that.data.curDev]["openid"]);
    //        console.log(that.data.timelist[that.data.curTime]);
    //        console.log(that.data.devlist[that.data.curDev]);
    //        console.log(that.data.devlist[that.data.curDev]);
  },
  log: function () {
    /*        var that = this
    console.log("[x] wx.getStorageSync('room')", wx.getStorageSync('room'))
    console.log("[x] room", that.data.room);
    console.log("[x] curDev", that.data.curDev);
    console.log("[x] timelist", that.data.timelist)
    console.log("[x] latitude", that.data.timelist[that.data.curTime]['latitude'])
    console.log("[x] longitude", that.data.timelist[that.data.curTime]['longitude'])
    console.log('[x] time=', that.data.timelist[that.data.curTime]['openid']);
    //        console.log('[*] device=', that.data.room[that.data.curDev]);
    console.log('[*] time=', that.data.timelist[that.data.curTime]);
    console.log('[*] data=', that.data);
    console.log("[x] room", that.data.room)
    //        console.log("[x] curDev", that.data.room[that.data.curDev])
    console.log("[x] device time place", that.data.device, that.data.time, that.data.timelist[that.data.curTime])
     */
  },
  weather: function () {
    wx.navigateTo({
      url: '../bdweather/bdweather'
    })
  },
  onSearch: function () {
    var that = this;
    var fail = function (data) {
      console.log(data)
    };
    var success = function (data) {
      markersData = data.wxMarkerData;
      that.setData({
        markers: markersData
      });
      that.setData({
        latitude: markersData[0].latitude
      });
      that.setData({
        longitude: markersData[0].longitude
      });
    }
    // 发起POI检索请求
    this.data.BMap.search({
      "query": '酒店',
      fail: fail,
      success: success,
      // 此处需要在相应路径放置图片文件
      iconPath: '../../image/marker_red.png',
      // 此处需要在相应路径放置图片文件
      iconTapPath: '../../image/marker_red.png'
    });
  },
  onSuggest: function (e) {
    var that = this
      var fail = function (data) {
      console.log(data)
    };
    var success = function (data) {
      var sugData = '';
      for (var i = 0; i < data.result.length; i++) {
        sugData = sugData + data.result[i].name + '\n';
      }
      that.setData({
        sugData: sugData
      });
    };
    this.data.BMap.suggestion({
      query: e.detail.value,
      region: '深圳',
      city_limit: true,
      fail: fail,
      success: success
    });
  },
  onRegeo: function (e) {
    var that = this
      var fail = function (data) {
      console.log(data)
    };
    var success = function (data) {
      const wxMarkerData = data.wxMarkerData;
      that.setData({
        markers: wxMarkerData
      });
      that.setData({
        latitude: wxMarkerData[0].latitude
      });
      that.setData({
        longitude: wxMarkerData[0].longitude
      });
      that.setData({
        placeData: {
          title: '描述：' + wxMarkerData[0].desc + '\n',
          address: '地址：' + wxMarkerData[0].address + '\n',
          telephone: '商圈：' + wxMarkerData[0].business
        }
      })
    }
    // 发起regeocoding检索请求
    this.data.BMap.regeocoding({
      fail: fail,
      success: success,
      iconPath: '../../image/marker_red.png',
      iconTapPath: '../../image/marker_red.png'
    });
  },
  showSearchInfo: function (data, i) {
    var that = this;
    that.setData({
      placeData: {
        title: '名称：' + data[i].title + '\n',
        address: '地址：' + data[i].address + '\n',
        telephone: '电话：' + data[i].telephone
      }
    });
  },
  changeMarkerColor: function (data, i) {
    var that = this;
    var markers = [];
    for (var j = 0; j < data.length; j++) {
      if (j == i) {
        // 此处需要在相应路径放置图片文件
        data[j].iconPath = "../../image/marker_yellow.png";
      } else {
        // 此处需要在相应路径放置图片文件
        data[j].iconPath = "../../image/marker_red.png";
      }
      markers.push(data[j]);
    }
    that.setData({
      markers: markers
    });
  },
  upDevice: function () {
    var that = this;
    var temp = that.data.curDev;
    var len = that.data.room.length;
    temp += 1
    if (temp > len - 1) {
      temp = 0
    }
    that.setData({
      curDev: temp,
      curTime: 0
    })
    ananmap.obtainTime(that.data.room[temp]["openid"], that.reloadMap)
    console.log("[x] upDevice [that.data.room[temp][openid]]: ", that.data.room[temp])
    console.log("[x] upDevice [len:curDev]: ", len, that.data.curDev)
    //       that.reloadMap()
  },
  downDevice: function () {
    var that = this;
    var temp = that.data.curDev;
    var len = that.data.room.length;
    temp -= 1
    if (temp < 0) {
      temp = len - 1
    }
    that.setData({
      curDev: temp,
      curTime: 0
    })
    ananmap.obtainTime(that.data.room[temp]["openid"], that.reloadMap)
    console.log("[x] upDevice [that.data.room[temp][openid]]: ", that.data.room[temp])
    console.log("[x] downdevice [len:curDev]: ", len, that.data.curDev)
    //        that.reloadMap()
  },
  upTime: function () {
    var that = this
      var temp = that.data.curTime;
    var len = that.data.timelist.length;
    temp += 1
    if (temp > len - 1) {
      temp = 0;
    }
    that.setData({
      curTime: temp,
    })
    console.log("[x] upTime [len:curTime]: ", len, that.data.curTime)
    that.reloadMap()
  },
  downTime: function () {
    var that = this;
    var temp = that.data.curTime;
    var len = that.data.timelist.length;
    temp -= 1
    console.log("[x] downtime len: ", len, temp)
    if (temp < 0) {
      temp = len - 1;
    }
    that.setData({
      curTime: temp
    })
    console.log("[x] downtime [len:curtime]: ", len, that.data.curTime)
    that.reloadMap()
  },
  reloadMap() {
    var that = this
      that.log();
    var room = wx.getStorageSync("room")
      console.log("reloadmap room:curDev", room, that.data.curDev)
      var device = room[that.data.curDev]
      var openid = device["openid"]
      //        var device = that.data.curDev["openid"]
      var timelist = wx.getStorageSync("timelist")
      that.setData({
        timelist: timelist
      })
      console.log("reloadmmap timelist", timelist)
      var info = timelist[that.data.curTime]
      console.log("reloadmmap info", info)
      var time = info["time"];
    var latitude = info["latitude"];
    var longitude = info["longitude"];
    that.setData({
      latitude: latitude,
      longitude: longitude
    });
    that.setData({
      device: openid,
      time: time
    });
  },
  setRoom: function () {
    wx.navigateTo({
      url: '../form/index'
    })
  },
  getRoomInfo: function (cb) {
    var that = this;
    wx.request({
      url: config.service.roominfo,
      data: {
        room: that.data.roomId,
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (200 == res.statusCode) {
          typeof cb == "function" && cb(res.data);
        }
        //                getRoomInfo(console.log)
      },
      fail: function (e) {
        console.log('[x] fail=', e)
      },
      complete: function () {
        console.log('[x] complete')
      }
    });
  },
  saveOpenidPlace: function (cb) {
    var that = this;
    //        var openid =wx.getStorageSync("device")["openid"]
    var openid = wx.getStorageSync("openid")
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
            typeof cb == "function" && cb("[x] saveopenidplace", res.data);
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

  },
  takePic: function (cb) {
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['camera'], // ['album', 'camera']可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
          typeof cb == "function" && cb("[x], chooseImage", tempFilePaths);
        wx.uploadFile({
          url: 'https://70139330.qcloud.la/photoupload', //仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          name: 'file',
          formData: {
            'user': wx.getStorageSync("openid"),
            'time': Date.now(),
            'latitude': that.data.curlatitude,
            'longitude': that.data.curlongitude,
          },
          success: function (res) {
            var data = res.data
              typeof cb == "function" && cb("[x], uploadFile", data);
            //do something
          }
        })
      }
    })
  },
})
