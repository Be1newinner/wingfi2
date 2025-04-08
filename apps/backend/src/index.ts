import "dotenv/config";
import "reflect-metadata";

import express from "express";
import { connectDB } from "./config/db";
import { AuthRouter } from "./routes/users.route";
import { setupSwagger } from "./config/swagger";
import { CartRouter } from "./routes/carts.route";
import { AddressRouter } from "./routes/address.route";
import { OrderRouter } from "./routes/orders.route";
import { ProductRouter } from "./routes/products.route";
import { errorHandler } from "./middlewares/error.middleware";
import { UploadRouter } from "./routes/upload.route";
import logger, { streamToElastic } from "./utils/logger";

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
setupSwagger(app);

app.use((req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;

    logger.info(
      {
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
        userAgent: req.headers["user-agent"],
        query: req.query,
        statusCode: res.statusCode,
        duration: `${duration}ms`,
        timestamp: new Date().toISOString(),
      },
      "HTTP Request Completed"
    );
  });

  next();
});

app.get("/", function (_: express.Request, res: express.Response) {
  logger.info("WINGFI SERVER HAS STARTED! for np");
  res.send({ message: "Welcome to Wingfi Apis!" });
});

app.use("/products", ProductRouter);
app.use("/users", AuthRouter);
app.use("/cart", CartRouter);
app.use("/address", AddressRouter);
app.use("/orders", OrderRouter);
app.use("/uploads", UploadRouter);

app.use(errorHandler);

let server;

async function startServer() {
  try {
    await connectDB();
    server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error(error);
    streamToElastic._flush((error) => {
      console.log(error);
    });
    process.exit(1);
  }
}

if (import.meta.url === new URL(import.meta.url, import.meta.url).href) {
  startServer();
}

export { app, startServer, server };
