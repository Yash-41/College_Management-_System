const mongoose = require('mongoose');

// Define User schema with proper validation
const UserSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true, // Full name is required
        trim: true, // Trim spaces from the beginning and end
    },
    email: {
        type: String,
        required: true, // Email is required
        // unique: true, // Email should be unique
        // lowercase: true, // Converts email to lowercase before saving
        // match: [/.+\@.+\..+/, 'Please fill a valid email address'], // Email validation regex
    },
    password: {
        type: String,
        required: true, // Password is required
        minlength: 6, // Minimum length for password
    }
});

// Export the User model
module.exports = mongoose.model('User', UserSchema);
