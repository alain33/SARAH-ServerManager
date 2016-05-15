var _ = require('underscore'),
	request = require('request'),
	log;
	
exports.init = function(app, logger){
	log = logger;
}


exports.action = function (data, logger, app) {

	if (!data.plugin) {
		log.error("No plugin for the action. Exit.");
		return;
	}
	
	var tblActions = {
		unicode : function () { unicode(data) }
	};

	tblActions[data.remoteCmd]();
	
}


var unicode = function(data) {
	
	var clients = _.filter(app.Socket.getClients(), function(num){ 
			if (!data.room || data.room == 'all')	
				return  num;
			else if ( num.id == data.room )
				return  num;
	});
	
	if (clients && data.options) {
		var tblparams = cutparams(data.options); 
		if (tblparams[1]) {
			_.map(clients, function(client) {
				var uri = 'http://' + client.client_ip + ':' + client.loopback  + '/?' + encodeURI(tblparams[1]);
				log.info ("Remote to %s Sarah client: %s",client.id, uri);
	
				request(uri, function (error, response, body) {
					if (!error && response.statusCode != 200) 
						log.error ("Remote client to %s: %s", client.id, error);
				});
			});
		}
		
		if (tblparams[0]) {
			var params = (tblparams[0] &&  tblparams[0].length > 0) ? "?" + tblparams[0] : null;
			if (params)
				params =  (data.room) ? params + '&room=' + data.room : params;
			else
				params =  (data.room) ? '?room=' + data.room  : null;
			
			_.map(clients, function(client) {
				var uri = "http://" + client.server_ip + ":" + client.server_port + "/sarah/" + encodeURI(data.plugin + ((params) ? params : ''));
				log.info("Remote to %s Sarah server: %s" ,client.id, uri);
				
				request(uri, function (error, response, body) {
					if (!error && response.statusCode != 200) 
						log.error ("Remote Server to %s: %s" , client.id, error);
				}); 
			});
		}
	}
	
}



var cutparams = function (params) {

	var remoteParams,
	    globalParams,
	    tblParams = params.split('~');
	_.map(tblParams, function(param){ 	
		if (param.indexOf('_attributes.') != -1) {
			var start = param.indexOf('_attributes.') + 12,
			    parameter = param.substring(start);
			if (parameter.indexOf('tts=') != -1)
				parameter = parameter + "&sync=true";
			remoteParams = (!remoteParams) ? parameter : remoteParams + "&" + parameter;
			
			if (params && params.length > 0) {
				if (params.indexOf(param) > 0)
					param = '~'+param;
				params = params.replace(param,'');
			} else
				params = null;
		} 
	});
	
	if (params && params.length > 0)
		params = params.replace(/~/g, '&')
	
	return ([params,remoteParams]);
}
