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
    socket.on('room', function(room) {
        socket.join(room);
    });

    socket.on('dispatch', function(data) {
        socket.broadcast.to(data.room)
            .emit('dispatch', data);
    });
});
