const db = require("../db/connection");

//::int string conversion to interger from string in SQL

exports.fetchArticle = (id) => {
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

//one table used no table. prefix

exports.patchVotes = (article_id, inc_votes) => {
  const queryStr = `UPDATE articles 
SET votes = votes + $1
WHERE article_id = $2
RETURNING *;`;
  return db.query(queryStr, [inc_votes, article_id]).then((obj) => {
    console.log(obj);
  });
};
