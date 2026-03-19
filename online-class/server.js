const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

app.use(express.static("public"));

io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).emit("user-connected", userId);

    // Signaling messages for WebRTC
    socket.on("offer", (data) => {
      socket.to(data.to).emit("offer", { from: userId, sdp: data.sdp });
    });

    socket.on("answer", (data) => {
      socket.to(data.to).emit("answer", { from: userId, sdp: data.sdp });
    });

    socket.on("ice-candidate", (data) => {
      socket.to(data.to).emit("ice-candidate", { from: userId, candidate: data.candidate });
    });

    socket.on("disconnect", () => {
      socket.to(roomId).emit("user-disconnected", userId);
    });
  });
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});
