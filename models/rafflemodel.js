import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  productId: {
    type: String,
    require: true,
  },
  name: {
    type: String,
    require: true,
  },
  image: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
});

const nomineeSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  winner: {
    type: Boolean,
    default: false,
  },
  ticket: {
    type: Number,
    required: true,
  },
});

const raffleSchema = new mongoose.Schema({
  raffleId: {
    type: mongoose.Types.ObjectId,
    unique: true,
    default: function () {
      return new mongoose.Types.ObjectId();
    },
  },
  name: {
    type: String,
    required: true,
  },
  product: productSchema,
  nominees: [nomineeSchema],
  quantity: {
    type: Number,
    required: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
});

export const Product = mongoose.model("Product", productSchema);
export const Nominee = mongoose.model("Nominee", nomineeSchema);
export const Raffle = mongoose.model("Raffle", raffleSchema);
