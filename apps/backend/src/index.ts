import express from "express";

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());

app.get("/", function (req: express.Request, res: express.Response) {
  res.send("Welcome to TypedHome!");
  return;
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
