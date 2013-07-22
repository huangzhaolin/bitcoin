/*
 * GET home page.
 */
var service = require("../service/service.js");
//获取数据对象
exports.queryData = function(req, res) {
	service.getTradeData(req.body,res);
};
//index
exports.index=function(req,res){
	res.render('BitCoin Trade Analysis', {
		title: "Alibaba SMS Analysis",
		header: "@Jolinhuang.com"
	});
} 