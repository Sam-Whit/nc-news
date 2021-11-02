const express = require("express");
const { getArticle } = require("../controllers/articles.controller");

const articlesRouter = express.Router();

//app.js for topics paths
articlesRouter.get("/:article_id", getArticle);

module.exports = articlesRouter;
