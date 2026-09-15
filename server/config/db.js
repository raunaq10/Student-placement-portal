const mongoose = require("mongoose");
let mongoMemoryServer = null;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (uri && uri.trim() !== "") {
    try {
      const conn = await mongoose.connect(uri);
      console.log(`[MongoDB] Connected to external DB: ${conn.connection.host}`);
      return;
    } catch (err) {
      console.warn(`[MongoDB] External connection failed (${err.message}). Falling back to MongoMemoryServer...`);
    }
  }

  try {
    const { MongoMemoryServer } = require("mongodb-memory-server");
    mongoMemoryServer = await MongoMemoryServer.create();
    const memoryUri = mongoMemoryServer.getUri();
    const conn = await mongoose.connect(memoryUri);
    console.log(`[MongoDB] Connected to in-memory database: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[MongoDB] Error initializing database: ${error.message}`);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  await mongoose.disconnect();
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
  }
};

module.exports = { connectDB, disconnectDB };
