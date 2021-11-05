const express = require("express");
const { deleteComment } = require("../controllers/comments.controller");
const comments = require("../db/data/test-data/comments");

const commentsRouter = express.Router();

commentsRouter.route("/:comment_id").delete(deleteComment);

module.exports = commentsRouter;
