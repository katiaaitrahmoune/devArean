const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;

const UPLOAD_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// The ESP32 sends the raw JPEG bytes as the POST body with
// Content-Type: image/jpeg — so we parse it as raw binary, not JSON/form-data.
app.use(express.raw({ type: 'image/jpeg', limit: '10mb' }));

app.post('/upload', (req, res) => {
  if (!req.body || req.body.length === 0) {
    return res.status(400).send('No image data received');
  }

  const timestamp = Date.now();
  const filename = `snapshot_${timestamp}.jpg`;
  const filepath = path.join(UPLOAD_DIR, filename);

  fs.writeFile(filepath, req.body, (err) => {
    if (err) {
      console.error('Failed to save image:', err);
      return res.status(500).send('Failed to save image');
    }
    console.log(`Saved ${filename} (${req.body.length} bytes)`);
  });

  // Always overwrite one fixed file too, so you always have an easy
  // "latest snapshot" URL to check from a browser.
  fs.writeFile(path.join(UPLOAD_DIR, 'latest.jpg'), req.body, (err) => {
    if (err) console.error('Failed to save latest.jpg:', err);
  });

  res.status(200).send('OK');
});

// View the most recent snapshot in a browser.
app.get('/latest.jpg', (req, res) => {
  const filepath = path.join(UPLOAD_DIR, 'latest.jpg');
  if (!fs.existsSync(filepath)) {
    return res.status(404).send('No snapshot yet');
  }
  res.sendFile(filepath);
});

app.get('/', (req, res) => {
  res.send('ESP32-CAM upload server is running. POST images to /upload, view latest at /latest.jpg');
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});