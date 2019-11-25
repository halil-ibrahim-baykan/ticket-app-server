const Sequelize = require("sequelize");
const db = require("../db");

const Comment = db.define("comment", {
  name: Sequelize.STRING,
  comment: Sequelize.TEXT
});



module.exports = Comment;
