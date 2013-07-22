/**
 * @author zhaolin.huang
 */
var logger = require('../logger.js');
var mysql = require('mysql');
var fs = require('fs');

/**
 * 初始化，DB连接
 *
 * @param connection
 */

var dbconn = (function connect() {
        var connInfo = {
                          host: 'localhost',
                          user: 'root',
                          port: "3306",
                          password: '5527193',
                          database: "bitcoin",
                          charset: "",
                          insecureAuth: true
        };
    return connectInit(connInfo);

  function connectInit(connInfo) {
    var dbconn = mysql.createConnection(connInfo);
    logger.info("connect to db :" + JSON.stringify(connInfo));
    dbconn.query('set interactive_timeout=200*3600');
    dbconn.query('set wait_timeout=200*60*60');
    dbconn.on('error',
    function(err) {
      if (!err.fatal) {
        return;
      }
      if (err.code == 'PROTOCOL_CONNECTION_LOST' || err.code == 'ECONNREFUSED') {
        logger.error(' db connect lost, reconnet ing :' + err.code + " : " + err.stack);
        connectInit(connInfo);
        dbconn.connect();
      } else {
        throw err;
      }
    });
    return dbconn
  }
})()
/**
 * 执行sql
 *
 * @param sql
 * @param callback
 * @returns
 */

function doQuery(sql, callback) {
  logger.info(sql);
  if (sql) {
    dbconn.query({
      sql: sql,
      nestTables: true
    },
    function(err, results) {
      if (err) {
        logger.error("execute sql error:" + sql + " ERROR CODE:" + err.code);
      } else {
        logger.info(sql + " : SUCCESS");
        if (callback) {
          callback(results);
        }
      }
    });
  } else {
    throw {
      name: " No Sql input",
      message:" No Sql input"
    }
  }
};
/**
 * 执行数据库链接
 */
exports.execute = doQuery;