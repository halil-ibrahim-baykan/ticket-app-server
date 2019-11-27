const { Router } = require("express");
const Event = require("./model");
const auth = require("../auth/middleware");
// const sequelize = require("sequelize");
// const User = require("../user/model");
// const Comment = require("../comment/model");
// const Ticket = require("../ticket/model");
// const { calculateRisk } = require("../ticket/router");

const router = new Router();

router.get("/event", (req, res, next) => {
  Event.findAll()
    .then(events => res.send(events))
    .catch(next);
});

router.post("/event", auth, (req, res, next) => {
  Event.create(req.body)
    .then(newEvent => res.json(newEvent))
    .catch(next);
});

router.get("/event/:eventId", (req, res, next) => {
  Event.findByPk(req.params.eventId)
    .then(selectedEvent => res.send(selectedEvent))
    .catch(next);
});

router.put("/event/:eventId", (req, res, next) => {
  Event.findByPk(req.params.eventId).then(event => {
    event.update(req.body).then(updatedEvent => res.send(updatedEvent));
  });
});

router.delete("/event/:eventId", (req, res, next) => {
  Event.destroy({ where: { id: req.params.eventId } })
    .then(deletedEvent => res.send({ deletedEvent }))
    .catch(next);
});


// router.get("/event/:id/tickets", async (req, res, next) => {
//   const tickets = await Ticket.findAll({
//     where: { eventId: req.params.id },
//     include: [Event, User, Comment]
//   });
//   const data = await Ticket.findAll({
//     attributes: [
//       [sequelize.fn("sum", sequelize.col("price")), "totalPrice"],
//       [sequelize.fn("count", sequelize.col("id")), "totalTickets"]
//     ],
//     raw: true
//   });
//   const { totalPrice, totalTickets } = data[0];
//   console.log("totalPrice", totalPrice);
//   const averagePrice = Number(totalPrice) / Number(totalTickets);
//   // console.log(averagePrice);
//   // console.log(tickets);

//   var ticketsToSend = [];
//   for (const ticket of tickets) {
//     const user = ticket.user;
//     var totalTicketsOfUser = await Ticket.findAll({
//       where: { userId: user.id }
//     });
//     totalTicketsOfUser = totalTicketsOfUser.length;

//     const totalCommentsOfTicket = ticket.comments.length;
//     const price = ticket.price;
//     const createdAt = ticket.createdAt;

//     const risk = calculateRisk({
//       totalTicketsOfUser,
//       totalCommentsOfTicket,
//       averagePrice,
//       price,
//       createdAt
//     });
//     console.log(risk);

//     ticketsToSend.push({
//       user,
//       price,
//       risk,
//       createdAt,
//       comments: ticket.comments,
//       name: ticket.name,
//       event: ticket.event
//     });
//   }
//   res.send(ticketsToSend);
// });

module.exports = router;
