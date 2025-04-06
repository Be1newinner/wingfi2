import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { connectDB } from "./config/db.ts";
import productRouter from "./routes/products.route.ts";
import { AuthRouter } from "./routes/users.route.ts";

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());

app.get("/", function (_: express.Request, res: express.Response) {
  res.send("Welcome to Wingfi Apis!");
});

app.use("/products", productRouter);
app.use("/users", AuthRouter);

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((e) => {
    console.error("Failed to connect to MongoDB:", e);
  });
