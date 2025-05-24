const fs = require('fs');
const path = require('path');

// Sample data for tours.json
const tours = [
  {
    title: "Seoul Tour",
    destination: "Seoul",
    price: "$250",
    duration: "3 days",
    image: "b2.jpg"
  },
  {
    title: "Busan Tour",
    destination: "Busan",
    price: "$250",
    duration: "2 days",
    image: "68.jpg"
  },
  {
    title: "Jeju Island Tour",
    destination: "Jeju",
    price: "$180",
    duration: "4 days",
    image: "download.jpeg"
  },
  {
    title: "Gyeongju Tour",
    destination: "Gyeongju",
    price: "$200",
    duration: "2 days",
    image: "Gyeongju.jpg"
  },
  {
    title: "Mount Seoraksan National Park Tour",
    destination: "Seoraksan",
    price: "$200",
    duration: "1 day",
    image: "MountSeoraksanNationalPark.jpg"
  },
  {
    title: "Jeonju Tour",
    destination: "Jeonju",
    price: "$200",
    duration: "1 day",
    image: "Jeonju.jpg"
  },
  {
    title: "Wonju Tour",
    destination: "Wonju",
    price: "$200",
    duration: "1 day",
    image: "Wonju.jpg"
  },
  {
    title: "Incheon Tour",
    destination: "Incheon",
    price: "$200",
    duration: "1 day",
    image: "Incheon.jpg"
  }
];

// Write sample data to tours.json
fs.writeFileSync(path.join(__dirname, 'tours.json'), JSON.stringify(tours, null, 2));

// Initialize other data files as empty arrays
fs.writeFileSync(path.join(__dirname, 'users.json'), JSON.stringify([], null, 2));
fs.writeFileSync(path.join(__dirname, 'messages.json'), JSON.stringify([], null, 2));
fs.writeFileSync(path.join(__dirname, 'savedtours.json'), JSON.stringify([], null, 2));

console.log("✅ All JSON files initialized successfully.");