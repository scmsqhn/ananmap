/**
 * 小程序配置文件
 */

// 此处主机域名修改成腾讯云解决方案分配的域名
//var host = '118.89.184.71:5755';
var host = '70139330.qcloud.la';
var config = {
    appid : 'wx56df671c2e5c8bb7',
    secret: '3a2a09364fbf8a827d84cbd92a85cfaf',
    // 下面的地址配合云端 Demo 工作
    service: {
        host,
        // 下单请求地址
        orderList: `https://${host}/order`,

        // 开奖结果请求地址
        resultList: `https://${host}/result`,
		
        // 测试的请求地址，用于测试会话
        requestUrl: `https://${host}/test`,

        // 登陆请求地址
		loginUrl: `https://${host}/login`,

        // 测试的请求地址，用于测试会话
        requestUrl: `https://${host}/user`,

        // 测试的信道服务地址
        tunnelUrl: `https://${host}/tunnel`,
        
        // 进入房间
        inroom: `https://${host}/inroom`,
        
        sqlhandle:  `https://${host}/sqlhandle`,
        
        roominfo:  `https://${host}/roominfo`,
        
        getdev:  `https://${host}/getdev`,

        gettime:  `https://${host}/gettime`,

    }
};

module.exports = config;