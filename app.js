// Import the Express module
var express          = require('express');

// Import the 'path' module (packaged with Node.js)
var path            = require('path');
var session         = require('cookie-session');
var bodyParser      = require('body-parser');
// Create a new instance of Express
var app             = express();

var http            = require('http').Server(app);
var http2           = require('http');
var io              = require('socket.io').listen(http);

var clientSessions  = require("client-sessions");
var cookieParser    = require('cookie-parser');
var fs              = require('fs');
var readline        = require('readline');
var configuration   = require('./class/configuration.js');
var database        = require('./class/database.js');
var authenticate    = require('./class/authenticate.js');
var sockets         = require('./class/sockets.js');
var knex            = require('knex')({
	  client: 'mysql'
});
var request = require('request');

var conf 			= new configuration(),
    db				= new database(conf),
    au				= new authenticate( db, knex ),
    s                           = new sockets( db,conf,io,request );
    
// Initialize socket;
    s.initializes();

// // Parse form to data
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser('secret key string'));
app.use(session({
    keys: ['a', 'b'],
    cookie: { secure: true }// if you do SSL outside of node
}));

app.use(express.static(path.join(__dirname,'client')));

app.get( '/' , function( req, res, next ) {
	res.redirect('/start');
});

app.get("/game", function (req, res, next){
	res.sendfile( __dirname + '/client/game.html');
});

app.get("/score", function (req, res, next){
	res.sendfile( __dirname + '/client/score.html');
});

app.get("/start", function (req, res, next){
	res.sendfile( __dirname + '/client/start.html');
});

app.get("/endgame", function (req, res, next){
	res.sendfile( __dirname + '/client/endgame.html');
});

app.get("/client2", function( req, res, next ) {
	res.redirect('/client2/start');
});

app.get("/client2/start", function (req, res, next){
	res.sendfile( __dirname + '/client/client2/start.html');
});

app.get("/client2/step2", function (req, res, next){
	res.sendfile( __dirname + '/client/client2/step2.html');
});

app.get("/client2/step3", function (req, res, next){
	res.sendfile( __dirname + '/client/client2/step3.html');
});

app.get("/client2/endgame", function (req, res, next){
	res.sendfile( __dirname + '/client/client2/endgame.html');
});

app.get("/client2/frame/file.txt", function (req, res, next){
	res.sendfile( __dirname + '/client/client2/frames/file.txt');
});

app.get("/client2/frame/file2.txt", function (req, res, next){
     res.sendfile( __dirname + '/client/client2/frames/file2.txt' );
});
// Debug console reported
http.listen(3000, function() {
    console.log('listening on *:3000');
});

var mysocket = null;

io.sockets.on('connection', function (socket) {
  console.log('index.html connected');
  mysocket = socket;
});

var dgram = require("dgram");

var server = dgram.createSocket("udp4");
server.on("message", function ( msg ) {
    var str = msg.toString(),
        json = JSON.parse(str);

  if ( mysocket !== null ){
    // mysocket.emit('server.onMoveHandTip', json);
    mysocket.emit('server.onPeopleMoveHandTip', json);
  }
});

server.on("listening", function () {
  var address = server.address();
  console.log("udp server listening " + address.address + ":" + address.port);
});
server.bind(41181);

var server2 = dgram.createSocket("udp4");

server2.on("message", function ( msg ) {
    var str = msg.toString(),
        json = JSON.parse(str);

  if ( mysocket !== null ){
    mysocket.emit('server.onColorFrame', json);
  }
});

server2.on("listening", function () {
  var address = server.address();
  console.log("udp server listening " + address.address + ":" + address.port);
});

server2.bind(41180);

var server3 = dgram.createSocket("udp4");

server3.on("message", function ( msg ) {
    var str = msg.toString(),
        json = JSON.parse(str);

  if ( mysocket !== null ){
    mysocket.emit('server.onFaceDetected', json);
  }
});

server3.on("listening", function () {
  var address = server.address();
  console.log("udp server listening " + address.address + ":" + address.port);
});

server3.bind(41182);

