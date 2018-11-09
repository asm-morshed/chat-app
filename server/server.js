const path = require("path");
const http = require("http");
const express = require("express");
const socketIO = require("socket.io");

const { generateMessage, generateLocationMessage } = require("./utils/message");
const { isRealString } = require('./utils/validation')
const publicPath = path.join(__dirname, "../public");
const port = process.env.PORT || 5000;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(publicPath));
io.on("connection", socket => {
  console.log("new user connected");


  socket.on('join', (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      callback('Name and room name are rquired')
    }
    socket.join(params.room);

    // When a new user join
    socket.emit("newMessage", generateMessage("Admin", "Welcome to chat app"));
    // tell everybody a new user has joined

    socket.broadcast.to(params.room).emit(
      "newMessage",
      generateMessage("Admin", `${params.name} has joined.`)
    );
    callback()
  })
  socket.on("createMessage", (message, callback) => {
    console.log("Create Message", message);
    // io.emit('newMessage', {
    //     from: message.from,
    //     text: message.text,
    //     createdAt: new Date().getTime()
    // })
    io.emit("newMessage", generateMessage(message.from, message.text));
    callback();
  });
  socket.on("createLocationMessage", coords => {
    io.emit(
      "newLocationMessage",
      generateLocationMessage("Admin", coords.latitude, coords.longitude)
    );
  });

  socket.on("connect", () => {
    console.log("New user connected");
  });
  socket.on("disconnect", () => {
    console.log("Disconnected user");
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
