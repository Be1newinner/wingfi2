import "dotenv/config";

import express from "express";
import { connectDB } from "./config/db";
import { AuthRouter } from "./routes/users.route";
import { setupSwagger } from "./config/swagger";
import { CartRouter } from "./routes/carts.route";
import { AddressRouter } from "./routes/address.route";
import { OrderRouter } from "./routes/orders.route";
import { ProductRouter } from "./routes/products.route";

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());

setupSwagger(app);

app.get("/", function (_: express.Request, res: express.Response) {
  res.send({ message: "Welcome to Wingfi Apis!" });
});

app.use("/products", ProductRouter);
app.use("/users", AuthRouter);
app.use("/cart", CartRouter);
app.use("/address", AddressRouter);
app.use("/orders", OrderRouter);

let server;

async function startServer() {
  try {
    await connectDB();
    server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

if (import.meta.url === new URL(import.meta.url, import.meta.url).href) {
  startServer();
}

export { app, startServer, server };
