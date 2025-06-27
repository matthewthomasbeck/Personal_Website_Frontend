const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Allow CORS from your production domain and localhost for dev
const allowedOrigins = [
  'https://www.matthewthomasbeck.com',
  'http://www.matthewthomasbeck.com',
  'http://localhost:3000',
  'http://localhost:5500'
];
app.use((req, res, next) => {
  console.log('Origin:', req.headers.origin);
  next();
});
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Proxy endpoint for Cognito token exchange
app.post('/auth/token', async (req, res) => {
  try {
    const { code, redirectUri } = req.body;
    const params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('client_id', process.env.COGNITO_CLIENT_ID);
    params.append('client_secret', process.env.COGNITO_CLIENT_SECRET);
    params.append('code', code);
    params.append('redirect_uri', redirectUri);

    const response = await axios.post(
      `https://${process.env.COGNITO_DOMAIN}/oauth2/token`,
      params,
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
    res.json(response.data);
  } catch (err) {
    res.status(400).json({ error: err.response?.data || err.message });
  }
});

// (Optional) Add your video streaming or signaling endpoints here

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => console.log(`Backend running on port ${PORT}`)); 