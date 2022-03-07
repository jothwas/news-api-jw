const express = require("express");
const app = express();
const {
  error404,
  psqlErrorCodes,
  customErrors,
  serverErrors,
} = require("../errors/errors");
const apiRouter = require("../routes/api-routers");
const cors = require("cors");

app.use(cors());

app.use(express.json());
app.use("/api", apiRouter);

app.all("/*", error404);
app.use(customErrors);
app.use(psqlErrorCodes);
app.use(serverErrors);

module.exports = app;
