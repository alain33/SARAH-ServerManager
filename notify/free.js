var moment = require('./node_modules/moment/moment');
moment.locale('fr');

var freesms = module.exports = function (opts) {
	
	if (!(this instanceof freesms)) {
		return new freesms(opts);
	}
	
	opts = opts || {};
	
	this.Sarah = this.Sarah || opts.Sarah;
	this.config = this.config || opts.config;
	this.logger = this.logger || opts.logger;
	
	this.send = function (title, body) {this.sendNotif(title, body)};
	
}


freesms.prototype.sendNotif = function (title, txt) {
	
	var client = this;
	
	var body = title + "\n";
	body += 'From Sarah on ' + moment().format("DD/MM/YYYY - HH:mm"); 
	body += "\n\n" + txt + "\n";
	
	var token = client.config.notification.SMStoken,
		user = client.config.notification.SMSuser;

	var url = 'https://smsapi.free-mobile.fr/sendmsg';
	url += '?user=' + user;
	url += '&pass=' + token;
	url += '&msg='+body;
	process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
	
	var request = require('request');
	request({ 'uri': url }, function (err, response, body){
		if (err || response.statusCode != 200)
			client.logger.error('Free SMS error: %s', err);
	}); 
}