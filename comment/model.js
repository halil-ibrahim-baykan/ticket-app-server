const Sequelize = require("sequelize");
const db = require("../db");

const Comment = db.define("comment", {
  comment: Sequelize.TEXT
});



module.exports = Comment;
