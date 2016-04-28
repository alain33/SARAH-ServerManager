var fs = require('fs'),
	_ = require('underscore');

exports.init = function(app, logger){
	// nothing
}


exports.action = function (data, logger, app) {

	var tblActions = {
		setConfig: function() {tvSchedule_config(app, 'set_infos', tvSchedule_set_infos('currentRoom', data.room))}
	};
	
	tblActions[data.command]();
	
}



var tvSchedule_config = function (app, action, config) {
	
	
	var _configjson = {
		 file:  function () {	var folders = app.Config.getConfig().root.folders.split(';'),
									jsonfile; 
								_.map(folders, function(folder){ 
									if (_.last(folder.split('/')) == 'plugins') 
										jsonfile =  folder + '/tvSchedule/tvScheduleConfig.json';
								});	
								return jsonfile;
							},
		 get_infos: function () {try {
									   var json = JSON.parse(fs.readFileSync(this.file(),'utf8')) 
									 } catch (err) 
									 {
										 config = {currentRoom: 'Salon'};
										 this.set_infos();
										 return;
									 } 
									 return json},
		 set_infos: function () {fs.writeFileSync(this.file(), JSON.stringify(config), 'utf8')}
	};
	
	if (typeof config === 'function') 
		return config(_configjson[action]());
	else
		return _configjson[action]();
}


var tvSchedule_get_infos = function (){
	var conf = tvSchedule_config('get_infos');
	return ((!conf) ? tvSchedule_config('get_infos') : conf );
}


var tvSchedule_set_infos = function (type, value) {
	
	var _infos = {
		currentRoom : value
	};
	
	return _infos;
}