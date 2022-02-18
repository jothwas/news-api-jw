const {
  checkArticleExists,
  checkUserExists,
} = require("../db/helpers/utils.js");
const {
  fetchCommentsByArticleId,
  addCommentsByArticleId,
  removeCommentsById,
} = require("../models/comments-models.js");

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  Promise.all([
    fetchCommentsByArticleId(article_id),
    checkArticleExists(article_id),
  ])
    .then(([comments]) => {
      res.status(200).send({ comments });
    })
    .catch((err) => next(err));
};

exports.postCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { username, comment } = req.body;
  Promise.all([checkArticleExists(article_id), checkUserExists(username)])
    .then(() => addCommentsByArticleId(article_id, username, comment))
    .then(([newComment]) => {
      res.status(201).send({ newComment });
    })
    .catch((err) => next(err));
};

exports.deleteCommentsById = (req, res, next) => {
  const { comment_id } = req.params;
  removeCommentsById(comment_id)
    .then(() => res.status(204).send())
    .catch((err) => next(err));
};
