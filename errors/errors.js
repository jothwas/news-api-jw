exports.customErrors = (err, req, res, next) => {
  const { status, msg } = err;
  if (status && msg) res.status(status).send({ msg: msg });
  else next(err);
};

exports.psqlErrorCodes = (err, req, res, next) => {
  const { code } = err;
  if (code === "22P02")
    return res.status(400).send({ msg: "Bad request - invalid input" });
  if (code === "23502")
    return res.status(400).send({ msg: "Bad request - missing information" });
  if (code === "23505")
    return res
      .status(400)
      .send({ msg: "Bad request - information already exists" });
  else next(err);
};

exports.serverErrors = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal Server Error" });
};

exports.error404 = (req, res) => {
  return res.status(404).send({ msg: "Path not found" });
};
