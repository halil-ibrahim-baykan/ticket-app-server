const { Router } = require("express");
const Image = require("./model");
// const auth = require("../auth/middleware");

const router = new Router();

router.get("/event", (req, res, next) => {
  Image.findAll()
    .then(images => res.send(images))
    .catch(err => next(err));
});

router.post("/event", (req, res, next) => { //do we need to put auth????????
  Image.create(req.body)
    .then(newImage => res.json(newImage))
    .catch(err => next(err));
});

module.exports = router;
