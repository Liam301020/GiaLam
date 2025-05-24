const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const session = require('express-session');
const path = require('path');
const bcrypt = require('bcrypt');

const app = express();
const port = 3000;

// Connect to SQLite
const db = new sqlite3.Database('mydb.sqlite');

// Middleware
app.use(express.urlencoded({ extended: true })); // for form submissions
app.use(express.json()); // for JSON fetch requests
app.use(express.static('public_html'));

app.use(session({
  secret: 'secretKey123',
  resave: false,
  saveUninitialized: true
}));

// --- SIGN UP ---
app.post('/signup', async (req, res) => {
  const { username, email, password, dob, address, phone } = req.body;

  try {
    if (!email || !password || !dob) {
      return res.status(400).json({ error: "Please fill out all required fields." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    db.run(
      `INSERT INTO users ( username, email, password, dob, address, phone)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [username, email, hashedPassword, dob, address, phone],
      function (err) {
        if (err) {
          if (err.message.includes("UNIQUE")) {
            return res.status(400).json({ error: "Email already exists." });
          }
          return res.status(500).json({ error: "Database error: " + err.message });
        }
        return res.status(200).json({
          message: "Signup successful!",
          redirect: "/home.html"
        });
      }
    );
  } catch (err) {
    console.error("Hashing error:", err);
    return res.status(500).json({ error: "Internal Server Error." });
  }
});

// --- LOGIN ---
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, row) => {
    if (err) return res.status(500).send("Database error.");
    if (!row) return res.status(401).send("Email not found.");

    const match = await bcrypt.compare(password, row.password);
    if (!match) return res.status(401).send("Incorrect password.");

    req.session.user = { email: row.email };
    res.redirect('/home.html');
  });
});

// --- CONTACT US ---
app.post('/contact', (req, res) => {
  const { name, email, phone, message } = req.body;
  db.run(
    `INSERT INTO messages (name, email, phone, message) VALUES (?, ?, ?, ?)`,
    [name, email, phone, message],
    function (err) {
      if (err) return res.status(500).send("Error saving message.");
      res.send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Message Sent</title>
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
          <style>
            body { background-color: #f4faff; padding: 60px; text-align: center; font-family: 'Segoe UI', sans-serif; }
            .thank-you-box { background: #fff; padding: 40px; border-radius: 12px; box-shadow: 0 0 15px rgba(0,0,0,0.1); display: inline-block; }
            .emoji { font-size: 48px; margin-bottom: 10px; color: #0d6efd; }
          </style>
        </head>
        <body>
          <div class="thank-you-box">
            <div class="emoji">📨</div>
            <h2 class="text-success">Thank you, ${name}!</h2>
            <p class="text-muted">Your message has been received. We'll get back to you soon.</p>
            <a href="/home.html" class="btn btn-primary mt-3">Back to Home</a>
          </div>
        </body>
        </html>
      `);
    }
  );
});

// --- SEARCH TOURS ---
app.get('/search', (req, res) => {
  const keyword = `%${req.query.keyword.toLowerCase()}%`;

  db.all(
    `SELECT * FROM tours WHERE LOWER(destination) LIKE ? OR LOWER(title) LIKE ?`,
    [keyword, keyword],
    (err, rows) => {
      if (err) return res.status(500).send("Search error.");
      res.json(rows);
    }
  );
});

// --- TOP 3 TOURS (Carousel) ---
app.get('/top-tours', (req, res) => {
  db.all(`
    SELECT * FROM tours 
    WHERE image IS NOT NULL AND TRIM(image) != '' 
    ORDER BY id ASC 
    LIMIT 3
  `, (err, rows) => {
    if (err) return res.status(500).json({ error: "DB error" });
    res.json(rows);
  });
});

// --- PROFILE ---
app.get('/profile', (req, res) => {
  if (!req.session.user) {
    return res.status(401).send("You must be logged in to view this page.");
  }
  res.send(`<h3>You are logged in as: ${req.session.user.email}</h3>`);
});

// --- CURRENT USER (Navbar dynamic) ---
app.get('/current-user', (req, res) => {
  res.json({ email: req.session.user?.email || null });
});

// --- LOGOUT ---
app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).send("Logout failed.");
    res.redirect('/home.html');
  });
});

// --- 404 Handler (keep last) ---
app.use((req, res) => {
  res.status(404).send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>404 Not Found</title>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
      <style>
        body { text-align: center; padding: 100px; background-color: #fff4f4; font-family: 'Segoe UI', sans-serif; }
        .emoji { font-size: 60px; }
      </style>
    </head>
    <body>
      <h1 class="text-danger">404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <a href="/home.html" class="btn btn-danger">Back to Home</a>
    </body>
    </html>
  `);
});

// --- START SERVER ---
app.listen(port, () => {
  console.log(` Server running at http://localhost:${port}`);
});