var config
	, logger;
	
var routes = function(req, res, next){

  var cmd   = req.params.plugin;
  var data  = req.query; 
  data.body = req.body;
  
  run(cmd, data, res);
}
	

	
var run = function(cmd, rQs, res){

  var start = (new Date()).getTime();
  try {
    var module = app.Config.getModule(cmd);
    module.action(rQs, logger, app);
	if (res){ res.end() }; 
	var end = (new Date()).getTime();
    logger.info('Run %s: %dms',cmd, (end-start));
  }
  catch(ex){ 
    logger.warn('Run %s: %s',cmd,ex.message);
    if (res){ res.end(); }
  }
}
	
var ScriptManager = {
  'run' : run,
  'routes': routes
}


module.exports = function (api, log) {
	logger = log;
	app = api;
	app.Script = ScriptManager;
}