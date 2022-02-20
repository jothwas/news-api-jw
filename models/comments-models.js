const db = require("../db/connection.js");
const {
  rejectedPromise400,
  rejectedPromise404,
} = require("../errors/rejected-promises.js");

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

exports.removeCommentsById = async (comment_id) => {
  const { rows } = await db.query(
    `DELETE FROM comments WHERE comment_id = $1 RETURNING *`,
    [comment_id]
  );
  if (!rows.length) return rejectedPromise404("comment");
};

exports.editCommentById = async (comment_id, inc_votes = 0) => {
  const { rows } = await db.query(
    "UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING *;",
    [inc_votes, comment_id]
  );
  if (!rows.length) return rejectedPromise404("comment");
  const [updatedComment] = rows;
  return updatedComment;
};
