const format = require("pg-format");
const db = require("../connection.js");

// exports.checkTopicExists = async (topic) => {
//   const dbOutput = await db.query("SELECT * FROM articles WHERE topic = $1;", [
//     topic,
//   ]);

//   if (dbOutput.rows.length === 0) {
//     // resource does NOT exist
//     return Promise.reject({ status: 404, msg: "topic not found" });
//   }
// };

exports.checkExists = async (table, column, value) => {
  // %I is an identifier in pg-format
  const queryStr = format("SELECT * FROM %I WHERE %I = $1;", table, column);
  const dbOutput = await db.query(queryStr, [value]);

  if (dbOutput.rows.length === 0) {
    // resource does NOT exist
    return Promise.reject({ status: 404, msg: "topic not found" });
  }
};
