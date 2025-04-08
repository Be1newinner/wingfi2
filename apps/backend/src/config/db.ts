import { connect, disconnect } from "mongoose";

export async function connectDB() {
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) throw new Error("MONGODB URI NOT PROVIDED!");

  try {
    await connect(MONGODB_URI, {
      dbName: "wingfi",
    });
    console.log("MONGODB IS CONNECTED!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}

// Optional: Handle graceful shutdown
process.on("SIGINT", async () => {
  await disconnect();
  console.log("MONGODB CONNECTION IS CLOSED!");
  process.exit(0);
});
