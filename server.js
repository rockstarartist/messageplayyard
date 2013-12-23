//Setup Variables for Socket.IO and general Server variables
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

//Setup Variables for ActiveMQ/STOMP Connection
var sys = require('util');
var stomp = require('stomp');

// Set debug to true for more verbose output.
// login and passcode are optional (required by rabbitMQ)
var stomp_args = {
    port: 61613,
    host: 'localhost',
    debug: false,
    login: 'guest',
    passcode: 'guest'
};

var client = new stomp.Stomp(stomp_args);
var headers = {
    destination: '/topic/chatmessages',
    ack: 'client'
};

var messages = 0;

//Start Server and have it begin listening on specified port
server.listen(8080);

//Setup server request/response calls
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

app.get('/app.js', function(req, res) {
  res.sendfile(__dirname + '/app.js');
});


//WebSocket Connection with socket.io
io.sockets.on('connection', function (socket) {

//With successful socket.io connection, connect to activeMQ
client.connect(); 

function message_callback(body, headers) {
    console.log('Message Callback Fired!');
    console.log('Headers: ' + sys.inspect(headers));
    console.log('Body: ' + body);
    socket.emit('new:msg', body);
}
  socket.on('broadcast:msg', function(data) {
		client.send({
            'destination': '/topic/chatmessages',
            'body': data.message,
            'persistent': 'true'
        }, true);
  });

client.on('connected', function() {
    client.subscribe(headers, message_callback);
    console.log('Connected');
});

client.on('message', function(message) {
    console.log("Got message: " + message.headers['message-id']);
    client.ack(message.headers['message-id']);
    messages++;
});

client.on('error', function(error_frame) {
    console.log(error_frame.body);
    client.disconnect();
});

});