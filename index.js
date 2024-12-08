const mongoose = require('mongoose');
const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const UserModel = require('./models/user');
const port = 4000;
const NewsModel = require('./models/news');

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/test", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB connected successfully"))
  .catch(err => console.error("Failed to connect to MongoDB:", err));

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

// Route to handle user signup
app.post('/signup', (req, res) => {
    const { fullname, email, password } = req.body;
    UserModel.create({ fullname, email, password })
        .then(() => res.status(201).json({ message: "User created successfully" }))
        .catch(() => res.status(500).json({ message: "An error occurred while creating the user" }));
});

// Admin credentials
const ADMIN_EMAIL = "admin@example.com";
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin123";

// Route to handle user login
app.post('/signin', (req, res) => {
    const { email, username, password } = req.body;

    // Check for admin login
    if (email === ADMIN_EMAIL || username === ADMIN_USERNAME || password === ADMIN_PASSWORD) {
        return res.sendFile(path.join(__dirname, 'public', 'html', 'uploadnewsandupdate.html'));
    }

    // Check for regular user login
    UserModel.findOne({ email }).then((user) => {
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.password !== password) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        res.status(200).json({ message: "Login successful", user });
    }).catch(() => {
        res.status(500).json({ message: "An error occurred during login" });
    });
});

// Route to handle news submission
app.post('/api/news', (req, res) => {
    const { title, content } = req.body;

    // Save the news data to the database
    NewsModel.create({ title, content })
        .then(() => {
            res.sendFile(path.join(__dirname, 'public', 'html', 'NewsAndUpdates.html'));
        })
        .catch(err => {
            console.error("Error saving news:", err);
            res.status(500).send(`
                <h1>Error uploading news. Please try again later.</h1>
                <a href="/">Go back</a>
            `);
        });
});
// API route to fetch all news
app.get('/api/news', (req, res) => {
    NewsModel.find()
    //   .sort({ date: -1 }) // Sort by most recent first
      .then(news => res.status(200).json(news))
      .catch(err => {
        console.error("Error fetching news:", err);
        res.status(500).json({ message: 'Error fetching news' });
      });
  });

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
