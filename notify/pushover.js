
var pushover = module.exports = function (opts) {
	
	if (!(this instanceof pushover)) {
		return new pushover(opts);
	}
	
	opts = opts || {};
	
	this.Sarah = this.Sarah || opts.Sarah;
	this.config = this.config || opts.config;
	this.logger = this.logger || opts.logger;
	
	this.send = function (title, body) {this.sendNotif(title, body)};
	
}


pushover.prototype.sendNotif = function (title, body) {
	
	var client = this;
	
	body = '<font color="purple">'+body+"</font><br>";
	var msg = {
		message: body,
		sound: 'magic',
		title: title,
		html: 1,
	};
	
	var token = client.config.notification.pushoverToken,
		user = client.config.notification.pushoverUser;

	var push = require('pushover');
    var p = new push({
		user: user,
		token: token,
		update_sounds: true,
		debug: true
	});

	p.send(msg, function( err, result ) {
		if (err && result != 200)
			client.logger.error('Push error: %s', err);
		else 
			client.logger.info('result: %s', result);
	}); 
}


