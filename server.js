const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io").listen(server);

let users  = [];
let connections = [];

server.listen(process.env.PORT || 3000);
console.log("server running...");
app.get("/", function(req,res){
    res.sendFile(__dirname+"/index.html");
})

io.sockets.on("connection", function(socket){
    connections.push(socket);
    console.log(connections.length+" connections");
    
    socket.on("disconnect", function(data){
        UserDisconnected(socket.username)
        users.splice(users.indexOf(socket.username), 1)
        UpdateUserNames();
        connections.splice(connections.indexOf(socket), 1);
    })

    socket.on("send message", function(data){
        io.sockets.emit("new message", {msg:data, username:socket.username})
    })

    socket.on("new user", function(data, callback){
        callback(true);
        socket.username = data;
        users.push(socket.username)
        UserConnected(socket.username);
        UpdateUserNames();
    })

    function UserConnected(username){
        io.sockets.emit("user connected", username)
    }

    function UserDisconnected(username){
        io.sockets.emit("user disconnected", username)
    }

    function UpdateUserNames(){
        io.sockets.emit("get users", users)
    }
})
