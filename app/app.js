const express = require("express");
const app = express();
const { getTopics } = require("../controllers/topics-controllers");
const {
  getArticlesById,
  patchArticlesById,
  getAllArticles,
} = require("../controllers/articles-controllers");
const {
  error404,
  psqlErrorCodes,
  customErrors,
  serverErrors,
} = require("../errors/errors");
const { getUsers } = require("../controllers/users-controllers");
const {
  getCommentsByArticleId,
  postCommentsByArticleId,
  deleteCommentsById,
} = require("../controllers/comments-controllers");
const { getEndpoints } = require("../controllers/endpoint-request-controllers");
const apiRouter = require("../routes/api-routers");
app.use(express.json());

/////// REQUESTS

//// GET

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticlesById);
app.get("/api/users", getUsers);
app.get("/api/articles", getAllArticles);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

//// PATCH

app.patch("/api/articles/:article_id", patchArticlesById);

//// POST

app.post("/api/articles/:article_id/comments", postCommentsByArticleId);

//// DELETE

app.delete("/api/comments/:comment_id", deleteCommentsById);

/////// ERRORS

app.use("/api", apiRouter);
app.all("/*", error404);
app.use(customErrors);
app.use(psqlErrorCodes);
app.use(serverErrors);

module.exports = app;
