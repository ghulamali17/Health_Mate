const app = require("./app");
const connectDB = require("./connection");

let isColdStart = true;
let isConnected = false;

async function initializeDatabase() {
  try {
    if (!isConnected) {
      await connectDB();
      isConnected = true;
      console.log('✅ Database connection initialized');
    }
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    isConnected = false;
  }
}

// Initialize on cold start
if (isColdStart) {
  initializeDatabase();
  isColdStart = false;
}

const server = async (req, res) => {
  try {
    if (!isConnected) {
      await connectDB();
      isConnected = true;
    }
    
    return app(req, res);
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
};

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3001;
  
  const startServer = async () => {
    try {
      await connectDB();
      app.listen(PORT, () => {
        console.log(`✅ Server is running at http://localhost:${PORT}`);
        console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
      });
    } catch (error) {
      console.error('❌ Failed to start server:', error);
      process.exit(1);
    }
  };
  
  startServer();
}

// For Vercel deployment 
module.exports = server;