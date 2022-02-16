const { rejectedPromise404 } = require("../../errors/rejected-promises.js");
const db = require("../connection.js");

exports.convertTimestampToDate = ({ created_at, ...otherProperties }) => {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};

exports.createRef = (arr, key, value) => {
  return arr.reduce((ref, element) => {
    ref[element[key]] = element[value];
    return ref;
  }, {});
};

exports.formatComments = (comments, idLookup) => {
  return comments.map(({ created_by, belongs_to, ...restOfComment }) => {
    const article_id = idLookup[belongs_to];
    return {
      article_id,
      author: created_by,
      ...this.convertTimestampToDate(restOfComment),
    };
  });
};

exports.checkArticleExists = (article_id) => {
  return db
    .query("SELECT article_id FROM articles WHERE article_id = $1", [
      article_id,
    ])
    .then(({ rows }) => {
      if (!rows.length) return rejectedPromise404("article");
    });
};
