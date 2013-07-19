/**
 * @authoer:zhaolinhuang
 */
var db = require('../dao/data-accesss.js');
var logger = require('../logger.js');
var utils = require('util');
var DB_TYPES = ["taobao", "aliyun", "b2b"];
var http = require('http');
var fs = require('fs');
var CACHE_DIR = "/home/zhaolin/test"