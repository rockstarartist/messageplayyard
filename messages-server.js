//Setup Variables for Socket.IO and general Server variables
var util = require("util");
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var connectedClients;


function init(){
    connectedClients = [];
    //Start Server and have it begin listening on specified port
    server.listen(8080);
    setEventHandlers();
};

var setEventHandlers = function(){
    io.sockets.on('connection', onSocketConnection);
}

function onSocketConnection(client) {
    util.log("New client has connected: " + client.id);
    client.on("disconnect", onClientDisconnect);
    client.on('user:new', onNewUser);
    client.on('broadcast:msg', onBroadCastMessage);
};

function onClientDisconnect() {
    util.log("User has disconnected: " + this.id);
};

function onNewUser(data) {

};

function onBroadCastMessage(data) {

};

init();