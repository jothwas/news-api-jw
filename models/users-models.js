const { use } = require("../app/app.js");
const db = require("../db/connection.js");

exports.fetchUsers = async () => {
  const { rows: users } = await db.query("SELECT username FROM users;");
  return users;
};
