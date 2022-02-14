const { fetchTopics, fetchArticlesById } = require("../models/topics-models");

exports.getTopics = (req, res, next) => {
  fetchTopics()
    .then((topics) => {
      res.status(200).send(topics);
    })
    .catch((err) => next(err));
};

exports.getArticlesById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticlesById(article_id)
    .then((article) => res.status(200).send(article))
    .catch((err) => next(err));
};
