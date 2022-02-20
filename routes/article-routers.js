const {
  getAllArticles,
  getArticlesById,
  patchArticlesById,
  postArticle,
} = require("../controllers/articles-controllers");
const {
  getCommentsByArticleId,
  postCommentsByArticleId,
} = require("../controllers/comments-controllers");

const articlesRouter = require("express").Router();

articlesRouter.route("/").get(getAllArticles);

articlesRouter.route("/").post(postArticle);

articlesRouter
  .route("/:article_id")
  .get(getArticlesById)
  .patch(patchArticlesById);

articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleId)
  .post(postCommentsByArticleId);

module.exports = articlesRouter;
