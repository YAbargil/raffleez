import { Raffle, Product } from "../models/rafflemodel.js";
import { body, validationResult } from "express-validator";

export const isRaffleExist = async (req, res, next) => {
  const raffleId = req.params.raffleId;
  const raffle = await Raffle.findOne({ raffleId });
  if (!raffle) {
    res.redirect("/");
    return;
  }
  res.raffle = raffle;
  next();
};

export const isProductExist = async (req, res, next) => {
  const { productId } = req.body;
  const product = await Product.findOne({ _id: productId });
  console.log(product);
  if (!product) {
    res.status(500).send({ msg: "No matching product" });
  } else {
    res.product = product;
    next();
  }
};

const raffleValidator = [
  body("name")
    .isLength({ min: 4 })
    .withMessage("name must be at least 4 chars long")
    .isLength({ max: 25 })
    .withMessage(" name must be less than 25 chars long")
    .exists()
    .withMessage("name is required"),
  body("quantity")
    .exists()
    .withMessage("Must enter a value for quantity")
    .isInt()
    .withMessage("Quantity must be integer number only"),
  // .custom((value) => {
  //   if (value < 1) {
  //     throw new Error("Quantity can't be less than 1.");
  //   }
  // }),
  body("productId").exists().withMessage("Must enter a value for productId"),
  // .custom((num) => {
  //   if (num < 1) {
  //     return Promise.reject("productId can't be less than 1.");
  //   }
  // }),
];

const entryValidator = [
  body("name")
    .isLength({ min: 2 })
    .withMessage("name must be at least 2 chars long")
    .isLength({ max: 16 })
    .withMessage("name must be less than 16 chars long")
    .exists()
    .withMessage("name is required"),
  body("email").isEmail().withMessage("email is invalid"),
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

export const isEmailExists = (req, res, next) => {
  const { email } = req.body;
  const entry = res.raffle.nominees.find((e) => e.email == email);
  if (entry !== undefined) {
    res.send({ msg: "Email already in use" });
  } else {
    next();
  }
};

export const entryHandler = [entryValidator, recordErrors];
export const raffleHandler = [raffleValidator, recordErrors];
