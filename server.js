const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const https = require('https');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve React build static files
app.use(express.static(path.join(__dirname, 'client/build')));

// Store inquiries in JSON file
const INQUIRIES_FILE = path.join(__dirname, 'data', 'inquiries.json');

if (!fs.existsSync(path.join(__dirname, 'data'))) {
    fs.mkdirSync(path.join(__dirname, 'data'));
}

if (!fs.existsSync(INQUIRIES_FILE)) {
    fs.writeFileSync(INQUIRIES_FILE, JSON.stringify([]));
}

// In-memory OTP store
let pendingOtp = null;
let otpExpiry = null;

app.post('/api/send-otp', (req, res) => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  pendingOtp = otp;
  otpExpiry = Date.now() + 5 * 60 * 1000;
  const apiKey = 'Gsk8cBXqKpOMv35rf0J6bITntjaRFVQhWNZx4gCHLE2UlYuoPAUKqmexidIC2SBQvNb6LkaD9AO4crly';
  const message = encodeURIComponent(`Your NLETA deletion OTP is: ${otp}. Valid for 5 minutes.`);
  const url = `https://www.fast2sms.com/dev/bulkV2?authorization=${apiKey}&route=q&message=${message}&language=english&flash=0&numbers=9211693664`;
  https.get(url, (resp) => {
    let data = '';
    resp.on('data', chunk => data += chunk);
    resp.on('end', () => {
      const result = JSON.parse(data);
      if (result.return) res.json({ success: true, message: 'OTP sent to registered number.' });
      else res.json({ success: false, message: 'Failed to send OTP: ' + (result.message || JSON.stringify(result)) });
    });
  }).on('error', (e) => res.json({ success: false, message: 'Network error: ' + e.message }));
});

app.post('/api/verify-otp', (req, res) => {
  const { otp } = req.body;
  if (!pendingOtp) return res.json({ success: false, message: 'No OTP sent. Click Send OTP first.' });
  if (Date.now() > otpExpiry) { pendingOtp = null; return res.json({ success: false, message: 'OTP expired. Request a new one.' }); }
  if (parseInt(otp) === pendingOtp) { pendingOtp = null; res.json({ success: true }); }
  else res.json({ success: false, message: 'Incorrect OTP. Try again.' });
});

app.post('/api/contact', (req, res) => {
    const { name, email, phone, message } = req.body;
    if (!name || !email || !message) {
        return res.status(400).json({ success: false, message: 'Please fill all required fields' });
    }
    const inquiry = {
        id: Date.now(),
        name, email,
        phone: phone || '',
        message,
        date: new Date().toISOString()
    };
    const inquiries = JSON.parse(fs.readFileSync(INQUIRIES_FILE, 'utf8'));
    inquiries.push(inquiry);
    fs.writeFileSync(INQUIRIES_FILE, JSON.stringify(inquiries, null, 2));
    res.json({ success: true, message: 'Thank you! We will contact you soon.' });
});

app.get('/api/inquiries', (req, res) => {
    const inquiries = JSON.parse(fs.readFileSync(INQUIRIES_FILE, 'utf8'));
    res.json(inquiries);
});

// All other routes serve React app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
