import mongoose from "mongoose";
mongoose.set("strictQuery", true);
export const connectDB = (url) => {
  mongoose
    .connect(url)
    .then(console.log("Connected to the DB"))
    .catch((err) => console.log(err, "Couldn't connect to the DB"));
};

export default mongoose;
