const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");
const { Server } = require("socket.io");
const receptionistRoutes = require("./routes/receptionistroute");
const doctorRoutes = require("./routes/doctorroute");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT;

app.use(bodyParser.json());

app.set("io", io);

app.use("/api/receptionist", receptionistRoutes);
app.use("/api/doctor", doctorRoutes);

io.on("connection", (socket) => {
  console.log("A doctor connected for real-time updates");

  socket.on("disconnect", () => {
    console.log("Doctor disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
