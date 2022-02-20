const db = require("../db/connection.js");
const { rejectedPromise400 } = require("../errors/rejected-promises.js");

exports.fetchTopics = async () => {
  const { rows } = await db.query("SELECT * FROM topics;");
  return rows;
};

exports.sendTopic = async (slug, description) => {
  if (!slug || !description)
    return rejectedPromise400("Bad request - missing information");
  if (typeof slug !== "string")
    return rejectedPromise400("Bad request - invalid input");
  const { rows } = await db.query(
    `INSERT INTO topics
  (slug, description)
VALUES
  ($1, $2)
RETURNING *;`,
    [slug, description]
  );
  const [topic] = rows;
  return topic;
};
