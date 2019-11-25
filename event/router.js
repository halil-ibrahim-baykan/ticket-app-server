const { Router } = require("express");
const Event = require("./model");
// const auth = require("../auth/middleware");

const router = new Router();

router.get("/event", (req, res, next) => {
  Event.findAll()
    .then(events => res.send(events))
    .catch(next);
});

router.post("/event", (req, res, next) => {
  //do we need to put auth????????
  Event.create(req.body)
    .then(newEvent => res.json(newEvent))
    .catch(next);
});

module.exports = router;
