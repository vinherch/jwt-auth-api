const express = require("express");
const dotenv = require("dotenv").config();
const { verifyAccessToken } = require("./authHelper");

//Init express
const app = express();
const PORT = process.env.SERVER_PORT;

//Sample Data
const data = [
  { user: "User 1", content: ["one", "two", "three"] },
  { user: "User 2", content: [10, 20, 30] },
];

//Routes
app.get("/protected", authenticate, (req, res) => {
  const { user } = req.user;
  const userdata = data.filter((e) => e.user === user);
  res.status(200).json({ ...userdata[0].content });
});

function authenticate(req, res, next) {
  //Extract Token from Header
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);
  try {
    //Check Access Token
    const user = verifyAccessToken(token);
    //Append user to request
    req.user = user;
  } catch (error) {
    return res.status(403).send(error);
  }
  next();
}

app.listen(PORT, () => {
  console.log(`Server listening at port: ${PORT}`);
});
