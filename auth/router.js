const { Router } = require("express");
const { toJWT } = require("./jwt");
const User = require("../user/model");
const bcrypt = require("bcrypt");
const auth = require("./middleware");

const router = new Router();
// checking a user account
router.post("/login", (req, res) => {
  const { name, password } = req.body;
  // const userName = req.body.userName;
  // const password = req.body.password;

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
          //our solution is here
          // 3. if the password is correct, return a JWT with the userId of the user (user.id)
          res.send({
            jwt: toJWT({ id: entity.id })
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
