const {
  deleteCommentsById,
  patchCommentById,
} = require("../controllers/comments-controllers");

const commentsRouter = require("express").Router();

commentsRouter
  .route("/:comment_id")
  .delete(deleteCommentsById)
  .patch(patchCommentById);

module.exports = commentsRouter;
