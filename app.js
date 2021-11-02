const express = require("express");
const apiRouter = require("./routers/api.router");
const app = express();

app.use(express.json());

app.use("/api", apiRouter);

app.all("/*", (req, res, next) => {
  res.status(404).send({ msg: "internal server error" });
});

module.exports = app;
