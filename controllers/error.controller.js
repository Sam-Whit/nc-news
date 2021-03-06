exports.invalidRequestType = (req, res, next) => {
  res.status(405).send({ msg: "Invalid method" });
};

exports.customError = (err, req, res, next) => {
  // console.log(err);
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.PSQLerror = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad request, invalid input" });
  }
  if (err.code === "23503") {
    res.status(400).send({ msg: "Bad request, invalid input" });
  }
  next(err);
};
