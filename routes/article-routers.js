const {
  getAllArticles,
  getArticlesById,
  patchArticlesById,
  postArticle,
  deleteArticleById,
} = require("../controllers/articles-controllers");
const {
  getCommentsByArticleId,
  postCommentsByArticleId,
} = require("../controllers/comments-controllers");

const articlesRouter = require("express").Router();

articlesRouter.route("/").get(getAllArticles).post(postArticle);

articlesRouter
  .route("/:article_id")
  .get(getArticlesById)
  .patch(patchArticlesById)
  .delete(deleteArticleById);

articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleId)
  .post(postCommentsByArticleId);

module.exports = articlesRouter;
