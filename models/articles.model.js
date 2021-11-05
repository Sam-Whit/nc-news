const db = require("../db/connection");
const { checkExists } = require("../db/data/utils");

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

exports.fetchArticlesArr = async (
  sort_by = "created_at",
  order = "desc",
  topic
) => {
  if (
    ![
      "title",
      "topic",
      "article_id",
      "body",
      "author",
      "votes",
      "created_at",
    ].includes(sort_by)
  ) {
    return Promise.reject({ status: 400, msg: "Invalid sort query" });
  }

  if (!["asc", "desc"].includes(order)) {
    return Promise.reject({ status: 400, msg: "Invalid order query" });
  }

  let queryStr = `SELECT articles.article_id, articles.title, articles.author, articles.topic, articles.created_at, articles.votes, COUNT(comments.comment_id)::Int AS comment_count FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id`;

  const queryValues = [];

  if (topic) {
    queryValues.push(topic);
    queryStr += ` WHERE articles.topic = $1`;
  }

  queryStr += ` GROUP BY articles.article_id`;

  queryStr += ` ORDER BY ${sort_by} ${order}`;

  const { rows } = await db.query(queryStr, queryValues);

  if (!rows.length && topic) {
    await checkExists("topics", "slug", topic);
  }
  return rows;
};

exports.fetchArticleCommentArr = (article_id) => {
  const queryStr = `SELECT * FROM comments 
    WHERE article_id = $1
    GROUP BY comments.comment_id;`;
  return db.query(queryStr, [article_id]).then(({ rows }) => {
    if (rows.length !== 0) {
      return rows;
    } else {
      return Promise.reject({ status: 404, msg: "article not found" });
    }
  });
};

exports.postComment = (body, username, id) => {
  if (!body) {
    return Promise.reject({
      status: 400,
      msg: "Bad request, no comment provided",
    });
  }
  const queryStr = `INSERT INTO comments (body, author, article_id)
    VALUES ($1, $2, $3)
    RETURNING *;`;

  return db.query(queryStr, [body, username, id]).then(({ rows }) => {
    return rows[0];
  });
};
