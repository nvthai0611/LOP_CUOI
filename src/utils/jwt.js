
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
module.exports = {
  createAccessToken: async (data) => {
    return jwt.sign(data, JWT_SECRET, { expiresIn: "1h" });
  },

  verifyToken: async (token) => {
    return jwt.verify(token, JWT_SECRET);
  },

  createRefreshToken: async (data = "") => {
    return jwt.sign(
      {
        // data,
        data: Math.random() + new Date().getTime(),
      },
      JWT_SECRET,
      { expiresIn: "1d" }
    );
  },
};
