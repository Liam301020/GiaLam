// init.js
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('mydb.sqlite');

// Sample tour data
const tours = [
  { title: "Seoul Tour", destination: "Seoul", price: "$250", duration: "3 days", image: "b2.jpg" },
  { title: "Busan Tour", destination: "Busan", price: "$250", duration: "2 days", image: "68.jpg" },
  { title: "Jeju Island Tour", destination: "Jeju", price: "$180", duration: "4 days", image: "download.jpeg" },
  { title: "Gyeongju Tour", destination: "Gyeongju", price: "$200", duration: "2 days", image: "Gyeongju.jpg" },
  { title: "Mount Seoraksan National Park Tour", destination: "Seoraksan", price: "$200", duration: "1 day", image: "MountSeoraksanNationalPark.jpg" },
  { title: "Jeonju Tour", destination: "Jeonju", price: "$200", duration: "1 day", image: "Jeonju.jpg" },
  { title: "Wonju Tour", destination: "Wonju", price: "$200", duration: "1 day", image: "Wonju.jpg" },
  { title: "Incheon Tour", destination: "Incheon", price: "$200", duration: "1 day", image: "Incheon.jpg" }
];

// Initialize tables
db.serialize(() => {
  // Drop old tables (optional)
  db.run("DROP TABLE IF EXISTS users");
  db.run("DROP TABLE IF EXISTS messages");
  db.run("DROP TABLE IF EXISTS tours");
  //Create users table 
  db.run(`CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    username TEXT NOT NULL UNIQUE,
    dob TEXT,
    address TEXT,
    phone TEXT
  )`);

  // Create messages table
  db.run(`CREATE TABLE messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT,
    phone TEXT,
    message TEXT
  )`);

  // Create tours table
  db.run(`CREATE TABLE tours (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    destination TEXT,
    price TEXT,
    duration TEXT,
    image TEXT
  )`);

  // Insert sample tour data
  const stmt = db.prepare("INSERT INTO tours (title, destination, price, duration, image) VALUES (?, ?, ?, ?, ?)");
  tours.forEach(tour => {
    stmt.run(tour.title, tour.destination, tour.price, tour.duration, tour.image);
  });
  stmt.finalize();

  console.log("SQLite database and tables initialized successfully.");
});

db.close();