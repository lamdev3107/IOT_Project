const express = require("express");
const router = express.Router();
const { login, updateUserProfile } = require("../controllers/auth.controller");

router.post("/login", login);
router.put("/user/:id", updateUserProfile);

module.exports = router;
