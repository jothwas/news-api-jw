const { getEndpoints } = require("../controllers/endpoint-request-controllers");

const apiRouter = require("express").Router();

apiRouter.route("/").get(getEndpoints);

module.exports = apiRouter;
