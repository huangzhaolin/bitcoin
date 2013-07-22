/*
 * GET home page.
 */
var service = require("../service/service.js");
//获取数据对象
exports.queryData = function(req, res) {
	service.getTradeData(req.body,res);

};
