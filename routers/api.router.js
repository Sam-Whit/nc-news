const express = require("express");
const topicsRouter = require("./topics.router");
const articleRouter = require("./article.router");

const apiRouter = express.Router();

apiRouter.use("/topics", topicsRouter);

apiRouter.use("/articles", articlesRouter);

module.exports = apiRouter;
