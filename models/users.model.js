const db = require("../db/connection");

exports.fetchUserArr = () => {
  return db.query(`SELECT users.username FROM users;`).then(({ rows }) => {
    return rows;
  });
};
