const mongoose = require('mongoose');
const express = require('express');
const path = require('path');
const cors = require('cors');
const UserModel = require('./models/user');
const port = 3000;

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/test", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log("Failed to connect to MongoDB", err));

const app = express();

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(cors()); // Enable CORS

// Serve index.html on root request
app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

// Handle POST request for user sign-in
app.post('/signin', async (req, res) => {
    const { fullname, email, password } = req.body; // Destructure the request body

    try {
        const newUser = await UserModel.create({
            fullname,
            email,
            password
        });

        // Send a success message or redirect to a new page
        return res.status(201).sendFile(path.resolve(__dirname, 'public', 'index.html'));
    } catch (error) {
        console.error(error);
        return res.status(500).send("An error occurred while creating the user");
    }
});

// Start the server
app.listen(port, () => {
    console.log('Server is running on port ' + port);
});
