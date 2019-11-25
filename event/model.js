const Sequelize = require("sequelize");
const db = require("../db");
const Ticket = require("../ticket/model");

const Event = db.define("event", {
  name: Sequelize.STRING,
  description: Sequelize.TEXT,
  url: Sequelize.STRING,
  startDate: Sequelize.DATE,
  endDate: Sequelize.DATE
});

Ticket.belongsTo(Event);
Event.hasMany(Ticket);

module.exports = Event;




