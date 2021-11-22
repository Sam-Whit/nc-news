const { fetchUserArr, fetchUser } = require("../models/users.model");

exports.getUserArr = (req, res, next) => {
  fetchUserArr()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(next);
};

exports.getUser = (req, res, next) => {
  const { username } = req.params;

  fetchUser(username)
    .then((user) => {
      res.status(200).send(user);
    })
    .catch(next);
};
