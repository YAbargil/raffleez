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
  const product = await Product.findOne({ productid: productId });
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
    .withMessage("name must be at least 2 chars long")
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
  body("productId")
    .exists()
    .withMessage("Must enter a value for productId")
    .isInt()
    .withMessage("productId must be integer number only"),
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
  body("email")
    .normalizeEmail()
    .isEmail()
    .withMessage("email is invalid")
    .custom((email) => {
      if (isEmailExists(email)) {
        return Promise.reject("Already entered the raffle");
      }
    }),
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

const isEmailExists = (email) => {
  const entry = res.raffle.nominees.find({ email: email });
  return entry !== undefined;
};

export const entryHandler = [entryValidator, recordErrors];
export const raffleHandler = [raffleValidator, recordErrors];
