const createTokenSecret = () => {
  return crypto.randomBytes(64).toString("HEX");
};

module.exports = createTokenSecret;
