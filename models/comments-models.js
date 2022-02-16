const db = require("../db/connection.js");

exports.fetchCommentsByArticleId = async (article_id) => {
  const { rows: comments } = await db.query(
    "SELECT * FROM comments WHERE article_id = $1;",
    [article_id]
  );
  return comments;
};
