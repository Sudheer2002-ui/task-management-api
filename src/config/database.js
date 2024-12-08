const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGO_URI; // Retrieve from environment
        if (!mongoUri) {
            throw new Error("MONGO_URI is not defined in the environment variables");
        }
        await mongoose.connect(mongoUri);
        console.log("MongoDB connected successfully");
    } catch (err) {
        console.error(`MongoDB connection failed: ${err.message}`);
        process.exit(1); // Exit the process with failure
    }
};

module.exports = connectDB;
