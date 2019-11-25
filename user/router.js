const { Router } = require("express");
const User = require("./model");
const bcrypt = require("bcrypt");

const router = new Router();

router.get("/user", (req, res, next) => {
  User.findAll()
    .then(user => res.send(user))
    .catch(next);
});

router.post("/user", (req, res, next) => {
  const { name, password } = req.body;
  if (name === "" || password === "") {
    return res.status(400).send("Entry all inputs");
  }
  console.log({ USER_NAME: name, PASSWORD: password });
  User.create({
    name,
    password: bcrypt.hashSync(password, 10)
  })
    .then(newUser => res.json(newUser))
    .catch(next);
});

module.exports = router;
