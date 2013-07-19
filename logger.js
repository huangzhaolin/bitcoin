/**
 * @authoer:zhaolinhuang create:2012-11-16
 */
var fs = require('fs');
var logDir = "/home/log/alibaba_sms_analysis";
function createLogDir() {
	fs.exists(logDir,function(isExits){
		if(!isExits){fs.mkdir(logDir);}
	});
}
exports.header = function(level) {
	var datetime = new Date().format("%Y-%m-%d %H:%M:%s");
	return datetime + " - " + level + " : ";
};
exports.info = function(message) {
	fs.appendFile(logDir + "/info.log", this.header("info") + message
			+ "\n");
};
exports.error = function(message) {
	fs.appendFile(logDir + "/error.log", this.header("error") + message
			+ "\n");
};
exports.warn = function(message) {
	fs.appendFile(logDir + "/warn.log", this.header("warn") + message
			+ "\n");
};
exports.custom = function(customLevel, message) {
	fs.appendFile(logDir + "/" + customLevel + ".log", this.header(customLevel)
			+ message + "\n");
};
createLogDir();