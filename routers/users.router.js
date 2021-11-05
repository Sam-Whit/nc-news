const express = require("express");

const { getUserArr, getUser } = require("../controllers/users.controller");

const usersRouter = express.Router();

usersRouter.route("/").get(getUserArr);

usersRouter.route("/:username").get(getUser);

module.exports = usersRouter;
