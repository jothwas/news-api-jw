const db = require("../db/connection.js");
const { topicData } = require("../db/data/test-data/index.js");
const {
  rejectedPromise404,
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
  topic,
  page = 1,
  limit = 10
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

  const offset = (page - 1) * limit;

  let total_count = 0;

  if (
    !validSortBys.includes(sort_by) ||
    !validOrder.includes(order) ||
    isNaN(page) ||
    isNaN(limit)
  )
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
    queryStr += ` GROUP BY a.article_id
    ORDER BY ${sort_by} ${order}`;
    const topicResponse = await db.query(queryStr, topicValues);
    total_count += topicResponse.rows.length;
    queryStr += ` LIMIT $2 OFFSET $3;`;
  } else {
    queryStr += ` GROUP BY a.article_id
    ORDER BY ${sort_by} ${order}`;
    const nonTopicResponse = await db.query(queryStr);
    total_count += nonTopicResponse.rows.length;
    queryStr += ` LIMIT $1 OFFSET $2;`;
  }

  if (topic) {
    const [topicValue] = topicValues;
    const { rows: articles } = await db.query(queryStr, [
      topicValue,
      limit,
      offset,
    ]);
    return { articles, total_count };
  } else {
    const { rows: articles } = await db.query(queryStr, [limit, offset]);
    return { articles, total_count };
  }
};

exports.insertArticle = async (author, title, body, topic) => {
  if (
    (title && typeof title !== "string") ||
    (body && typeof body !== "string")
  )
    return rejectedPromise400(
      "Bad request - invalid information in POST request"
    );
  const { rows } = await db.query(
    `
  INSERT INTO articles
  (author, title, body, topic)
VALUES
  ($1, $2, $3, $4)
RETURNING *;`,
    [author, title, body, topic]
  );
  const [insertedArticle] = rows;
  insertedArticle.comment_count = 0;
  return insertedArticle;
};

exports.removeArticleById = async (article_id) => {
  await db.query(
    `ALTER TABLE comments
      DROP CONSTRAINT comments_article_id_fkey,
      ADD CONSTRAINT comments_article_id_fkey
        FOREIGN KEY (article_id) REFERENCES articles(article_id)
        ON DELETE CASCADE;`
  );
  const { rows } = await db.query(
    `DELETE FROM articles 
  WHERE article_id = $1
  RETURNING *;`,
    [article_id]
  );
  if (!rows.length) return rejectedPromise404("article");
};
