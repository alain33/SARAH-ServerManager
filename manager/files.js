var chokidar = require('chokidar')
	, fs = require('fs-extra')
	, _ = require('underscore')
	, path = require('path')
	, logger
	, app
	, watcher
	, start;

var initscan = function () {
	var folders = app.Config.getConfig().root.folders;
	if (!folders) {
		logger.error('Error while loading config folders property');
		return;
	}
	var srvDir = folders.split(';')
	_.map(srvDir, function(dir){ 
				fs.ensureDirSync(dir, function (err) {
					// => null
				});
	});
	
	// Initialize watcher.
	watcher = chokidar.watch(srvDir, {
	  ignored: /[\/\\]\./,
	  persistent: true,
	  awaitWriteFinish : true,
	  interval: 600,
	  alwaysStat: true
	});
	
	logger.info('Initial scan...')
	// Add event listeners.
	watcher
		.on('error', error => logger.info(`Watcher error: ${error}`))
		.on('ready', () => addevents()); 
}	

var addevents = function () {
	
  watcher
		.on('add', path => doevent('add', 'file', path)) 
		.on('change', path => doevent('change', 'file', path)) 
		.on('unlink', path => doevent('unlink', 'file', path))
		.on('unlinkDir', path => doevent('unlinkDir', 'dir', path));   
	
	var ignoredFiles = (app.Config.getConfig().root.ignored).split(';');
	if (ignoredFiles.length > 0) {
		_.map(ignoredFiles, function(file) { 
			watcher.unwatch(file.split('/').join(path.sep));
		}); 
	}
	
	logger.info('Initial scan complete.');
	
	// End initialisation
	var d = new Date();
	var end = d.getTime();
	logger.info('Multiroom Server Manager ready [%d secs]', (end - start) / 1000); 	

} 


var doevent = function (event, type, data) {
	
	var ignoredFiles = (app.Config.getConfig().root.ignored).split(';'),
		folders = (app.Config.getConfig().root.folders).split(';'),
		name = data.split( path.sep)
						.join('/');
						
	if (name.indexOf('/clients/') != -1 ) {
			var from = name.split('/')[(_.indexOf(name.split('/'), 'clients') + 1)]
			items = [{name: name, from: from}];
	} else
		items = [{name: name, from: 'ALL'}];
	
	var ignoredFiles = (app.Config.getConfig().root.ignored).split(';'),
		noevent;
	if (ignoredFiles.length > 0) {
		_.map(ignoredFiles, function(file) { 
			if ( file.indexOf('*') != -1 && items[0].name.indexOf( file.replace('*','')) != -1) {
					watcher.unwatch(items[0].name);
					noevent = true;
			}
		}); 
	}		

	if (noevent) return;
		
	switch (event) {
	case 'add':
		// add file
		logger.info('Add %s on clients', items[0].name);
		app.Socket.change(items,folders[0]);
		break;
	case 'change':
		// update file
		logger.info('Update %s on clients', items[0].name);
		app.Socket.change(items,folders[0]);
		break;
	case 'unlink':
		// remove file
		logger.info('Delete %s on clients', items[0].name);
		app.Socket.remove(items,folders[0]);
		break;
	 case 'unlinkDir':
		// remove Dir
		logger.info('Delete %s on clients', items[0].name);
		app.Socket.remove(items,folders[0]);
		break; 
	}
	
}


var clientRemove = function (from,cltItem,cltDir) {
	
	var folders = app.Config.getConfig().root.folders 
		, srvDirs = folders.split(';')
		, srvItem;
		
	 _.map(srvDirs, function(Dir){ 
		if (_.last(Dir.split('/')) == _.last(cltDir.split('/'))) {
			var cltItemDir =  cltItem.replace(cltDir + '/',''),
				srvItemDir = Dir + '/' 
						+ _.first(cltItemDir.split('/')) 
						+ '/clients/' + from + '/' 
						+ _.rest(cltItemDir.split('/')).join('/');
			
			if (!fs.existsSync(srvItemDir))
				srvItemDir = cltItem.replace(path.dirname(cltDir),path.dirname(Dir))
			
			fs.remove(srvItemDir, function (err) {
				if (err) return console.error(err)
				logger.info('%s deleted.',srvItemDir);
			});
		}
	});
	
}


