const db = require("../db/connection.js");
const {
  rejectedPromise404,
  rejectedPatch,
} = require("../errors/rejected-promises.js");

exports.fetchArticlesById = async (article_id) => {
  const { rows } = await db.query(
    `SELECT articles.*, COUNT(comments.comment_id)::int AS comment_count
    FROM articles
    LEFT JOIN comments ON comments.article_id = articles.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id;`,
    [article_id]
  );
  const [article] = rows;
  if (!article) return rejectedPromise404("article");
  else return article;
};

exports.amendArticlesById = async (article_id, inc_votes = 0) => {
  const { rows } = await db.query(
    "UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;",
    [inc_votes, article_id]
  );
  const [updatedArticle] = rows;
  if (!updatedArticle) return rejectedPromise404("article");
  return updatedArticle;
};

exports.fetchAllArticles = async () => {
  const { rows } = await db.query(
    "SELECT article_id, title, topic, author, created_at, votes FROM articles ORDER BY created_at DESC;"
  );
  return rows;
};
