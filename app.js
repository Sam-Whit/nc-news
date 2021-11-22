const express = require("express");
const { PSQLerror, customError } = require("./controllers/error.controller");
const apiRouter = require("./routers/api.router");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(cors());

app.use("/api", apiRouter);

app.all("/*", (req, res, next) => {
  res.status(404).send({ msg: "Not found" });
});

app.use(customError);

app.use(PSQLerror);

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Internal server error" });
});

module.exports = app;
