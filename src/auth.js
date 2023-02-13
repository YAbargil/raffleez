import jwt from "jsonwebtoken";

//all data
export const createToken = (user) => {
  const token = jwt.sign(
    {
      username: user.username,
    },
    process.env.SECRET
  );
  return token;
};

export const isAuthorized = (req, res, next) => {
  const bearer = req.headers["authorization"] || null;
  if (!bearer) {
    res.status(401).send({ msg: "Unauthorized , no bearer" });
    return;
  }
  var [, token] = bearer.split(" ");
  if (!token) {
    res.status(401).send({ msg: "Unauthorized , no token" });
    return;
  }
  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err) {
      res.status(401).send({ msg: "Unauthorized , mismatching token" });
    } else {
      res.username = decoded.username;
      next();
    }
  });
};
