const { Router } = require("express");
const Ticket = require("./model");
const Event = require("../event/model");
const User = require("../user/model");
const Comment = require("../comment/model");
const auth = require("../auth/middleware");
const sequelize = require("sequelize");
const router = new Router();

router.get("/ticket/:id", async (req, res, next) => {
  const tickets = await Ticket.findAll({
    where: { eventId: req.params.id },
    include: [Event, User, Comment]
  });
  const data = await Ticket.findAll({
    attributes: [
      [sequelize.fn("sum", sequelize.col("price")), "totalPrice"],
      [sequelize.fn("count", sequelize.col("id")), "totalTickets"]
    ],
    raw: true
  });
  const { totalPrice, totalTickets } = data[0];
  console.log("totalPrice", totalPrice);
  const averagePrice = Number(totalPrice) / Number(totalTickets);
  // console.log(averagePrice);
  // console.log(tickets);

  var ticketsToSend = [];
  for (const ticket of tickets) {
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
    console.log(ticket, "fsdfsdfsdfsdf");

    ticketsToSend.push({
      user,
      price,
      risk,
      data,
      createdAt,
      comments: ticket.comments,
      name: ticket.name
    });
  }
  res.send(ticketsToSend);
});

router.post("/ticket", auth, (req, res, next) => {
  //do we need to put auth????????
  Ticket.create(req.body)
    .then(newTicket => res.json(newTicket))
    .catch(next);
});

module.exports = router;

module.exports.calculateRisk = function calculateRisk({
  totalTicketsOfUser,
  averagePrice,
  price,
  createdAt,
  totalCommentsOfTicket
}) {
  console.log("totalTicketsOfUser", totalTicketsOfUser);
  console.log("averagePrice", averagePrice);
  console.log("price", price);
  console.log("totalCommentsOfTicket", totalCommentsOfTicket);
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
