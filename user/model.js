const Sequelize = require("sequelize");
const db = require("../db");
const Event = require("../event/model");

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

module.exports = User;
