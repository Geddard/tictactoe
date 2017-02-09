var _ = require('lodash');
var express = require('express');
var path = require('path');

var app = express();

var port = process.env.PORT || 3000;

app.use(require('connect-livereload')({port: 35680}));

app.use(express.static(path.join(__dirname, 'dist')));

app.use('/res', express.static(path.join(__dirname, 'resources')));

var server = app.listen(port, function(){
    console.log('Started listening on port', port);
});

var io = require('socket.io')(server);

io.on('connection', (socket) => {
    socket.on('room', (room) => {
        socket.join(room);
        socket.emit('assing_id', _.uniqueId('user_'));
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
});
