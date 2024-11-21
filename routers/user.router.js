const express = require("express");
const { loginUser, registerUser, getUsers } = require("../controller/user.controller");
const { authenticate } = require('../middleware/autMiddleware');
const router = express.Router();

router.route("/login").post(loginUser)
router.route("/register").post(authenticate , registerUser)
router.route("/").get(authenticate, getUsers)

module.exports = router;