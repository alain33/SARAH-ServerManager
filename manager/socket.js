var ss = require('socket.io-stream')
	, fs = require('fs-extra')
	, _ = require('underscore')
	, path = require('path')
	, logger
	, app
	, clients = []
	, io
	, changedFrom;

var setSockets = function (http) {
	
	io = require('socket.io')(http);
	io.on('connect', function(client){
	 
		client.on('client_connect', function (from, server_ip, port, client_ip, loopback) {
			clients = _.filter(clients, function(num){ 
					return num.id != from;
			});
			logger.info('Client %s connected', from);
			clients.push ({id: from, server_ip: server_ip, server_port: port, client_ip: client_ip, loopback: loopback, Obj: client});
			client.emit('connected');
		});
		
		client.on('set_action', function (from, data) {
			app.Script.run (data.jsaction, data);
		});
		
		client.on('intercom', function (item, from, cltDir, room) {
			var speakTo = _.filter(clients, function(num){ 
				if (room == 'all')	
					return  num.id != client.id;
				else 
					return  num.id != client.id && room == num.id;
			});
			
			if (speakTo && speakTo.length > 0) {
					var dir = path.normalize(__dirname)
							.replace(path.parse(__dirname)
							.root, path.sep)
							.split( path.sep)
							.join('/'),
						dir = path.dirname(dir) + '/intercom',
						srvItem = item.replace(cltDir,dir );
					fs.ensureDirSync(dir);
					
					var stream = ss.createStream(); 
					ss(client).emit('send_intercom', item, stream);
					logger.info ("Receive intercom from %s", from);
					stream.pipe(fs.createOutputStream(srvItem));
					stream.on('data', function (data) {
						// Do nothing
					});
					stream.on('end', function (data) {
						_.map(speakTo, function(num) {
							num.Obj.emit('receive_intercom', srvItem, dir, from);
						});
						
						client.emit('intercom_sent', "message envoyé.");
					});
			} else {
				logger.info('No client for intercom');
				client.emit('intercom_sent', "aucun client pour envoyer le message.");
			}
		});
		
		client.on('disconnect', function() {
			clients = _.filter(clients, function(num){ 	
						if (num.Obj.id == client.id) {
							logger.info('Client %s gone', num.id);
							sendnotif(num.id);
						}
						return num.Obj.id != client.id;
					});
		});
		
		client.on('client_init', function (items,from,cltDir) {
			logger.info('Root folder on client %s: %s',from,cltDir);
			logger.info('%d file(s) on client %s', items.length, from);
			app.Files.compareSvrToClt(from,items,cltDir, function(data,srvDir){
					client.emit('receive_data', data, srvDir);
			});
		});
		
		client.on('unwatch', function (item,from,cltDir) {
			_.map(clients, function(num) {
				num.Obj.emit('stop_watching',item,from,cltDir);
			});	
		});
		
		client.on('file_removed', function (item,from,cltDir) {
			logger.info('%s removed on client %s',item,from);
			_.map(clients, function(num) {
				if (num.id == from)
					app.Files.clientRemove(from,item,cltDir);
			});
		});
		
		//send data
		ss(client).on('get_file', function(from, file, stream) {
			logger.info("Send %s to %s", file ,from);
			fs.createReadStream(file).pipe(stream);
		}); 	
		
		client.on('file_changed', function (item,from,cltDir) {
			app.Files.clientChange(from,item,cltDir, function (srvItem,watcher) { 
				var stream = ss.createStream(); 
				ss(client).emit('send_file', item, stream);
				logger.info ("Receive %s from %s", srvItem, from);
				changedFrom = from;
				stream.pipe(fs.createOutputStream(srvItem));
				stream.on('data', function (data) {
					// Do nothing
				});
				stream.on('end', function (data) {
					watcher.add(srvItem);
				});
			});
		});
	}); 
}



var sendnotif = function (client) {

	var notify = require('../notify/' + app.Config.getConfig().notification.sendType)({
		config: app.Config.getConfig(),
		Sarah: null,
		logger: logger 
	});
	notify.send("Message du Serveur Manager", "Le client " + client + " s'est déconnecté.");

}



var change = function (data, srvDir) {
	
	_.map(clients, function(num) {
		if (changedFrom) {
			if (num.id != changedFrom) 
				num.Obj.emit('receive_data', data, srvDir);
		} else
			num.Obj.emit('receive_data', data, srvDir);
	});
	
	changedFrom = null;
}


var remove = function (data, srvDir) {
	
	_.map(clients, function(num) {
		if (changedFrom) {
			if (num.id != changedFrom) 
				num.Obj.emit('remove_data', data, srvDir);
		} else
			num.Obj.emit('remove_data', data, srvDir);
	});
	
	changedFrom = null;
}


var SocketManager = {
  'load': function(http){ 
	setSockets(http);
  },
  'change' : function (data, srvDir) {
	change(data, srvDir);
  },
  'remove' : function (data, srvDir) {
	remove(data, srvDir);
  },
  'getClients': function(){ return clients; }
}

module.exports = function (api, log) {
	logger = log;
	app = api;
	app.Socket = SocketManager;
}
