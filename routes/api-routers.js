const { getEndpoints } = require("../controllers/endpoint-request-controllers");
const articlesRouter = require("./article-routers");

const apiRouter = require("express").Router();

apiRouter.route("/").get(getEndpoints);
apiRouter.use("/articles", articlesRouter);

module.exports = apiRouter;
