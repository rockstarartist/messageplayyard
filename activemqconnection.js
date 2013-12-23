//Setup Variables for ActiveMQ/STOMP Connection
var util = require('util');
var stomp = require('stomp');

var AMQConnection = function(stomp_args, stomp_headers, call_back_function) {
    var args = stomp_args;
    var headers = stomp_headers;
    var callback = call_back_function;
    var amqClient;
    var messages = 0;
    
    var eventHandler = function(amqClientConnection){
        amqClientConnection.on('connected', onConnection);
        amqClientConnection.on('message', onMessage);
        amqClientConnection.on('error', onError);
    }
    
    function onConnection(){
        amqClient.subscribe(headers, callback);
        util.log('Connected');
    }
    
    function onMessage(message){
        util.log("Got message: " + message.headers['message-id']);
        amqClient.ack(message.headers['message-id']);
        messages++;
    }

    function onError(error_frame){
        util.log(error_frame.body);
        amqClient.disconnect();       
    }
    
    var init = function() {
        amqClient = new stomp.Stomp(args);
        amqClient.connect();
        eventHandler(amqClient);
    };

    return {
        init: init
    }
};

exports.AMQConnection = AMQConnection;

