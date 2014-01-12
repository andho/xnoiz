var connect = require('connect')
	,express = require('express')
    ,app = express()
	,server = require('http').createServer(app)
	,io = require('socket.io').listen(server);

var port = 8000;
server.listen(port);
console.log("Server listening on localhost:8000");

app.use(connect.static('www'));

var chats = {};
var person = null;
var id = 0;
var sockets = {};

io.sockets.on('connection', function (socket) {
	var commandBus = new CommandBus(socket, handlers);

	socket.emit('news', { hello: 'world' });

	socket.on('commands', function (data, callback) {
		console.log(data);
		commandBus.handle(data);
	});

});

var handlers = {
	createChat: function(command) {
		var chat = command;
		chat.messages = [];
		chat.user = person;
		chats[command.id] = chat;
		this.socket.emit('events', {name:'chatCreated', payload: command});
	},
	sendMessage: function(command) {
		var chat = chats[command.id];
		chat.messages.push({msg: command.msg, user: person});
		//this.socket.emit('events', {name:'messageSent', payload: command});

		for (var i in sockets) {
			sockets[i].emit('events', {name:'messageSent', payload: command});
		}
	},
	changePerson: function(command) {
		person = command;
		sockets[command.id] = this.socket;
		this.socket.emit('events', {name: 'personChanged', payload: command});
	}
};

function CommandBus(socket, handlers) {
	this.socket = socket;
	this.handlers = handlers;
}

CommandBus.prototype = {
	handle: function(command) {
		if (!command.name || !this.handlers[command.name]) {
			console.log("Command does not exist. :" + JSON.stringify(command));
			return;
			throw new Error("Command does not exist. :" + JSON.stringify(command));
		}

		this.handlers[command.name].call(this, command.payload);
	}
};

app.get('/chat/:id', function(req, res) {
	var chat = chats[req.params.id];
	if (!chat) {
		res.send("Not found");
		return;
	}

	res.send(JSON.stringify(chat));
});