const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 5000;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);


app.use(express.static(publicPath));
io.on('connection', (socket) => {
    console.log('new user connected');

    socket.emit('newMessage', {
        from: 'asm',
        text: 'Im fine how are you',
        createdAt: 123
    });
    socket.on('createMessage', (message) => {
        console.log('Create Message', message);

    })

    socket.on('connect', () => {
        console.log('New user connected');

    })
    socket.on('disconnect', () => {
        console.log('Disconnected user');

    })

})

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);

})  