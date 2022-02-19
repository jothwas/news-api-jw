const { getEndpoints } = require("../controllers/endpoint-request-controllers");
const articlesRouter = require("./article-routers");
const commentsRouter = require("./comment-routers");
const topicRouter = require("./topic-routers");
const userRouter = require("./user-routers");

const apiRouter = require("express").Router();

apiRouter.route("/").get(getEndpoints);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);
apiRouter.use("/topics", topicRouter);
apiRouter.use("/users", userRouter);

module.exports = apiRouter;
