const express = require("express");
const app = express();
const { getTopics } = require("../controllers/topics-controllers");
const {
  getArticlesById,
  patchArticlesById,
  getAllArticles,
  getCommentsByArticleId,
} = require("../controllers/articles-controllers");
const { error404, psqlErrorCodes, customErrors } = require("../errors/errors");
const { getUsers } = require("../controllers/users-controllers");
app.use(express.json());

/////// REQUESTS

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticlesById);
app.patch("/api/articles/:article_id", patchArticlesById);
app.get("/api/users", getUsers);
app.get("/api/articles", getAllArticles);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

/////// ERRORS

app.all("/*", error404);
app.use(customErrors);
app.use(psqlErrorCodes);

module.exports = app;
