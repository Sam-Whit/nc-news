const express = require("express");
const topicsRouter = require("./topics.router");
const articlesRouter = require("./articles.router");
const commentsRouter = require("./comments.router");
const usersRouter = require("./users.router");
const { getAllEndPoints } = require("../controllers/api.controller");

const apiRouter = express.Router();

apiRouter.route("/").get(getAllEndPoints);

apiRouter.use("/topics", topicsRouter);

apiRouter.use("/articles", articlesRouter);

apiRouter.use("/comments", commentsRouter);

console.log(usersRouter);

apiRouter.use("/users", usersRouter);

module.exports = apiRouter;
