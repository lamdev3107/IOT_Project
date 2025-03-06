const express = require("express");
const router = express.Router();
const {
  getAllHistory,
  controlDevices,
  controlAllDevices,
  getControlHistory,
  getLatestControlHistory,
} = require("../controllers/deviceControl.controller");

router.get("/", getControlHistory);
router.get("/:deviceId/latest", getLatestControlHistory);
router.post("/", controlDevices);
router.post("/all", controlAllDevices);

module.exports = router;
