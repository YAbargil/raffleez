import { Router } from "express";
import {
  isRaffleExist,
  isProductExist,
  raffleHandler,
} from "../controllers/rafflecontroller.js";
import { notifyResults } from "./notifier.js";
import { Raffle } from "../models/rafflemodel.js";
import { User } from "../models/usermodel.js";

//myraffles/
const userRouter = Router();

userRouter.post("/create", isProductExist, raffleHandler, async (req, res) => {
  let params = req.body;
  let { name, quantity } = params;
  let username = res.username;
  let details = await new Raffle({
    product: res.product,
    name: name,
    quantity: quantity,
  });
  try {
    let raffle = await details.save();
    console.log(username);
    console.log(raffle.raffleId);
    await User.updateOne(
      { username: username },
      { $push: { raffles: raffle.raffleId.toString() } }
    );
    res.status(200).send(raffle);
  } catch (err) {
    if (err) {
      console.log(err);
      res.status(500).send("Couldn't save raffle.");
    }
  }
});

userRouter.get("/:raffleId", isRaffleExist, async (req, res) => {
  const raffle = res.raffle;
  res.status(200).send({ raffle });
});

const chooseWinners = function (numOfWinners, nomineesArr, winnersArr) {
  const isAlreadyChosen = raffle.nominees.find({ winner: true });
  if (isAlreadyChosen === undefined) {
    const randomSet = new Set();
    const length = nomineesArr.length - 1;
    while (randomSet.size < numOfWinners) {
      let randomNumber = Math.floor(Math.random() * length);
      randomSet.add(randomNumber);
    }
    randomSet.forEach((i) => {
      nomineesArr[i].winner = true;
      winnersArr.push(nomineesArr[i]);
    });
  }
  return nomineesArr;
};

userRouter.get("/:raffleId/end", isRaffleExist, async (req, res) => {
  let raffle = res.raffle;
  let winners = [];
  const nominees = chooseWinners(raffle.quantity, raffle.nominees, winners);
  raffle.nominees = nominees;
  raffle.active = false;
  try {
    raffle = await raffle.save();
    const winnersDetails = winners.map((w) => {
      return { email: w.email, name: w.name };
    });
    const restDetails = nominees
      .filter((n) => !winners.includes(n))
      .map((n) => ({
        email: n.email,
        name: n.name,
      }));
    await notifyResults(winnersDetails, raffle, "W");
    await notifyResults(restDetails, raffle, "L");
    res.status(200).send({ msg: "Emails sent!" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ msg: err.message });
  }
});

userRouter.get(
  "/:raffleId/participants/:index",
  isRaffleExist,
  async (req, res) => {
    const raffle = res.raffle;
    const lastNominee = raffle.nominees[raffle.nominees.length - 1];
    raffle.nominees.splice(req.params.index, 1, {
      name: lastNominee.name,
      email: lastNominee.email,
      ticket: req.params.index,
    });
    raffle.nominees.pop();
    try {
      await raffle.save();
      res.status(200).send({ msg: "Participant deleted" });
    } catch (error) {
      console.log("Error:", error);
      res.status(500).send({ msg: "Couldn't delete participant" });
    }
  }
);

userRouter.get("/", async (req, res) => {
  const username = res.username;
  console.log(username);
  const user = await User.findOne({ username: username });
  if (!user) {
    res.status(200).send({ raffles: [] });
  }
  let raffles = user.raffles;
  raffles = await Raffle.find({ raffleId: { $in: raffles } });
  res.status(200).send({ raffles });
});

export default userRouter;
