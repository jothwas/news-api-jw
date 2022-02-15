exports.rejectedPromise404 = () => {
  return Promise.reject({
    status: 404,
    msg: "Not found, please check the url and try again.",
  });
};
