import { Router } from "express";
import { Raffle, Nominee, Product } from "../models/rafflemodel.js";
import {
  isProductExist,
  isRaffleExist,
  entryHandler,
  raffleHandler,
} from "../controllers/rafflecontroller.js";
import { notifyResults } from "./notifier.js";
//import fetch from "node-fetch";

//raffle
const router = Router();

// router.get("/saveproducts", async (req, res) => {
//   const rawProducts = await fetch("https://dummyjson.com/products");
//   const products = await rawProducts.json();
//   products.products.forEach(async (p) => {
//     console.log(p);
//     let temp = new Product({
//       productid: p.id,
//       name: p.title,
//       image: p.images[0],
//       description: p.description,
//     });
//     try {
//       await temp.save();
//     } catch (eror) {
//       console.log(error);
//     }
//   });
// });

// router.get("/:raffleId/show", isRaffleExist, async (req, res) => {
//   const raffle = res.raffle;
//   res.status(200).send({ raffle });
// });

// router.post("/create", isProductExist, raffleHandler, async (req, res) => {
//   let params = req.body;
//   let { name, quantity } = params;
//   let details = await new Raffle({
//     product: res.product,
//     name: name,
//     quantity: quantity,
//   });
//   try {
//     let raffle = await details.save();
//     res.status(200).send(raffle);
//   } catch (err) {
//     if (err) {
//       console.log(err);
//       res.status(500).send("Couldn't save raffle.");
//     }
//   }
// });

router.get("/products", async (req, res) => {
  const products = await Product.find({});
  res.status(200).send({ products });
});
router.post(
  "/:raffleId/enter",
  isRaffleExist,
  entryHandler,
  async (req, res) => {
    let raffle = res.raffle;
    const { name, email } = req.body;
    try {
      let tickerNumber = raffle.nominees.length;
      console.log(raffle.nominees);
      raffle.nominees.push(
        new Nominee({ name: name, email: email, ticket: tickerNumber })
      );
      raffle = await raffle.save();
      res.status(202).send({ raffle, msg: "We got your entry, Good luck!" });
    } catch (err) {
      console.log(err);
      res.status(500).send({ msg: "Couldn't save nominee in DB." });
    }
  }
);

// const chooseWinners = function (numOfWinners, nomineesArr, winnersArr) {
//   const isAlreadyChosen = raffle.nominees.find({ winner: true });
//   if (isAlreadyChosen === undefined) {
//     const randomSet = new Set();
//     const length = nomineesArr.length - 1;
//     while (randomSet.size < numOfWinners) {
//       let randomNumber = Math.floor(Math.random() * length);
//       randomSet.add(randomNumber);
//     }
//     randomSet.forEach((i) => {
//       nomineesArr[i].winner = true;
//       winnersArr.push(nomineesArr[i]);
//     });
//   }
//   return nomineesArr;
// };

// router.get("/:raffleId/end", isRaffleExist, async (req, res) => {
//   let raffle = res.raffle;
//   let winners = [];
//   const nominees = chooseWinners(raffle.quantity, raffle.nominees, winners);
//   raffle.nominees = nominees;
//   try {
//     raffle = await raffle.save();
//     const winnersDetails = winners.map((w) => {
//       return { email: w.email, name: w.name };
//     });
//     const restDetails = nominees
//       .filter((n) => !winners.includes(n))
//       .map((n) => ({
//         email: n.email,
//         name: n.name,
//       }));
//     await notifyResults(winnersDetails, raffle, "W");
//     await notifyResults(restDetails, raffle, "L");
//     res.status(200).send({ msg: "Emails sent!" });
//   } catch (err) {
//     console.log(err);
//     res.status(500).send({ msg: err.message });
//   }
// });

export default router;
