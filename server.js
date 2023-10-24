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
  const userdata = data.filter((e) => e.user === req.user);
  res.status(200).json({ ...userdata.content });
});

async function authenticate(req, res, next) {
  //Extract Token from Header
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  //Check Access Token
  try {
    const user = await verifyAccessToken(token);
    //Append user to request
    console.log(user);
    //req.user = user;
  } catch (error) {
    res.status(403).send();
  }
  next();
}

app.listen(PORT, () => {
  console.log(`Server listening at port: ${PORT}`);
});
