import { User } from "../models/usermodel.js";
import { body, validationResult } from "express-validator";

const signUpValidator = [
  body("username")
    .exists()
    .withMessage("username is required")
    .isLength({ min: 2 })
    .withMessage("username must be at least 2 chars long")
    .isLength({ max: 16 })
    .withMessage("username must be less than 16 chars long")
    .exists()
    .withMessage("username is required")
    .custom(async (username) => {
      const user = await User.findOne({ username: username });
      if (user) {
        return Promise.reject("User already exists");
      }
    }),
  body("password")
    .exists()
    .withMessage("password is required")
    .isLength({ min: 5 })
    .withMessage("password must be at least 5 chars long")
    .isLength({ max: 16 })
    .withMessage("password must be at max 16 chars long"),
];

const recordErrors = async (req, res, next) => {
  const errors = validationResult(req).array();

  if (errors.length > 0) {
    res.status(400).json({ errors: errors });
  } else {
    //you may enter the raffle
    next();
  }
};

export const isUserExists = async (req, res, next) => {
  const { username } = req.body;
  if (username === undefined) {
    res.status(400).send({ msg: "No username input" });
    return;
  }
  const user = await User.findOne({ username: username });
  if (!user) {
    res.status(400).send({ msg: "No such username exists" });
    return;
  }
  res.user = user;
  next();
};

export const signUpHandler = [signUpValidator, recordErrors];
