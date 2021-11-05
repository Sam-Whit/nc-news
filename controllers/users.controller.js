const { fetchUserArr } = require("../models/users.model");

exports.getUserArr = (req, res, next) => {
  console.log("in the model");
  fetchUserArr()
    .then((users) => {
      console.log(users);
      res.status(200).send({ users });
    })
    .catch(next);
};
