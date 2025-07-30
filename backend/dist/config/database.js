import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hopehands';
const MONGODB_TEST_URI = process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/hopehands_test';
// MongoDB connection options (updated for latest MongoDB driver compatibility)
const mongooseOptions = {
    maxPoolSize: 10, // Maintain up to 10 socket connections
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
    family: 4, // Use IPv4, skip trying IPv6
    retryWrites: true, // Enable retryable writes
    retryReads: true, // Enable retryable reads
};
export const connectDB = async () => {
    try {
        const dbUri = process.env.NODE_ENV === 'test' ? MONGODB_TEST_URI : MONGODB_URI;
        const conn = await mongoose.connect(dbUri, mongooseOptions);
        if (process.env.NODE_ENV !== 'test') {
            console.log(`MongoDB Connected: ${conn.connection.host}:${conn.connection.port}`);
            console.log(`Database: ${conn.connection.name}`);
        }
        // Handle connection events
        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
        });
        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected');
        });
        mongoose.connection.on('reconnected', () => {
            console.log('MongoDB reconnected');
        });
        // Handle app termination
        process.on('SIGINT', async () => {
            await mongoose.connection.close();
            console.log('MongoDB connection closed through app termination');
            process.exit(0);
        });
    }
    catch (error) {
        console.error('Database connection error:', error);
        process.exit(1);
    }
};
export const disconnectDB = async () => {
    try {
        await mongoose.connection.close();
        if (process.env.NODE_ENV !== 'test') {
            console.log('MongoDB connection closed');
        }
    }
    catch (error) {
        console.error('Error closing database connection:', error);
    }
};
export default connectDB;
//# sourceMappingURL=database.js.map