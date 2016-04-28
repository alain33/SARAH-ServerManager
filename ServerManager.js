//  Log Manager
var moment = require('moment');
var winston = require('winston');
var fs = require('fs-extra');
var logger = new (winston.Logger)({
    transports: [
      new (winston.transports.Console)(),
      new (winston.transports.File)({ filename: 'logs/ServerManager-' + moment().format("DD-MM-YYYY") + '.log' })
    ]
});

fs.ensureDirSync(__dirname + '/logs');

logger.info("===================================");
logger.info(" Starting Multiroom Server Manager ");
logger.info("===================================");

var d = new Date();
var t = d.getTime();

process.on('uncaughtException', function (err) {
  logger.error('Caught exception: '+ err.stack);
});

var express = require('express');
var app = module.exports = express();

var requireFu = require ('require-fu');
requireFu(__dirname + '/manager')(app,logger,t);

// Build App
var http = require('http');
var server = http.createServer(app);

app.get ('/SM/:plugin',         app.Script.routes);
app.post('/SM/:plugin',         app.Script.routes);

// Load sockets
app.Socket.load(server);
// Init watch folders 
app.Files.initscan();
// Start server
var webapp = server.listen(app.Config.getConfig().http.port);
// logger
logger.info("Multiroom Server Manager listening on port", webapp.address().port);
