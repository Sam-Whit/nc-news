const express = require("express");
const topicsRouter = require("./topics.router");

const apiRouter = express.Router();

apiRouter.use("/topics", topicsRouter);

module.exports = apiRouter;
