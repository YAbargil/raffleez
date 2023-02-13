import { Raffle, Product } from "../models/rafflemodel.js";
import fetch from "node-fetch";

let products = {};

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
