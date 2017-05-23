var io = require('socket.io')({
	transports: ['websocket'],
});

io.attach(4567);

io.on('connection', function(socket){
	 console.log('Un client est connecté !');
	socket.on('beep', function(){
		socket.emit('boop');
	});
})
