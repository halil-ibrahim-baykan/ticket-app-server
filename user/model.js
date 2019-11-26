const Sequelize = require("sequelize");
const db = require("../db");
const Event = require("../event/model");
const Ticket = require("../ticket/model");
const Comment = require("../comment/model");

const User = db.define(
  "user",
  {
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    }
  },
  {
    timestamps: false,
    tableName: "users"
  }
);

Event.belongsTo(User);
User.hasMany(Event);

Ticket.belongsTo(User);
User.hasMany(Ticket);

Comment.belongsTo(User);
User.hasMany(Comment);

module.exports = User;
