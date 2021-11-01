const db = require("../connection.js");
const format = require("pg-format");

const seed = (data) => {
  const { articleData, commentData, topicData, userData } = data;
  // 1. create tables
  return db
    .query("DROP TABLE IF EXISTS topics;")
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS users;`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS articles;`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS comments;`);
    })
    .then(() => {
      return db
        .query(
          `CREATE TABLE topics (
      slug PRIMARY KEY,
      description VARCHAR(200)
    );`
        )
        .then();
    });
  // 2. insert data
};

module.exports = seed;
