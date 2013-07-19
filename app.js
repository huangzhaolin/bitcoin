/**
 * Module dependencies.
 */
require('utils');
var express = require('express'), routes = require('./routes/routers.js'), http = require('http'), dbconn = require('./dao/dao.js'), logger = require('./logger.js');
var app = express();

app.configure(function() {
	app.set('port', process.env.PORT || 3000);
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

app.configure('development', function() {
	app.use(express.errorHandler());
});

/*
 * app.post('*', function(req, res, next) { if (req.session.username) { next(); }
 * else if (req.param("username")) { userViertify.userVertify(req, res, next); }
 * else { res.send("username parameters is required !! please check!"); } });
 */

app.post('/queryData.htm', routes.queryData);
app.post('/topCount.htm', routes.topCount);
app.post('/groupByDatetime.htm', routes.groupByDatetime);
app.get('/', routes.view);
app.get('/trendChart.htm', routes.trendChart);

http.createServer(app).listen(app.get('port'), function() {
	console.log("Express server listening on port " + app.get('port'));
});
