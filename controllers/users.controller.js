const { fetchUserArr } = require("../models/users.model");

exports.getUserArr = (req, res, next) => {
  fetchUserArr()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(next);
};
