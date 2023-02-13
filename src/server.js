import express from "express";
import morgan from "morgan";
import { isUserExists, signUpHandler } from "../controllers/usercontroller.js";
import { isAuthorized } from "./auth.js";
import router from "./router.js";
import { createUser, loginUser } from "./user.js";
import userRouter from "./userroutes.js";
import cors from "cors";
const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.status(200).send({ msg: "Homepage" });
});
app.use("/raffle", router);

app.use("/myraffles", isAuthorized, userRouter);

app.post("/signup", signUpHandler, createUser, async (req, res) => {
  res.status(202).send(res.user);
});

app.post("/login", isUserExists, loginUser, async (req, res) => {
  res.status(202).send(res.user);
});

app.all("*", (req, res) => {
  res.status(404).send({ msg: "404 - Unknown Path" });
});
export default app;
