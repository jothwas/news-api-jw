const { fetchTopics, sendTopic } = require("../models/topics-models");

exports.getTopics = (req, res, next) => {
  fetchTopics()
    .then((topics) => {
      res.status(200).send(topics);
    })
    .catch((err) => next(err));
};

exports.postTopic = (req, res, next) => {
  const { slug, description } = req.body;
  sendTopic(slug, description)
    .then((topic) => {
      res.status(201).send({ topic });
    })
    .catch((err) => next(err));
};
