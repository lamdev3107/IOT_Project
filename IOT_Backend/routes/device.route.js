const express = require("express");
const router = express.Router();
const { getAllDevices } = require("../controllers/device.controller");

router.get("/", getAllDevices);

module.exports = router;
