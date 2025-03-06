require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const sequelize = require("./config/database");

// Import Routes
const deviceRoutes = require("./routes/device.route");
const sensorDataRoutes = require("./routes/sensorData.route");
const deviceControlRoutes = require("./routes/deviceControl.route");
const { default: connectDatabase } = require("./config/database");
const {
  errorHandlingMiddleware,
} = require("./middlewares/errorHandlingMiddleware");
require("./config/mqtt"); // Kết nối MQTT
const app = express();
app.use(cors());
app.use(bodyParser.json());
// Sử dụng formidable middleware để xử lý FormData
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    //Chan tat ca cac domain khac ngoai domain nay
    origin: process.env.CLIENT_URL,
    //Production domain
    // origin: "https://sfotipy-frontend.vercel.app",
    // credentials: true, //Để bật cookie HTTP qua CORS
  })
);

// Routes
app.use("/api/devices", deviceRoutes);
app.use("/api/sensor-datas", sensorDataRoutes);
app.use("/api/device-controls", deviceControlRoutes);

app.use(errorHandlingMiddleware);

// Kết nối DB & chạy server
connectDatabase();

const port = process.env.PORT || 8888;
const listener = app.listen(port, () => {
  console.log(`Server is running on the port ${listener.address().port}`);
});
