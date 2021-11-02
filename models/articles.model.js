const db = require("../db/connection");

exports.fetchArticle = (id) => {
  console.log("inside body");
  const queryStr = `SELECT 
  articles.*, COUNT(comments.comment_id)::int AS comment_count
FROM articles
JOIN comments 
ON articles.article_id = comments.article_id
WHERE articles.article_id = $1
GROUP BY articles.article_id;`;
  return db.query(queryStr, [id]).then(({ rows }) => {
    if (rows.length !== 0) {
      return rows[0];
    } else {
      return Promise.reject({ status: 404, msg: "article not found" });
    }
  });
};

exports.patchVotes = (article_id, inc_votes) => {
  console.log("inside model");
};
