const db = require("../db/connection.js");

exports.fetchTopics = async () => {
  const { rows } = await db.query("SELECT * FROM topics;");
  return rows;
};

exports.fetchArticlesById = async (article_id) => {
  let { rows } = await db.query(
    "SELECT * FROM articles WHERE article_id = $1;",
    [article_id]
  );
  const article = rows[0];
  if (!article)
    return Promise.reject({
      status: 404,
      msg: "Not found, please check the article_id used and try again.",
    });
  else return article;
};
