const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');


const { generateMessage, generateLocationMessage } = require('./utils/message');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 5000;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);


app.use(express.static(publicPath));
io.on('connection', (socket) => {
    console.log('new user connected');

    // When a new user join
    socket.emit('newMessage', generateMessage('Admin', 'Welcome to chat app'))
    // tell everybody a new user has joined

    socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user has joined'))

    socket.on('createMessage', (message, callback) => {
        console.log('Create Message', message);
        // io.emit('newMessage', {
        //     from: message.from,
        //     text: message.text,
        //     createdAt: new Date().getTime()
        // })
        io.emit('newMessage', generateMessage(message.from, message.text))
        callback('this is from the server');
    })
    socket.on('createLocationMessage', (coords) => {
        io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude))
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