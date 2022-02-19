const db = require("../db/connection.js");
const { rejectedPromise404 } = require("../errors/rejected-promises.js");

exports.fetchUsers = async () => {
  const { rows: users } = await db.query("SELECT username FROM users;");
  return users;
};

exports.fetchUserByUsername = async (username) => {
  const { rows } = await db.query("SELECT * FROM users WHERE username = $1;", [
    username,
  ]);
  if (!rows.length) return rejectedPromise404("username");
  const [user] = rows;
  return user;
};
