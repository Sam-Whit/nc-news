const express = require("express");
const { getTopics } = require("../controllers/topics.controller");
const { invalidRequestType } = require("../controllers/error.controller");

const topicsRouter = express.Router();

//app.js for topics paths
topicsRouter
  .get("/", getTopics)
  .post("/topics", invalidRequestType)
  .delete("/topics", invalidRequestType)
  .patch("/topics", invalidRequestType);

module.exports = topicsRouter;
