const express = require("express");
const app = express();
const { getTopics } = require("../controllers/topics-controllers");
const { error404 } = require("../errors/errors");
app.use(express.json());

/////// REQUESTS

app.get("/api/topics", getTopics);

/////// ERRORS

app.use("/api/*", error404);

module.exports = app;
