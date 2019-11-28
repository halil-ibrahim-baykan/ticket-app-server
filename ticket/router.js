const { Router } = require("express");
const Ticket = require("./model");
const Event = require("../event/model");
const User = require("../user/model");
const Comment = require("../comment/model");
const auth = require("../auth/middleware");
const sequelize = require("sequelize");
const router = new Router();
const jwt = require("jsonwebtoken");

router.post("/ticket", auth, async (req, res, next) => {
  let eventData = req.body;
  let token = req.headers.authorization.split(" ")[1];

  eventData.userId = jwt.decode(token).userId;

  Ticket.create(eventData)
    .then(async newTicket => {
      const ticket = await Ticket.findByPk(newTicket.id, {
        include: [User, Event, Comment]
      });

      const data = await Ticket.findAll({
        where: { eventId: ticket.event.id },
        attributes: [
          [sequelize.fn("sum", sequelize.col("price")), "totalPrice"],
          [sequelize.fn("count", sequelize.col("id")), "totalTickets"]
        ],
        raw: true
      });
      const { totalPrice, totalTickets } = data[0];
      const averagePrice = Number(totalPrice) / Number(totalTickets);

      const user = ticket.user;
      var totalTicketsOfUser = await Ticket.findAll({
        where: { userId: user.id }
      });
      totalTicketsOfUser = totalTicketsOfUser.length;

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

      const ticketToSend = {
        user,
        price,
        risk,
        createdAt,
        comments: ticket.comments,
        name: ticket.name,
        event: ticket.event,
        description: ticket.description,
        id: ticket.id
      };

      res.send(ticketToSend);
    })
    .catch(next);
});

router.put("/ticket/:ticketId", auth, (req, res, next) => {
  Ticket.findByPk(req.params.ticketId)
    .then(ticket => {
      ticket.update(req.body).then(updatedTicket => res.send(updatedTicket));
    })
    .catch(next);
});

router.delete("/ticket/:ticketId", auth, (req, res, next) => {
  Ticket.destroy({ where: { id: req.params.ticketId } })
    .then(deletedTicket => res.send({ deletedTicket }))
    .catch(next);
});

router.get("/ticket/:id", async (req, res, next) => {
  const ticket = await Ticket.findByPk(req.params.id, {
    include: [User, Event, Comment]
  });

  const data = await Ticket.findAll({
    where: { eventId: ticket.event.id },
    attributes: [
      [sequelize.fn("sum", sequelize.col("price")), "totalPrice"],
      [sequelize.fn("count", sequelize.col("id")), "totalTickets"]
    ],
    raw: true
  });
  const { totalPrice, totalTickets } = data[0];
  const averagePrice = Number(totalPrice) / Number(totalTickets);

  var totalTicketsOfUser = await Ticket.findAll({
    where: { userId: ticket.user.id }
  });
  totalTicketsOfUser = totalTicketsOfUser.length;

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

  const ticketToSend = {
    user: ticket.user,
    price,
    risk,
    createdAt,
    comments: ticket.comments,
    name: ticket.name,
    event: ticket.event,
    description: ticket.description,
    id: ticket.id
  };

  res.send(ticketToSend);
});

module.exports = router;

const calculateRisk = ({
  totalTicketsOfUser,
  averagePrice,
  price,
  createdAt,
  totalCommentsOfTicket
}) => {
  var risk = 0;

  if (totalTicketsOfUser === 1) risk = risk + 10;

  if (price < averagePrice) {
    const percentage = ((averagePrice - price) / averagePrice) * 100;

    risk = risk + percentage;
  } else {
    const percentage = ((price - averagePrice) / averagePrice) * 100;
    const newPercentage = percentage < 10 ? percentage : 10;
    risk = risk - newPercentage;
  }
  const hour = new Date(createdAt).getHours();
  if (hour >= 9 && hour < 17) {
    risk = risk - 10;
  } else {
    risk = risk + 10;
  }

  if (totalCommentsOfTicket > 3) {
    risk = risk + 5;
  }

  if (risk < 5) risk = 5;
  if (risk > 95) risk = 95;

  return Math.round(risk);
};

module.exports.calculateRisk = calculateRisk;
