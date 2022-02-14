const express = require("express");
const app = express();
const {
  getTopics,
  getArticlesById,
} = require("../controllers/topics-controllers");
const { error404, psqlErrorCodes, customErrors } = require("../errors/errors");

/////// REQUESTS

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticlesById);

/////// ERRORS

app.use(customErrors);
app.use(psqlErrorCodes);
app.all("/*", error404);

module.exports = app;
