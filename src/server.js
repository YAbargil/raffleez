import express from "express";
import morgan from "morgan";
import router from "./router.js";
const app = express();

app.use(morgan("dev"));
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send({ msg: "Homepage" });
});
app.use("/raffle", router);

app.all("*", (req, res) => {
  res.status(404).send({ msg: "404 - Unknown Path" });
});
export default app;
