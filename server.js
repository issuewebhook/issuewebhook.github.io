const express = require("express");
const fetch = require("node-fetch");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

// User’s webhook (message first goes here)
const USER_WEBHOOK = "https://webhook.site/xxxxxx"; // example user webhook
// Your main webhook (final destination)
const MAIN_WEBHOOK = "https://your-webhook-url.com/endpoint";

app.use(bodyParser.json());

// Relay endpoint
app.post("/relay", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    // Step 1: Send to user’s webhook
    await fetch(USER_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: message })
    });

    // Step 2: Forward to your main webhook
    await fetch(MAIN_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: `[Relay] ${message}` })
    });

    res.json({ status: "Relayed to both webhooks" });
  } catch (err) {
    console.error("Error relaying message:", err);
    res.status(500).json({ error: "Relay failed" });
  }
});

app.listen(PORT, () => {
  console.log(`Relay server running at http://localhost:${PORT}`);
});