var clientChange = function (from,cltItem,cltDir,callback) {

	var folders = app.Config.getConfig().root.folders 
		, srvDirs = folders.split(';')
		, srvItem
		, srvItemDir;
		
	 _.map(srvDirs, function(Dir){ 
		if (_.last(Dir.split('/')) == _.last(cltDir.split('/'))) {
			var cltItemDir =  cltItem.name.replace(cltDir + '/','');
				srvItemDir = Dir + '/' 
						+ _.first(cltItemDir.split('/')) 
						+ '/clients/' + from + '/' 
						+ _.rest(cltItemDir.split('/')).join('/');
			
			if (!fs.existsSync(srvItemDir))
				srvItemDir = cltItem.name.replace(path.dirname(cltDir),path.dirname(Dir))
		}
	});
	
	if (srvItemDir) {
		fs.stat(srvItemDir, function(err, stats) {
			if (stats) { // exist
				//if (stats.mtime.getTime() < cltItem.modify && cltItem.size != stats.size) {
				if (stats.mtime.getTime() < cltItem.modify) {
					watcher.unwatch(srvItemDir);
					logger.info('Update %s from %s', cltItem.name,from);
					callback(srvItemDir,watcher);
				} 
			} else {
				logger.info('New %s from %s', cltItem.name, from);
				callback(srvItemDir,watcher);
			}
		});
	}
}


var compareSvrToClt = function (from,cltItems,cltDir,callback) {
	
	scanSvrRoot(function(svrItems,srvDir) { 
		compareToClt(from,svrItems,cltItems,srvDir,cltDir,function(itemsToCopy){
			logger.info('%s file(s) must be updated on client %s', itemsToCopy.length,from);
			if (callback) callback (itemsToCopy,srvDir[0]);
		});
	});
}


var scanSvrRoot = function (callback) {
	
	var folders = app.Config.getConfig().root.folders 
		, ignoredFiles = (app.Config.getConfig().root.ignored).split(';')
		, items = [] 
		, srvDir = folders.split(';') 
		, pending = srvDir.length;
		
	_.map(srvDir, function(dir){ 
		fs.ensureDirSync(dir, function (err) {
			// => null
		});
		
		fs.walk(dir)
		  .on('data', function (item) {
			  if (item.stats.isFile()) {
				var name = item.path.replace(path.parse(item.path)
											.root, path.sep)
											.split( path.sep)
											.join('/');
				
				var nopush;
				if (ignoredFiles.length > 0) {
					_.map(ignoredFiles, function(file) { 
						if (file.indexOf('*') != -1) {
							if (name.indexOf(file.replace('*','')) != -1 ) nopush = true;
						} else {
							if (name == file) nopush = true;
						}
					}); 
				}
				if (!nopush)
					items.push({name : name,
								size : item.stats.size,
								create : item.stats.atime,
								modify : item.stats.mtime.getTime()
					})
			  }
		  })
		  .on('end', function () {
			  if(!--pending)
				callback(items,srvDir);
		  }) 		
	});
}


var compareToClt = function (from,srvItems,cltItems,srvDir,cltDir,callback) {
	
	logger.info('Monitoring folder(s) on server',srvDir);
	logger.info('Total files on server:',srvItems.length);
	
	cltItems = _.map(cltItems, function(cltItem) { 
		cltItem.name = cltItem.name.replace(cltDir,path.dirname(srvDir[0]))
		return cltItem;
	}); 
	
	// If modification date on server is more recent ==> keep the file
	// or if the file not exists on client ==> keep the file
	var itemsToCopy = [],
		found;
	_.map(srvItems, function(srvItem) { 
	    if (srvItem.name.indexOf('/clients/') != -1 ) {
			if (srvItem.name.indexOf('/clients/'+from) != -1 ) {
				var name = srvItem.name.replace ('/clients/'+from, '')
				found = _.find(cltItems, function(cltItem) {
					if (name == cltItem.name) {
						if (srvItem.modify > cltItem.modify)
							itemsToCopy.push({name: srvItem.name, from: from});	
						return cltItem;
					}
				});
				if (!found) itemsToCopy.push({name: srvItem.name, from: from});
			} 
		} else {
			found = _.find(cltItems, function(cltItem) {
				if (srvItem.name == cltItem.name) {
					if (srvItem.modify > cltItem.modify)
						itemsToCopy.push({name: srvItem.name, from: 'ALL'});	
					return cltItem;
				}
			});
			if (!found) itemsToCopy.push({name: srvItem.name, from: 'ALL'});
		}
	});
	
	callback(itemsToCopy);
}




var FileManager = {
  'initscan': function(){
		initscan();
  },
  'compareSvrToClt': function(from,items,cltDir,callback){ return compareSvrToClt(from,items,cltDir,callback);},
  'clientChange' : function(from,item,cltDir,callback){ return clientChange(from,item,cltDir,callback);},
  'clientRemove' : function(from,item,cltDir){ return clientRemove(from,item,cltDir);},
  'getWatched': function(){ return watcher.getWatched();}
}


module.exports = function (api, log, t) {
	logger = log;
	app = api;
	start = t;
	app.Files = FileManager;
}
