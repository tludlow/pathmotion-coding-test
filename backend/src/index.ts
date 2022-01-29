import express from "express";

require("dotenv").config();
const app = express();

const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.status(200).send({ hi: "hello" });
});

// Start the express server on the port given within the .env file
app.listen(port, () => console.log(`server started on port ${port}`));
