const { Router } = require("express");
const User = require("./model");
const bcrypt = require("bcrypt");
const auth = require("../auth/middleware");

const router = new Router();

router.get("/user", (req, res, next) => {
  User.findAll()
    .then(user => res.send(user))
    .catch(next);
});

router.post("/user", (req, res, next) => {
  const { name, password } = req.body;
  console.log({ REQ_BODDDDDDDDY: req.body });
  if (name === "" || password === "") {
    return res.status(400).send("Entry all inputs");
  }
  User.create({
    name,
    password: bcrypt.hashSync(password, 10)
  })
    .then(newUser => {
      console.log("NEW_USERRR", newUser);
      res.json(newUser);
    })
    .catch(next);
});

router.get("/user/:userId", (req, res, next) => {
  User.findByPk(req.params.userId)
    .then(selectedUser => res.send(selectedUser))
    .catch(next);
});

router.put("/user/:userId", auth, (req, res, next) => {
  User.findByPk(req.params.userId).then(user => {
    user.update(req.body).then(updatedUser => res.send(updatedUser));
  });
});

router.delete("/user/:userId", auth, (req, res, next) => {
  User.destroy({ where: { id: req.params.userId } })
    .then(deletedUser => res.send({ deletedUser }))
    .catch(next);
});

module.exports = router;
