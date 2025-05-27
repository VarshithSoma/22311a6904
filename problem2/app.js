const express = require("express");
const app = express();
const PORT = 8000;
app.get("/", (req, res) => {
  res.send("hello world");
});
app.get("/numbers", async (req, res) => {});

app.listen(PORT, () => {
  console.log("http://localhost:8000/");
});
