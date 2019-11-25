const { Router } = require("express");
const Ticket = require("./model");
// const auth = require("../auth/middleware");

const router = new Router();

router.get("/event", (req, res, next) => {
  Ticket.findAll()
    .then(tickets => res.send(tickets))
    .catch(next);
});

router.post("/event", (req, res, next) => { //do we need to put auth????????
  Ticket.create(req.body)
    .then(newTicket => res.json(newTicket))
    .catch(next);
});

module.exports = router;
