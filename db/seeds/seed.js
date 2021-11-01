const db = require("../connection.js");
const format = require("pg-format");

const seed = (data) => {
  const { articleData, commentData, topicData, userData } = data;
  // 1. create tables
  return (
    db
      .query("DROP TABLE IF EXISTS comments;")
      .then(() => {
        return db.query(`DROP TABLE IF EXISTS articles;`);
      })
      .then(() => {
        return db.query(`DROP TABLE IF EXISTS users;`);
      })
      .then(() => {
        return db.query(`DROP TABLE IF EXISTS topics;`);
      })
      .then(() => {
        return db.query(`CREATE TABLE topics (
      slug VARCHAR(200) PRIMARY KEY,
      description VARCHAR(200)
    );`);
      })
      .then(() => {
        return db.query(`CREATE TABLE users (
      username VARCHAR(20) PRIMARY KEY,
      avatar_url VARCHAR,
      name VARCHAR(200)
    );`);
      })
      .then(() => {
        return db.query(`CREATE TABLE articles (
        article_id SERIAL PRIMARY KEY,
        title VARCHAR,
        body VARCHAR,
        votes INT DEFAULT 0,
        topic TEXT REFERENCES topics(slug),
        author TEXT REFERENCES users(username),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );`);
      })
      .then(() => {
        return db.query(`CREATE TABLE comments (
        comment_id SERIAL PRIMARY KEY,
        author TEXT REFERENCES users(username),
        article_id INT REFERENCES articles(article_id),
        votes INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        body VARCHAR
      );`);
      })
      // 2. insert data
      .then(() => {
        console.log(topicData);
        const queryStr = format(
          `INSERT INTO topics (slug, description)
      VALUES %L RETURNING *;`,
          topicData.map((topic) => {
            return [topic.slug, topic.description];
          })
        );
        return db.query(queryStr);
      })
      .then(() => {
        const queryStr = format(
          `INSERT INTO users (username, avatar_url, name)
      VALUES %L RETURNING *;`,
          userData.map((user) => {
            return [user.username, user.avatar_url, user.name];
          })
        );
        return db.query(queryStr);
      })
      .then(() => {
        const queryStr = format(
          `INSERT INTO articles (title, body, votes, topic, author, created_at)
          VALUES %L RETURNING *;`,
          articleData.map((article) => {
            return [
              article.title,
              article.body,
              article.votes,
              article.topic,
              article.author,
              article.created_at,
            ];
          })
        );
        return db.query(queryStr);
      })
      .then(() => {
        console.log("inserting 3");
        const queryStr = format(
          `INSERT INTO comments ( author, article_id, votes, created_at,
        body)
  VALUES %L RETURNING *;`,
          commentData.map((comment) => {
            return [
              comment.author,
              comment.article_id,
              comment.votes,
              comment.created_at,
              comment.body,
            ];
          })
        );
        return db.query(queryStr);
      })
  );
};

module.exports = seed;
