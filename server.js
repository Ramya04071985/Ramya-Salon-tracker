// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { json } = require('express');
const app = express();
app.use(cors());
app.use(json());

const PORT = process.env.PORT || 3000;
const TWILIO_ACCOUNT_SID = AC0b9ab9bf643ac4efe23fc73b05cf1830;
const TWILIO_AUTH_TOKEN = 316fb5fbfedda05b56edcbb850ebab46;
const TWILIO_PHONE_NUMBER = +1 737 420 3041;

if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
  console.warn('Twilio credentials missing. Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER in env.');
}

const client = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

// Endpoint expected payload: { to: "+1 737 420 3041", message: "text" }
app.post('/send-sms', async (req, res) => {
  try {
    const { to, message } = req.body;
    if (!to || !message) return res.status(400).json({ error: 'to and message required' });
    // send SMS via Twilio
    const sent = await client.messages.create({
      body: message,
      from: TWILIO_PHONE_NUMBER,
      to: to
    });
    res.json({ ok: true, sid: sent.sid });
  } catch (err) {
    console.error('SMS send error:', err);
    res.status(500).json({ ok: false, error: String(err) });
  }
});

// Serve static files so you can run owner.html/customer.html from same server easily
app.use(express.static('.'));

app.listen(PORT, () => console.log(`SMS server listening on port ${PORT}`));
