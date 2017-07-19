var config = require('../config.js');

function set(data) {
    return wx.setStorageSync(data)
}

function get(data) {
    return wx.getStorageSync(data)
}

module.exports = {
	set: set,
	get: get,
}

