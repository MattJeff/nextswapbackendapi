const { io } = require("socket.io-client");

const socket = io("http://127.0.0.1:4000", {
  transports: ["websocket"],
  reconnection: false
});

socket.on("connect", () => {
  console.log("[SOCKET-TEST] Connected:", socket.id);
  socket.emit("join", "debug-user");
});

socket.on("disconnect", (reason) => {
  console.log("[SOCKET-TEST] Disconnected:", reason);
});

socket.on("connect_error", (err) => {
  console.error("[SOCKET-TEST] connect_error", err);
});
