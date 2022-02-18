const { fetchEndpoints } = require("../models/endpoint-request-models");

exports.getEndpoints = (req, res, next) => {
  fetchEndpoints()
    .then((endpoints) => {
      res.status(200).send({ endpoints });
    })
    .catch((err) => next(err));
};
