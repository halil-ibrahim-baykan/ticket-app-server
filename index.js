const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

// const imageRouter = require("./image/router");
const jwtRouter = require("./auth/router");
const userRouter = require("./user/router");
const eventRouter = require("./event/router");
const ticketRouter = require("./ticket/router");
const commentRouter = require("./comment/router");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(jwtRouter);
app.use(eventRouter);
app.use(ticketRouter);
app.use(commentRouter);
app.use(userRouter);

const port = process.env.PORT || 4000;

app.listen(port, () => console.log("Server is runnning on port:" + port));
