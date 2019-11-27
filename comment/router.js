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

router.get("/comment/:commentId", (req, res, next) => {
  Comment.findByPk(req.params.commentId)
    .then(selectedComment => res.send(selectedComment))
    .catch(next);
});

router.put("/comment/:commentId", auth, (req, res, next) => {
  Comment.findByPk(req.params.commentId)
    .then(comment => {
      comment.update(req.body).then(updatedComment => res.send(updatedComment));
    })
    .catch(next);
});

router.delete("/comment/:commentId", auth, (req, res, next) => {
  Comment.destroy({ where: { id: req.params.commentId } })
    .then(deletedComment => res.send({ deletedComment }))
    .catch(next);
});

module.exports = router;
