import mongoose from "mongoose";

const database = async () => {
  try {
    if (!process.env.MONGO_URI || !process.env.DATABASE_NAME) {
      throw new Error("Missing environment variables");
    }
 
    const connection = mongoose.connection;
    const connectionOptions = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      dbName: process.env.DATABASE_NAME
    };

    connection.on('connected', () => {
        console.log('🟢 Database connected');
    });

    connection.on('reconnected', () => {
        console.log('🟡 Database reconnected');
    });

    connection.on('error', (err) => {
      console.error('❌ Connection error:', err);
    });

    connection.on('disconnected', () => {
        console.log('🔴 Database disconnected');
    });

    await mongoose.connect(process.env.MONGO_URI!, connectionOptions);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    process.exit(1);
  }
};

export default database;
