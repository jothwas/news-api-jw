exports.error404 = (req, res) => {
  return res
    .status(404)
    .send({ msg: "Invalid path, please check your url and try again." });
};
