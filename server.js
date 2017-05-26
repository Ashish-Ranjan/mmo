 var http = require('http');
var players = [];
 
var server = http.createServer(function(req, res) {
  res.writeHead(200);
  res.end('Salut tout le monde !');
  console.log("connected");
});

// Chargement de socket.io
var io = require('socket.io').listen(server);

// Quand un client se connecte, on le note dans la console
io.sockets.on('connection', function (socket) {
	
	
    console.log('Un client est connecté !');
	
	socket.emit('socketID', { id: socket.id });
	

	socket.emit('getPlayers', { players: players });
	socket.broadcast.emit('newPlayer', { id: socket.id });
	
	socket.on('disconnect', function(){
		console.log("Player Disconnected");
		socket.broadcast.emit('playerDisconnected', { id: socket.id });
		for(var i = 0; i < players.length; i++){
			if(players[i].id == socket.id){
				players.splice(i, 1);
			}
		}
	});
	
	socket.on('refreshPLS', function(data) {
	//socket.emit('refreshPlayer', { players: players });	
	
	for(var i = 0; i < players.length; i++){
			if(players[i].id == data['id']){
				players[i].x = data.x;
				players[i].y = data.y;
				console.log(players[i].id+" "+players[i].x+" "+players[i].y);
			}
			
		}
	socket.broadcast.emit('refreshPlayer', { players: players });
	 });
	
	
	 socket.on('newPos', function(data) {
       console.log("ID :  " + data['id'] +"  POS x: "+data['x'] + " POS y : "+data['y']+ " POS z : "+data['z']);
	for(var i = 0; i < players.length; i++){
			if(players[i].id == data['id']){
				players[i].x = data.x;
				players[i].y = data.y;
				console.log(players[i].id+" "+players[i].x+" "+players[i].y);
			}
			
		}
		//socket.emit('refreshPlayer', { players: players })
		
		//socket.broadcast.emit('refreshPlayer', { players: players });
	});
	
	 socket.on('ClickMove', function(data) {
		 console.log("ID :  " + data['id'] +"  POS x: "+data['x'] + " POS y : "+data['y']+ " POS z : "+data['z']);
		// socket.emit('GoClickMove', {id: data['id'], x : data['x'], y : data['y']});
	 
		socket.emit('GoClickMove', data);
		socket.broadcast.emit('GoClickMove', data);
	 });
	
	 socket.on('fire', function(data) {
		 console.log("FIRE");
		  console.log("ID :  " + data['id'] +"  POS x: "+data['x'] + " POS y : "+data['y']+ " POS z : "+data['z']);
		socket.emit('fireHere', data);
		socket.broadcast.emit('fireHere', data);
	 });
	
	 socket.on('sheild', function(data) {
		 console.log("sheild");
		  console.log("ID :  " + data['id'] +"  POS x: "+data['x'] + " POS y : "+data['y']+ " POS z : "+data['z']);
		socket.emit('sheildHere', data);
		socket.broadcast.emit('sheildHere', data);
	 });
	
	
	
	players.push(new player(socket.id, 0, 0));

});


function player(id, x, y){
	this.id = id;
	this.x = x;
	this.y = y;
}


server.listen(8080);