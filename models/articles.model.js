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
  if (!inc_votes) {
    return Promise.reject({
      status: 400,
      msg: "Bad request, no input obj provided",
    });
  }
  return db.query(queryStr, [inc_votes, article_id]).then(({ rows }) => {
    return rows[0];
  });
};

exports.fetchArticlesArr = (sort_by = "created_at", order = "asc", topic) => {
  let queryStr = `SELECT articles.article_id, articles.title, articles.author, articles.topic, articles.created_at, articles.votes, COUNT(comments.comment_id)::Int AS comment_count FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    GROUP BY articles.article_id`;

  queryStr += ` ORDER BY ${sort_by} ${order}`;

  //   if (topic) {
  //     if (queryValues.length) {
  //       queryStr += " AND";
  //     } else {
  //       queryStr += " WHERE";
  //     }
  //     queryValues.push(order);
  //     queryStr += ` column_name = $${queryValues.length}`;
  //   }

  return db.query(queryStr).then(({ rows }) => {
    return rows;
  });
};
