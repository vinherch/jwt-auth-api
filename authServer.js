const express = require("express");
const dotenv = require("dotenv").config();
const { createAccessToken, createRefreshToken, verifyRefreshToken } = require("./authHelper");

//Init express
const app = express();
const PORT = process.env.AUTH_SERVER_PORT;

//Body parser
app.use(express.json());

//Refresh Tokens
const refreshTokens = [];

//Routes
app.post("/login", (req, res) => {
  const user = req.body;
  //No user - return
  if (!user) return res.status(400).send();
  //Get access & refresh token
  const accessToken = createAccessToken(user);
  const refreshToken = createRefreshToken(user);
  //Add refresh token
  refreshTokens.push(refreshToken);
  res.json({ accessToken, refreshToken });
});

app.post("/token", (req, res) => {
  const refreshToken = req.body.token;
  if (!refreshToken) return res.status(401).send();
  if (!refreshTokens.includes(refreshToken)) return res.status(403).send();
  //Check for valid refresh token & create new access token
  try {
    const user = verifyRefreshToken(refreshToken);
    const accessToken = createAccessToken(user);
    res.json({ accessToken });
  } catch (error) {
    res.status(403).send();
  }
});

app.delete("/logout", (req, res) => {});

app.listen(PORT, () => {
  console.log(`Server listening at port: ${PORT}`);
});
