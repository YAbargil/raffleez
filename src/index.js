import * as dotenv from "dotenv";
dotenv.config();
import app from "./server.js";
import { connectDB } from "./connect.js";

const base_url = process.env.BASE_URL || "localhost";
const port = process.env.PORT || 3003;
const mongodb_url = process.env.DB_URI || "mongodb://localhost/project";

const start = async function () {
  await connectDB(mongodb_url);
  app.listen(port, base_url, async () => {
    console.log(`Server's listening on ${port}`);
  });
};

start();
