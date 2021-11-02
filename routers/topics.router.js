const express = require("express");
const { getTopics } = require("../controllers/topics.controller");

const topicsRouter = express.Router();

//app.js for topics paths
topicsRouter.get("/", getTopics);

module.exports = topicsRouter;
