const http = require("http");
const { parse } = require("url");
const next = require("next");
const { Server } = require("socket.io");

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const PORT = process.env.PORT || 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, PORT });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  //   const httpServer = createServer(async (req, res) => {
  //     try {
  //       // Be sure to pass `true` as the second argument to `url.parse`.
  //       // This tells it to parse the query portion of the URL.
  //       const parsedUrl = parse(req.url, true);
  //       const { pathname, query } = parsedUrl;

  //       if (pathname === "/login") {
  //         await app.render(req, res, "/login", query);
  //         //   } else if (pathname === "/register") {
  //         //     await app.render(req, res, "/register", query);
  //       } else {
  //         await handle(req, res, parsedUrl);
  //       }
  //     } catch (err) {
  //       console.error("Error occurred handling", req.url, err);
  //       res.statusCode = 500;
  //       res.end("internal server error");
  //     }
  //   })
  //     .once("error", (err) => {
  //       console.error(err);
  //       process.exit(1);
  //     })
  //     .listen(port, () => {
  //       console.log(`> Ready on http://${hostname}:${port}`);
  //     });

  const httpServer = http.createServer(handle);
  const io = new Server(httpServer);

  function getRoomId(user1, user2) {
    const id = [user1, user2].sort();
    return id[0] + id[1];
  }

  io.use((socket, next) => {
    const user1 = socket.handshake.auth.user;
    // console.log(user1);
    if (!user1) {
      console.log("invalid username");
      return next(new Error("invalid username"));
    }
    socket.user1 = user1;
    next();
  });

  let users = [];

  io.on("connection", (socket) => {
    // for (let [id, socket] of io.of("/").sockets) {
    users.push({
      socketId: socket.id,
      username: socket.user1,
    });

    io.emit("onlineusers", users, "online");
    console.log(users);
    console.log("a user connected", socket.id);

    // socket.on("login", (user) => {
    //   if (user !== "") onlineUsers[socket.id] = user;
    //   console.log(onlineUsers);
    //   socket.broadcast.emit("onlineusers", onlineUsers);
    // });

    socket.on("join", (user1, user2) => {
      const roomId = getRoomId(user1, user2);
      socket.join(roomId);

      socket.to(roomId).emit("join", "user joined", roomId);
    });

    socket.on("send_message", (msg, user1, user2) => {
      // console.log("msg", msg);
      const roomId = getRoomId(user1, user2);
      socket.to(roomId).emit("receive_msg", msg, user1, user2);
    });

    socket.on("typing", (user1, user2) => {
      const roomId = getRoomId(user1, user2);
      socket.to(roomId).emit("typing", user1);
    });

    socket.on("disconnect", () => {
      console.log("user disconnected", socket.id);
      users = users.filter((user) => user.socketId !== socket.id);
      console.log(users);
      io.emit("onlineusers", users, "offline");
    });
  });

  httpServer.listen(PORT, () => {
    console.log(
      `> Ready on http://${hostname}:${PORT} in ${process.env.NODE_ENV} mode`
    );
    // console.log("server started");
  });
});
