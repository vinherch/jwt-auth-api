const jwt = require("jsonwebtoken");

//Access JWT expires after 60s
const createAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.EXP_DURATION });
};

const verifyAccessToken = async (accessToken) => {
  return await jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
};

const createRefreshToken = (user) => {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
};

const verifyRefreshToken = async (refreshToken) => {
  return await jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
};

module.exports = {
  createAccessToken,
  createRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
