const db = require("../db/connection.js");
const {
  rejectedPromise404,
  rejectedPatch,
  rejectedPromise400,
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

exports.fetchAllArticles = async (
  sort_by = "created_at",
  order = "desc",
  topic
) => {
  const validSortBys = [
    "article_id",
    "title",
    "topic",
    "author",
    "body",
    "created_at",
    "votes",
    "comment_count",
  ];
  const validOrder = ["asc", "desc"];

  if (!validSortBys.includes(sort_by) || !validOrder.includes(order))
    return rejectedPromise400("Bad request: invalid query input");

  let queryStr = `
    SELECT a.article_id, a.title, a.topic, a.author, a.created_at, 
    a.votes, COUNT(c.comment_id)::INT AS comment_count 
    FROM articles AS a
    LEFT JOIN comments AS c ON c.article_id = a.article_id`;

  const topicValues = [];

  if (topic) {
    let { rows: acceptedTopics } = await db.query(`SELECT slug FROM topics;`);
    acceptedTopics = acceptedTopics.map((topic) => topic.slug);
    if (!acceptedTopics.includes(topic))
      return rejectedPromise400("Bad request: invalid query input");

    queryStr += ` WHERE a.topic = $1`;
    topicValues.push(topic);
  }
  queryStr += ` GROUP BY a.article_id
    ORDER BY ${sort_by} ${order};`;

  const { rows } = await db.query(queryStr, topicValues);
  return rows;
};
