const { checkUserExists, checkTopicExists } = require("../db/helpers/utils");
const {
  fetchArticlesById,
  amendArticlesById,
  fetchAllArticles,
  insertArticle,
  removeArticleById,
} = require("../models/articles-models");

exports.getArticlesById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticlesById(article_id)
    .then((article) => res.status(200).send({ article }))
    .catch((err) => next(err));
};

exports.patchArticlesById = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  amendArticlesById(article_id, inc_votes)
    .then((updatedArticle) => res.status(200).send({ article: updatedArticle }))
    .catch((err) => next(err));
};

exports.getAllArticles = (req, res, next) => {
  const { sort_by, order, topic, page, limit } = req.query;
  fetchAllArticles(sort_by, order, topic, page, limit)
    .then(({ articles, total_count }) => {
      res.status(200).send({ articles, total_count });
    })
    .catch((err) => next(err));
};

exports.postArticle = (req, res, next) => {
  const { author, title, body, topic } = req.body;
  Promise.all([checkUserExists(author), checkTopicExists(topic)])
    .then(() => insertArticle(author, title, body, topic))
    .then((article) => {
      res.status(201).send({ article });
    })
    .catch((err) => next(err));
};

exports.deleteArticleById = (req, res, next) => {
  const { article_id } = req.params;
  removeArticleById(article_id)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => next(err));
};
