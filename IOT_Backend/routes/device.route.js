const express = require("express");
const router = express.Router();
const {
  getAllDevices,
  getLatestDeviceStatus,
} = require("../controllers/device.controller");

router.get("/", getAllDevices);
router.get("/status", getLatestDeviceStatus);

module.exports = router;
