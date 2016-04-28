var _ = require('underscore'),
	request = require('request'),
	log;
	
exports.init = function(app, logger){
	log = logger;
	// nothing
}


exports.action = function (data, logger, app) {

	speakTo(data.room || 'all', data.tts, app) 
	
}


var speakTo = function (room, tts, app) {
	
	var clients = _.filter(app.Socket.getClients(), function(num){ 
			if (room == 'all')	
				return  num;
			else if ( num.id == room )
				return  num;
	});
	
	_.map(clients, function(client) {
		var uri = 'http://' + client.client_ip + ':' + client.loopback + '/?' + encodeURI('tts=' + tts + '&sync=true');
		
		request(uri, function (error, response, body) {
			if (!error && response.statusCode != 200) 
				log.error ("Remote speak to %s: %s", client.id, error);
			else	
				log.info ("Remote speak to %s: %s", client.id, tts);
		});
	});	
	
}


