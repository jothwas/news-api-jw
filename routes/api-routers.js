const { getEndpoints } = require("../controllers/endpoint-request-controllers");
const articlesRouter = require("./article-routers");
const commentsRouter = require("./comment-routers");

const apiRouter = require("express").Router();

apiRouter.route("/").get(getEndpoints);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);

module.exports = apiRouter;
