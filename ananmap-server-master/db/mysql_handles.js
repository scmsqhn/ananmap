var sys = require('sys');
var mysql= require("mysql");
var db_config = {
  host: 'localhost',
    user: 'root',
    password: '',
    database: 'ananmap'
};

var connection;

function handleDisconnect() {
  connection = mysql.createConnection(db_config); // Recreate the connection, since
                                                  // the old one cannot be reused.

  connection.connect(function(err) {              // The server is either down
    if(err) {                                     // or restarting (takes a while sometimes).
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
    }                                     // to avoid a hot loop, and to allow our node script to
  });                                     // process asynchronous requests in the meantime.
                                          // If you're also serving http, display a 503 error.
  connection.on('error', function(err) {
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
      handleDisconnect();                         // lost due to either server restart, or a
    } else {                                      // connnection idle timeout (the wait_timeout
      throw err;                                  // server variable configures this)
    }
  });
}

handleDisconnect();

function connect() {
  //console.log('connect()')
  /*
  var sys = require('sys');
  var mq = require("mysql");
  var mc = mq.createConnection({
      user: "root",
      password: ""
    });
  mc.connect();
  mc.query("use ananmap");*/
  handleDisconnect();
  return connection;
}

function sqlcommand(client, strcmd) {
  //console.log('[x] sqlcommand()' + client + ", " + strcmd)
  client.query(strcmd, function (error, results) {
    if (error) {
      console.log("ClientReady Error: " + error.message);
      console.log("strcmd is =" , strcmd);
      client.end();
      return;
    }
        console.log("results", results)
    return results
  });
}

function insertUserInfo(strcmd) {
  return new Promise((resolve, reject) => {
    // 数据库查询操作
    var client = connect()
      var data = [client, strcmd]
      //console.log('[x] connect  done')
      resolve(data)
  }).then(function (data) {
    sqlcommand(data[0], data[1]);
  })
}
// promise 需要优化, 参数传递,还有问题!!!
function dosql(strcmd, res) {
  var client = null;
  var strcmd = "";
  var res = res;
  res.writeHeader(200, {
      'Content-Type': 'application/json'
    });
  return new Promise((resolve, reject) => {
    // 数据库查询操作
    client = connect();
    //      //console.log('[x] step1', strcmd, res);
    resolve();
  }).then(data => {
    return new Promise((resolve, reject) => {
      //console.log('[x] step2' + data)
//      //console.log("[x] res= ", res)
//      //console.log("[x] client= ", client)
//      //console.log("[x] strcmd= ", strcmd)
      client.query(strcmd, function (error, results) {
        if (error) {
          console.log("ClientReady Error: " + error.message);
          client.end();
          return;
        }
        console.log("results", results)
        resolve(results)
        client.end();
        //console.log('[x] step2 ', results, res)
      });
    });
  }).then(data => {
    //console.log('[x] step3' + data)
    var result = JSON.stringify(data);
    console.log(result)
    res.end(result);
  })
}

module.exports = {
  insertUserInfo: insertUserInfo,
  dosql: dosql,
}
