const express = require("express");

const { getUserArr } = require("../controllers/users.controller");

const usersRouter = express.Router();

usersRouter.route("/").get(getUserArr);

module.exports = usersRouter;
