import mongoose from "mongoose";

const database = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI environment variable is not defined");
    }
 
    const connection = mongoose.connection;
    const connectionOptions = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000
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
