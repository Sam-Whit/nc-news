const db = require("../db/connection");

exports.fetchUserArr = () => {
  return db.query(`SELECT users.username FROM users;`).then(({ rows }) => {
    return rows;
  });
};

exports.fetchUser = (username) => {
  const queryStr = `SELECT users.* FROM users
  WHERE users.username = $1
  GROUP BY users.username;`;

  return db.query(queryStr, [username]).then(({ rows }) => {
    if (rows.length !== 0) {
      return rows[0];
    } else {
      return Promise.reject({ status: 404, msg: "article not found" });
    }
  });
};
