const express = require("express");
const axios = require("axios");

const app = express();
const PORT = 3000;

const BASE_URL = "http://localhost:4000";
const TOKEN = process.env.BEARER_TOKEN;

const getStockPrices = async (symbol, duration = 60) => {
  try {
    const url = `${BASE_URL}/stocks/${symbol}?minutes=${duration}`;
    const res = await axios.get(url, {
      headers: {
        Authorization: TOKEN,
      },
    });
    return res.data;
  } catch (err) {
    console.error(`Fetch error for ${symbol}:`, err.message);
    throw err;
  }
};

app.get("/stocks/:symbol", async (req, res) => {
  const { symbol } = req.params;
  const duration = req.query.minutes || 60;

  if (!symbol) return res.status(400).json({ error: "Stock symbol required" });

  try {
    const data = await getStockPrices(symbol, duration);
    const prices = data.priceHistory.map((p) => p.price);
    const avg = prices.reduce((a, b) => a + b, 0) / prices.length;

    res.json({
      averagePrice: avg,
      priceHistory: data.priceHistory,
    });
  } catch {
    res.status(500).json({ error: "Unable to fetch stock data" });
  }
});

app.get("/stockcorrelation", async (req, res) => {
  const { ticker1, ticker2, minutes = 60 } = req.query;

  if (!ticker1 || !ticker2)
    return res
      .status(400)
      .json({ error: "Both ticker1 and ticker2 are required" });

  try {
    const [data1, data2] = await Promise.all([
      getStockPrices(ticker1, minutes),
      getStockPrices(ticker2, minutes),
    ]);

    const prices1 = data1.priceHistory.map((e) => e.price);
    const prices2 = data2.priceHistory.map((e) => e.price);

    if (prices1.length !== prices2.length)
      return res.status(400).json({ error: "Unequal price history lengths" });

    const mean1 = prices1.reduce((a, b) => a + b, 0) / prices1.length;
    const mean2 = prices2.reduce((a, b) => a + b, 0) / prices2.length;

    const covariance =
      prices1.reduce(
        (sum, val, i) => sum + (val - mean1) * (prices2[i] - mean2),
        0
      ) / prices1.length;

    const stdDev1 = Math.sqrt(
      prices1.reduce((sum, val) => sum + Math.pow(val - mean1, 2), 0) /
        prices1.length
    );
    const stdDev2 = Math.sqrt(
      prices2.reduce((sum, val) => sum + Math.pow(val - mean2, 2), 0) /
        prices2.length
    );

    const correlation = covariance / (stdDev1 * stdDev2);

    res.json({
      correlation,
      stocks: {
        [ticker1]: { averagePrice: mean1, priceHistory: data1.priceHistory },
        [ticker2]: { averagePrice: mean2, priceHistory: data2.priceHistory },
      },
    });
  } catch {
    res.status(500).json({ error: "Error calculating correlation" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
