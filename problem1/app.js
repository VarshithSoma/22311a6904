const express = require("express");
const routes = require("./routes");
const PORT = 3000;
require("dotenv").config();

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.use("/numbers", routes);

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
