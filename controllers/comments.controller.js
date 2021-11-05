const { commentRemover } = require("../models/comments.model");

exports.deleteComment = (req, res, next) => {
  const comment_id = req.params;

  commentRemover(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};
