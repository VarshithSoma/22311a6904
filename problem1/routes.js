const express = require("express");
const router = express.Router();
const { fetchNumbersById } = require("./numberService");

const VALID_IDS = ["p", "f", "e", "r"];

router.get("/:numberid", async (req, res) => {
  const { numberid } = req.params;

  if (!VALID_IDS.includes(numberid)) {
    return res.status(400).json({ error: "Invalid numberid" });
  }

  try {
    const data = await fetchNumbersById(numberid);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message || "Internal Server Error" });
  }
});

module.exports = router;
