const express = require("express");
const router = express.Router();
const {
  getAllHistory,
  controlDevices,
  controlAllDevices,
  getControlHistory,
} = require("../controllers/deviceControl.controller");

router.get("/", getControlHistory);
router.post("/", controlDevices);
router.post("/all", controlAllDevices);

module.exports = router;
