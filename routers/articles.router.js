const express = require("express");
const {
  getArticle,
  patchArticle,
} = require("../controllers/articles.controller");

const articlesRouter = express.Router();

//app.js for topics paths
articlesRouter.route("/:article_id").get(getArticle).patch(patchArticle);

module.exports = articlesRouter;
