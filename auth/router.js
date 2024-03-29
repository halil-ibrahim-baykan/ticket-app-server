const { Router } = require("express");
const { toJWT } = require("./jwt");
const User = require("../user/model");
const bcrypt = require("bcrypt");
const auth = require("./middleware");

const router = new Router();
// for signup => I'm using inside the user router '/user' path
router.post("/login", (req, res) => {
  const { name, password } = req.body;
  if (!name || !password) {
    res.status(400).send({
      message: "Please supply a valid Name and password"
    });
  } else {
    User.findOne({
      where: {
        name: req.body.name
      }
    })
      .then(entity => {
        if (!entity) {
          res.status(400).send({
            message: "User with that name does not exist"
          });
        } else if (bcrypt.compareSync(req.body.password, entity.password)) {
          //magicc
          //compare sent password to entity which is in the table password..
          res.send({
            jwt: toJWT({ userId: entity.id, userName: entity.name }),
            userId: entity.id
            //if it's ok send it in the jwt code userId=entity.id userName=entity.name
          });
        } else {
          res.status(400).send({
            message: "Password was incorrect"
          });
        }
      })
      .catch(err => {
        console.error(err);
        res.status(500).send({
          message: "Something went wrong"
        });
      });
  }
});

router.get("/secret-endpoint", auth, (req, res) => {
  res.send({
    message: `Thanks for visiting the secret endpoint ${req.user.email}.`
  });
});

module.exports = router;
