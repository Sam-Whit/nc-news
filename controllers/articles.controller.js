const {
  fetchArticle,
  patchVotes,
  fetchArticlesArr,
} = require("../models/articles.model.js");

exports.getArticle = (req, res, next) => {
  const { article_id } = req.params;

  fetchArticle(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.patchArticle = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  patchVotes(article_id, inc_votes)
    .then((data) => res.status(201).send({ article: data }))
    .catch(next);
};

exports.getAllArticles = (req, res, next) => {
  fetchArticlesArr()
    .then((articles) => res.status(200).send({ articles }))
    .catch(next);
};
