const { Router } = require("express");
const Comment = require("./model");
const auth = require("../auth/middleware");

const router = new Router();

router.get("/comment", (req, res, next) => {
  Comment.findAll()
    .then(comments => res.send(comments))
    .catch(err => next(err));
});

router.post("/comment", auth, (req, res, next) => {
  Comment.create(req.body)
    .then(newComment => res.json(newComment))
    .catch(err => next(err));
});

module.exports = router;
