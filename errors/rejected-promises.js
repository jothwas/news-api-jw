exports.rejectedPromise404 = (field) => {
  return Promise.reject({
    status: 404,
    msg: `${field} not found`,
  });
};
