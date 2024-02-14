// const path = require("path");
// const express = require("express");
// const { Server } = require("socket.io");
// const cors = require("cors");

// const app = express();
// app.use(express.json());
// // .next\server\app\index.html

// console.log(__dirname, path.resolve());

// app.use(express.static(path.join(__dirname, "../.next")));

// app.get("/", (req, res) => {
//   res.sendFile(
//     path.join(__dirname, "..", ".next", "server", "app", "index.html")
//   );
// });
// app.get("/login", (req, res) => {
//   res.sendFile(
//     path.join(__dirname, "..", ".next", "server", "app", "login.html")
//   );
// });
// app.get("/register", (req, res) => {
//   res.sendFile(
//     path.join(__dirname, "..", ".next", "server", "app", "register.html")
//   );
// });

// const PORT = process.env.PORT || 3001;
// const server = app.listen(PORT, () => {
//   console.log(`Socket.io server is running on port ${PORT}`);
// });

// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:3000",
//   },
// });

// function getRoomId(user1, user2) {
//   const id = [user1, user2].sort();
//   return id[0] + id[1];
// }

// io.use((socket, next) => {
//   const user1 = socket.handshake.auth.user;
//   console.log(user1);
//   if (!user1) {
//     console.log("invalid username");
//     return next(new Error("invalid username"));
//   }
//   socket.user1 = user1;
//   next();
// });

// let users = [];

// io.on("connection", (socket) => {
//   // for (let [id, socket] of io.of("/").sockets) {
//   users.push({
//     socketId: socket.id,
//     username: socket.user1,
//   });

//   io.emit("onlineusers", users, "online");
//   console.log(users);
//   console.log("a user connected", socket.id);

//   // socket.on("login", (user) => {
//   //   if (user !== "") onlineUsers[socket.id] = user;
//   //   console.log(onlineUsers);
//   //   socket.broadcast.emit("onlineusers", onlineUsers);
//   // });

//   socket.on("join", (user1, user2) => {
//     const roomId = getRoomId(user1, user2);
//     socket.join(roomId);

//     socket.to(roomId).emit("join", "user joined", roomId);
//   });

//   socket.on("send_message", (msg, user1, user2) => {
//     // console.log("msg", msg);
//     const roomId = getRoomId(user1, user2);
//     socket.to(roomId).emit("receive_msg", msg, user1, user2);
//   });

//   socket.on("typing", (user1, user2) => {
//     const roomId = getRoomId(user1, user2);
//     socket.to(roomId).emit("typing", user1);
//   });

//   socket.on("disconnect", () => {
//     console.log("user disconnected", socket.id);
//     users = users.filter((user) => user.socketId !== socket.id);
//     console.log(users);
//     io.emit("onlineusers", users, "offline");
//   });
// });
