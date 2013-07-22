/**
 * Module dependencies.
 */
require('utils');
var express = require('express'), routes = require('./routes/routers.js'), http = require('http'), dbconn = require('./dao/dao.js'), logger = require('./logger.js');
var app = express();

app.configure(function() {
	app.set('port', process.env.PORT || 6666);
	app.set('views', __dirname + '/views');
	app.engine(".html", require('ejs').__express);
	app.set('view engine', 'html');
	app.use(express.favicon());
	app.use(function(req, res, next) {
		logger.custom('access', 'from:' + req.ip + ' -> ' + req.originalUrl
				+ ' - ' + res.statusCode);
		next();
	});
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.cookieParser());
	app.use(express.session({
		secret : 'keyboard cat'
	}));
	app.use(app.router);
	app.use(express.static(__dirname + '/public'));
});
//检测错误/非法关键词
function checkErrorWords(req, res, next){
	function vertify(parameters){
	for(var key in parameters){
			if(parameters[key].match(/update|delete|drop|select|grant|show/)){
				throw {name:"非法的参数传递",message:parameters[key]+"参数异常!"}
			}
		}
	}
	vertify(req.query);
	vertify(req.body);
	next();
}
app.configure('development', function() {
	app.use(express.errorHandler());
});
//验证是否有sql注入
app.get('*', checkErrorWords);
app.post('*', checkErrorWords);

app.post('/queryData.htm', routes.queryData);

http.createServer(app).listen(app.get('port'), function() {
	console.log("Express server listening on port " + app.get('port'));
});
