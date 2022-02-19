const { deleteCommentsById } = require("../controllers/comments-controllers");

const commentsRouter = require("express").Router();

commentsRouter.route("/:comment_id").delete(deleteCommentsById);

module.exports = commentsRouter;
