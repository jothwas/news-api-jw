const express = require("express");
const app = express();
const { getTopics } = require("../controllers/topics-controllers");
const { error404 } = require("../errors/errors");

/////// REQUESTS

app.get("/api/topics", getTopics);

/////// ERRORS

app.use("/*", error404);

module.exports = app;
