import jwt from "jsonwebtoken";

export const verifyAccessToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json("You are not authenticated");
  }

  const token = authHeader.split(" ")[1];

  return jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json("Token is not valid");
    }
    req.user = user;
    return next();
  });
};
