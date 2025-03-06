const express = require("express");
const router = express.Router();
const {
  getAllSensorData,
  getLatestSensorData,
} = require("../controllers/sensorData.controller");

router.get("/", getAllSensorData);
router.get("/latest", getLatestSensorData);

module.exports = router;
