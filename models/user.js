const mongoose = require('mongoose');

// Define User schema with proper validation
const UserSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: [true, 'Full name is required'], // Full name is required with custom message
        trim: true, // Trim spaces from the beginning and end
    },
    email: {
        type: String,
        required: [true, 'Email is required'], // Email is required with custom message
        unique: true, // Email should be unique
        lowercase: true, // Converts email to lowercase before saving
        match: [/.+\@.+\..+/, 'Please fill a valid email address'], // Email validation regex
    },
    password: {
        type: String,
        required: [true, 'Password is required'], // Password is required
        minlength: [6, 'Password must be at least 6 characters long'], // Minimum length for password
    }
});

module.exports = mongoose.model('User', UserSchema);
