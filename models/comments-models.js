const db = require("../db/connection.js");

exports.fetchCommentsByArticleId = async (article_id) => {
  const { rows: comments } = await db.query(
    "SELECT * FROM comments WHERE article_id = $1;",
    [article_id]
  );
  return comments;
};

exports.addCommentsByArticleId = async (article_id, username, comment) => {
  const { rows: newComment } = await db.query(
    `
  INSERT INTO comments
  (article_id, author, body)
  VALUES
  ($1, $2, $3)
  RETURNING *;`,
    [article_id, username, comment]
  );
  return newComment;
};
