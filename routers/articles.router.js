const express = require("express");
const {
  getArticle,
  patchArticle,
  getAllArticles,
} = require("../controllers/articles.controller");

const articlesRouter = express.Router();

//app.js for topics paths
articlesRouter.route("/:article_id").get(getArticle).patch(patchArticle);
articlesRouter.route("/").get(getAllArticles);

module.exports = articlesRouter;
