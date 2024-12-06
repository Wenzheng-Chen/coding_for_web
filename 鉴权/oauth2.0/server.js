const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

// Replace with your credentials
const clientId = "your-client-id";
const clientSecret = "your-client-secret";
const tokenEndpoint = "https://authorization-server.com/oauth/token";

app.use(bodyParser.json());

// Redirect URI for OAuth callback
app.get("/callback", (req, res) => {
  const code = req.query.code;
  if (!code) {
    return res.status(400).send("Authorization code missing");
  }
  res.send(`
    <script>
      window.location.href = "http://localhost:3000/?code=${code}";
    </script>
  `);
});

// Endpoint to exchange authorization code for token
app.post("/token", async (req, res) => {
  const { code, redirectUri } = req.body;

  try {
    const response = await axios.post(
      tokenEndpoint,
      new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
        client_id: clientId,
        client_secret: clientSecret,
      }).toString(),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching token:", error.response.data);
    res.status(500).json({ error: "Failed to exchange code for token" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
