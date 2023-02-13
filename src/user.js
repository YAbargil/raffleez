import { User } from "../models/usermodel.js";
import * as bcrypt from "bcrypt";
import { createToken } from "./auth.js";

const comparePasswords = async (pw, hashedPw) => bcrypt.compare(pw, hashedPw);

export const createUser = async (req, res, next) => {
  const { username, password } = req.body;
  const salt = await bcrypt.genSalt(8);
  const hashedPass = await bcrypt.hash(password, salt);
  let temp = new User({ username: username, password: hashedPass });
  temp.save((err, info) => {
    if (err) {
      res.status(400).send({ msg: "Couldn't sign up user." });
    } else {
      const token = createToken(username);
      res.user = { username: username, token: token };
      next();
    }
  });
};

export const loginUser = async (req, res, next) => {
  const user = res.user;
  if (!comparePasswords(user.password, req.body.password)) {
    res.status(400).send({ msg: "Unmatched passwords." });
    return;
  }
  const token = createToken(user);
  res.user = { username: user.username, token: token };
  next();
};
