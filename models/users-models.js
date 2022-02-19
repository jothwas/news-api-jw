const db = require("../db/connection.js");

exports.fetchUsers = async () => {
  const { rows: users } = await db.query("SELECT username FROM users;");
  return users;
};

exports.fetchUserByUsername = async (username) => {
  const { rows } = await db.query("SELECT * FROM users WHERE username = $1;", [
    username,
  ]);
  const [user] = rows;
  return user;
};
