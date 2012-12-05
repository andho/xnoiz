var connect = require('connect')
  , app = connect()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);

server.listen(8080);

app.use(connect.static('www'));

var chats = {};
var id = 0;

io.sockets.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });

  socket.on('chats:create', function (data, callback) {
  	data.id = ++id;
    chats[id] = data;

    socket.emit('chats:create', data);
    socket.broadcast.emit('chats:create', data);

    callback(null, data);
  });

  socket.on('chats:update', function (data, callback) {
  	console.log(data);
  });

  socket.on('messages:create', function (data, callback) {
  	var chat = chats[data.chat];
    
    if (chat.messages == undefined) {
    	chat.messages = {};
    	chat.messageId = 0;
    }

    data.id = ++chat.messageId;
    chat.messages[data.id] = data;

    socket.emit('messages:create', data);
    socket.broadcast.emit('messages:create', data);

    callback(null, data);
  });
});