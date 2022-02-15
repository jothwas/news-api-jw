const {
  fetchArticlesById,
  amendArticlesById,
} = require("../models/articles-models");

exports.getArticlesById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticlesById(article_id)
    .then((article) => res.status(200).send(article))
    .catch((err) => next(err));
};

exports.patchArticlesById = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  amendArticlesById(article_id, inc_votes)
    .then((updatedArticle) => res.status(200).send(updatedArticle))
    .catch((err) => next(err));
};
