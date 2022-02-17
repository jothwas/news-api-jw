const { use } = require("../app/app.js");
const {
  checkArticleExists,
  checkUserExists,
} = require("../db/helpers/utils.js");
const {
  fetchCommentsByArticleId,
  addCommentsByArticleId,
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
  checkUserExists(username)
    .then(() => addCommentsByArticleId(article_id, username, comment))
    .then(([newComment]) => {
      res.status(201).send({ newComment });
    })
    .catch((err) => next(err));
};
