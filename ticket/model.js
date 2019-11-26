const Sequelize = require("sequelize");
const db = require("../db");
const Comment = require("../comment/model");

const Ticket = db.define("ticket", {
  name: Sequelize.STRING,
  price: Sequelize.DECIMAL,
  description: Sequelize.TEXT
});

Comment.belongsTo(Ticket);
Ticket.hasMany(Comment);

module.exports = Ticket;
