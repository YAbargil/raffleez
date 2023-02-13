import * as dotenv from "dotenv";
dotenv.config();
import app from "./server.js";
import { connectDB } from "./connect.js";

const base_url = "localhost" || process.env.BASE_URL;
const port = 3003 || process.env.PORT;
const mongodb_url = "mongodb://localhost/project"; //|| process.env.DB_URI;

const start = async function () {
  await connectDB(mongodb_url);
  app.listen(port, base_url, async () => {
    console.log(`Server's listening on ${port}`);
  });
};

start();
