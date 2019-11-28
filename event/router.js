const { Router } = require("express");
const Event = require("./model");
const auth = require("../auth/middleware");
const jwt = require("jsonwebtoken");
const sequelize = require("sequelize");
const User = require("../user/model");
const Comment = require("../comment/model");
const Ticket = require("../ticket/model");
const { calculateRisk } = require("../ticket/router");
const moment = require("moment");

const router = new Router();

router.get("/event", (req, res, next) => {
  const limit = req.query.limit || 10;
  const offset = req.query.offset || 0;
  //   Event.findAndCountAll({ limit, offset })
  //     .then(result => res.send({ events: result.rows, total: result.count }))
  //     .catch(error => next(error))
  // })

  Event.findAndCountAll({ limit, offset })
    .then(events => {
      const filteredEvents = events.rows.filter(event => {
        // console.log("MOMENTTTTT", moment());   // moment() means now
        // console.log("MOMENTTTTT22222222", moment(new Date(event.endDate))); // =>this one is this date of the events end.s
        return moment(new Date(event.endDate)).isAfter(moment()); // if endDate of the event is not after now it's gonna be false.
      });

      // console.log(filteredEvents, events.count);

      res.send(filteredEvents);
    })
    .catch(next);
});

router.post("/event", auth, (req, res, next) => {
  let eventData = req.body;
  let token = req.headers.authorization.split(" ")[1]; //i have Bearer JWT_CODE..fadslfpaofaosnflkdsnf => JWT

  console.log("EVENTDATA", eventData);
  console.log("REQ.HEADERS.AUTH", req.headers.authorization);
  console.log("TOKEN", token);

  eventData.userId = jwt.decode(token).userId; // add userId as a property in eventData(name,desc,url,startD,endD + userId)

  console.log(jwt.decode(token)); // i need userId in my table

  Event.create(eventData)
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

router.get("/event/:id/tickets", async (req, res, next) => {
  const tickets = await Ticket.findAll({
    where: { eventId: req.params.id },
    include: [Event, User, Comment]
  });

  // console.log("TICKETS in the SELECTED EVENTTTT", tickets);
  const data = await Ticket.findAll({
    where: { eventId: req.params.id },
    attributes: [
      [sequelize.fn("sum", sequelize.col("price")), "totalPrice"], // seq. sum column
      [sequelize.fn("count", sequelize.col("id")), "totalTickets"] // seq. count column
    ],
    raw: true
  });
  console.log("DATAAAA", ...data); // it's inside an array..
  const { totalPrice, totalTickets } = data[0];
  console.log("type of totalPrice", typeof totalPrice);

  const averagePrice = Number(totalPrice) / Number(totalTickets);

  console.log("CHECK AVERAGE PRICEEE", averagePrice);

  var ticketsToSend = [];
  for (const ticket of tickets) {
    var totalTicketsOfUser = await Ticket.findAll({
      where: { userId: ticket.user.id } //
    });

    // console.log("TOTAL TICKETS OF USER", totalTicketsOfUser);
    totalTicketsOfUser = totalTicketsOfUser.length;
    console.log(" COMMENTS OF TICKETS", ticket.comments);
    const totalCommentsOfTicket = ticket.comments.length;
    const price = ticket.price;
    const createdAt = ticket.createdAt;

    const risk = calculateRisk({
      totalTicketsOfUser,
      totalCommentsOfTicket,
      averagePrice,
      price,
      createdAt
    });
    console.log("RISK>>>>>>>>", risk);

    ticketsToSend.push({
      user: ticket.user,
      price,
      risk,
      createdAt,
      comments: ticket.comments,
      name: ticket.name,
      event: ticket.event, //
      description: ticket.description,
      id: ticket.id
    });
  }
  res.send(ticketsToSend);
});

module.exports = router;
