/**
 * @authoer:zhaolinhuang
 */
var dao = require('../dao/data.js');
var logger = require('../logger.js');
var utils = require('util');
var fs = require('fs');
//获取交易数据
export.getTradeData=function(parameters,res){
	var querySql=utils.format("select * from trade_data where date_time >= '%s' and date_time <='%s' and orignal = '%s'",parameters.startTime,parameters.endTime,parameters.orignal)
	dao.execute(querySql,function(data){
		res.send(data);
	})
}