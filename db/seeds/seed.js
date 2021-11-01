const db = require("../connection.js");
const format = require("pg-format");

const seed = (data) => {
  const { articleData, commentData, topicData, userData } = data;
  // 1. create tables
  return db
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
    );`); //ask about NVARCHAR for url
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
      )`);
    })
    .then(() => {
      return db.query(`CREATE TABLE comments (
        comment_id SERIAL PRIMARY KEY,
        author TEXT REFERENCES users(username),
        article_id INT REFERENCES articles(article_id),
        votes INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        body VARCHAR
      )`);
    })
    .then(() => {
      console.log("inserting");
      return db.query();
    });
  // 2. insert data
};

module.exports = seed;
