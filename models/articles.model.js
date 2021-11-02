const db = require("../db/connection");

exports.fetchArticle = (id) => {
  console.log("inside body");
  const queryStr = `SELECT articles.*,
COALESCE(COUNT(comments.article_id),0) AS comment_count FROM articles 
LEFT OUTER JOIN comments ON article.article_id = comments.article_id 
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
