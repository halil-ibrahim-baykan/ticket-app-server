const { Router } = require("express");
const Comment = require("./model");
const User = require("../user/model");
const auth = require("../auth/middleware");
const jwt = require("jsonwebtoken");

const router = new Router();

router.get("/comment/:ticketId", (req, res, next) => {
  Comment.findAll({ where: { ticketId: req.params.ticketId }, include: [User] })
    .then(comments => {
      return res.send(comments);
    })
    .catch(err => next(err));
});

router.post("/comment", auth, (req, res, next) => {
  let eventData = req.body;
  let token = req.headers.authorization.split(" ")[1];

  eventData.userId = jwt.decode(token).userId;

  Comment.create(eventData)
    .then(newComment => {
      Comment.findByPk(newComment.id, { include: [User] }).then(comment => {
        res.json(comment);
      });
    })
    .catch(err => next(err));
});

// router.get("/comment/:commentId", (req, res, next) => {
//   Comment.findByPk(req.params.commentId)
//     .then(selectedComment => res.send(selectedComment))
//     .catch(next);
// });

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
