const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pool = require('./db');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ensure uploads dir exists
const UPLOAD_DIR = path.join(__dirname, 'public', 'uploads');
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// multer storage: unique filename
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, name + ext);
  }
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    // allow common image mimetypes and fall back to extension check when mimetype is missing/unreliable
    const allowedMimes = /^image\/(jpeg|pjpeg|png|gif|webp|svg\+xml)$/;
    if (file.mimetype && allowedMimes.test(file.mimetype)) return cb(null, true);

    // Fallback: check file extension
    const ext = path.extname(file.originalname || '').toLowerCase();
    if (['.jpg', '.jpeg', '.pjpeg', '.png', '.gif', '.webp', '.svg'].includes(ext)) return cb(null, true);

    cb(new Error('Only image files are allowed'), false);
  },
  limits: { fileSize: 5 * 1024 * 1024 }
});

// serve static files
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));
app.use(express.static(path.join(__dirname, 'public')));

// Health endpoint for liveness checks
app.get('/health', (req, res) => res.status(200).send('ok'));

// Serve root index.html from repo root (index.html is in project root)
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

// POST /api/gallery - upload an image and insert DB row
app.post('/api/gallery', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Image required' });
    const { title, alt_text, is_premium } = req.body;
    const url = `/uploads/${req.file.filename}`;
    const result = await pool.query(
      'INSERT INTO gallery_images (title, url, alt_text, is_premium) VALUES ($1,$2,$3,$4) RETURNING *',
      [title || null, url, alt_text || null, is_premium === 'true' || is_premium === '1']
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/gallery?premium=true|false (omit premium to get all)
app.get('/api/gallery', async (req, res) => {
  try {
    let q = 'SELECT * FROM gallery_images';
    const params = [];
    if (req.query.premium === 'true' || req.query.premium === 'false') {
      q += ' WHERE is_premium = $1';
      params.push(req.query.premium === 'true');
    }
    q += ' ORDER BY created_at DESC';
    const result = await pool.query(q, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
