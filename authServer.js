const express = require("express");
const dotenv = require("dotenv").config();
const { createAccessToken, createRefreshToken, verifyRefreshToken } = require("./authHelper");

//Init express
const app = express();
const PORT = process.env.AUTH_SERVER_PORT;

//Body parser
app.use(express.json());

//Refresh Tokens
let refreshTokens = [];

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
  if (refreshTokens.includes(refreshToken)) {
    try {
      const { user } = verifyRefreshToken(refreshToken);
      const accessToken = createAccessToken({ user });
      return res.json({ accessToken });
    } catch (error) {
      return res.status(403).send();
    }
  }
  return res.sendStatus(403);
});

app.delete("/logout", (req, res) => {
  if (!req.body.token) return res.sendStatus(400);
  refreshTokens = refreshTokens.filter((e) => e !== req.body.token);
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Server listening at port: ${PORT}`);
});
