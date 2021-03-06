var express = require('express');
var path = require('path');

var app = express();

var port = process.env.PORT || 3000;

if (process.env.NODE_ENV === 'development') {
    app.use(require('connect-livereload')({port: 35680}));
}

app.use(express.static(path.join(__dirname, 'dist')));

app.use('/res', express.static(path.join(__dirname, 'resources')));

app.get('*', function (request, response){
  response.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
});

var server = app.listen(port, function(){
    console.log('Started listening on port', port);
});

var io = require('socket.io')(server);

io.on('connection', (socket) => {
    socket.on('room', (room) => {
        socket.join(room);
        socket.emit('assing_id', socket.id);
    });

    socket.on('get_player_count', (room) => {
        let playerCount = io.sockets.adapter.rooms[room].length;

        if (playerCount < 2) {
            io.sockets.in(room).emit('waiting');
        } else {
            io.sockets.in(room).emit('ready');
        }
    });

    socket.on('add_stone', (data) => {
        io.sockets.in(data.room).emit('update_board', data);
    });

    socket.on('add_stone_solo', (data) => {
        socket.emit('update_board', data);
    });

    socket.on('request_restart', (room) => {
        io.sockets.in(room).emit('confirm_restart');
    });

    socket.on('request_confirmed', (room) => {
        io.sockets.in(room).emit('restart_all');
    });

    socket.on('forceDisconnect', () => {
        var rooms = io.sockets.adapter.rooms;

        for (var room in rooms) {
            socket.leave(room);
        }
    });
});
