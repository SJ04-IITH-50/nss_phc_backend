const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const receptionistRoutes = require("./routes/receptionistroute");
const doctorRoutes = require("./routes/doctorroute");
const pharmacistRoute = require("./routes/pharmacistroute");
const userRoute = require("./routes/userroute");
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://nss-phc-frontend.onrender.com/",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  },
});

const PORT = process.env.PORT;
app.use(cors());
app.use(bodyParser.json());

app.set("io", io);

app.use("/api/receptionist", receptionistRoutes);
app.use("/api/doctor", doctorRoutes);
app.use("/api/pharmacist", pharmacistRoute);
app.use("/api/user", userRoute);
io.on("connection", (socket) => {
  console.log("A doctor connected for real-time updates");

  socket.on("disconnect", () => {
    console.log("Doctor disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
