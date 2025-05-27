const express = require("express");
const axios = require("axios");

const MOCK_PORT = 4000;
const BASE_URL = `http://localhost:${MOCK_PORT}`;

const startMockServer = () => {
  const app = express();

  app.get("/stocks/:ticker", (req, res) => {
    const { ticker } = req.params;
    const { minutes } = req.query;

    res.json({
      ticker,
      minutes: minutes || 60,
      priceHistory: [
        { time: "2023-01-01T00:00:00Z", price: 100 },
        { time: "2023-01-01T01:00:00Z", price: 105 },
        { time: "2023-01-01T02:00:00Z", price: 110 },
      ],
    });
  });

  app.get("/stockcorrelation", (req, res) => {
    const { ticker1, ticker2 } = req.query;

    res.json({
      correlation: 0.85,
      stocks: {
        [ticker1]: {
          averagePrice: 105,
          priceHistory: [
            { time: "2023-01-01T00:00:00Z", price: 100 },
            { time: "2023-01-01T01:00:00Z", price: 105 },
            { time: "2023-01-01T02:00:00Z", price: 110 },
          ],
        },
        [ticker2]: {
          averagePrice: 110,
          priceHistory: [
            { time: "2023-01-01T00:00:00Z", price: 105 },
            { time: "2023-01-01T01:00:00Z", price: 110 },
            { time: "2023-01-01T02:00:00Z", price: 115 },
          ],
        },
      },
    });
  });

  app.get("/evaluation-service/stocks/:ticker", (req, res) => {
    const { ticker } = req.params;
    const { minutes } = req.query;

    res.json({
      ticker,
      minutes: minutes || 60,
      priceHistory: [
        { time: "2023-01-01T00:00:00Z", price: 100 },
        { time: "2023-01-01T01:00:00Z", price: 105 },
        { time: "2023-01-01T02:00:00Z", price: 110 },
      ],
    });
  });

  app.get("/evaluation-service/stockcorrelation", (req, res) => {
    const { ticker1, ticker2 } = req.query;

    res.json({
      correlation: 0.85,
      stocks: {
        [ticker1]: {
          averagePrice: 105,
          priceHistory: [
            { time: "2023-01-01T00:00:00Z", price: 100 },
            { time: "2023-01-01T01:00:00Z", price: 105 },
            { time: "2023-01-01T02:00:00Z", price: 110 },
          ],
        },
        [ticker2]: {
          averagePrice: 110,
          priceHistory: [
            { time: "2023-01-01T00:00:00Z", price: 105 },
            { time: "2023-01-01T01:00:00Z", price: 110 },
            { time: "2023-01-01T02:00:00Z", price: 115 },
          ],
        },
      },
    });
  });

  app.listen(MOCK_PORT, () => {
    console.log(`✅ Mock API running at http://localhost:${MOCK_PORT}`);
  });
};

const testEndpoints = async () => {
  try {
    console.log("\n🚀 Testing /stocks/:ticker");
    await axios.get(`${BASE_URL}/stocks/AAPL?minutes=30`);

    console.log("🚀 Testing /stockcorrelation");
    await axios.get(
      `${BASE_URL}/stockcorrelation?ticker1=AAPL&ticker2=MSFT&minutes=30`
    );

    console.log("🚀 Testing /evaluation-service/stocks/:ticker");
    await axios.get(`${BASE_URL}/evaluation-service/stocks/NVDA?minutes=50`);

    console.log("🚀 Testing /evaluation-service/stockcorrelation");
    await axios.get(
      `${BASE_URL}/evaluation-service/stockcorrelation?ticker1=NVDA&ticker2=MSFT&minutes=50`
    );

    console.log("\n All endpoints responded successfully!");
  } catch (error) {
    console.error(" Mock API test failed:", error.message);
  }
};

startMockServer();
setTimeout(testEndpoints, 1000);
