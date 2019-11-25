const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./db");
const User = require("./user/model");
const Ticket = require("./ticket/model");
const Event = require("./event/model");
const Comment = require("./comment/model");
// const imageRouter = require("./image/router");
// const jwtRouter = require("./auth/router");
// const userRouter = require("./user/router");

const app = express();

app.use(cors());
app.use(bodyParser.json());
// app.use(jwtRouter);
// app.use(imageRouter);
// app.use(userRouter);

const port = process.env.PORT || 4000;

app.listen(port, () => console.log("Server is runnning on port:" + port));
