exports.rejectedPromise404 = (field) => {
  return Promise.reject({
    status: 404,
    msg: `${field} not found`,
  });
};
exports.rejectedPromise400 = (msg) => {
  return Promise.reject({
    status: 400,
    msg,
  });
};
