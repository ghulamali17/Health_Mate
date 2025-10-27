const app = require("./app");
const connectDB = require("./connection");
 
let isColdStart = true;

async function initializeDatabase() {
  try {
    await connectDB();
    console.log('✅ Database connection initialized');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
  }
}

// Initialize on cold start
if (isColdStart) {
  initializeDatabase();
  isColdStart = false;
}

module.exports = async (req, res) => {
  try {
    await connectDB();
  } catch (error) {
    console.error('Database connection error in handler:', error);
    return res.status(503).json({ 
      error: 'Service temporarily unavailable',
      details: 'Database connection failed'
    });
  }
  
  return app(req, res);
};

// For local development only
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