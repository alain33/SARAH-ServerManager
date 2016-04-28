var xtend  = require('../node_modules/extend/extend.js')
	, fs  = require('fs')
	, config
	, logger
	, app
    , pwd = require('path')
	, _uncache = require('require-uncache');

//Load default properties
var loadProperties = function(){
  if (!fs.existsSync('./ServerManager.prop')) { return {}; }
  logger.info('Loading properties...');
  var json = fs.readFileSync('./ServerManager.prop','utf8');
  return JSON.parse(json);
}



var loadPlugins = function(folder){ 
  
  if (!folder) folder = pwd.normalize(__dirname+'/../plugins');
  if (!fs.existsSync(folder)) { return }
  
  fs.readdirSync(folder).forEach(function(file){
     var path = folder+'/'+file;
	 if (file.endsWith('.js')){
		module = require(path);
		initModule(module, file.replace('.js','')); 
	 }
  });
}



var getModule = function(name, uncache){
  var module = false;
  var path = false;

  try {
    path = pwd.normalize(__dirname+'/../plugins/'+name+'.js');
	if (uncache){ _uncache(path); }
	module = require(path);
  } 
  catch (ex) { 
	 logger.error('Error loading %s: %s',name,ex);
	 return;
  }
  
  initModule(module, name); 
  if (!module){ return false;  }
  
  var modified = fs.statSync(path).mtime.getTime();
  if (!module.lastModified){
    module.lastModified = modified;
  }
  
  if (uncache){ return module; }
  
  if (module.lastModified < modified){
    logger.info('Reloading %s',name);
    return getModule(name, true);
  }
  
  return module;
}

var initModule = function(module, name){
  try {
    if (!module) { return; }
    if (module.initialized){ return; }
    module.initialized = true;
   
    logger.info('init Module: %s', name);
    if (!module.init){ return; }
	
    module.init(app, logger);
  } catch (ex) { logger.warn ('initModule: %s', ex.message); }
}



var ConfigManager = {
  'init': function(){
    config = { 'debug' : true };
    try  { 
      xtend.extend(true, config, loadProperties());
    } catch(ex) { 
		logger.error('Error while loading config properties:', ex.message);  
	}
	loadPlugins();
    return ConfigManager;
  },
  'getModule': getModule,
  'getConfig': function(){ return config; }
}



module.exports = function (api, log) {
	logger = log;
	app = api;
	app.Config = ConfigManager;
	ConfigManager.init();
}
