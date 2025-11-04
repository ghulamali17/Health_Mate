const app = require("./app");
const connectDB = require("./connection");


const server = async (req, res) => {
  try {
   
    await connectDB();
    
    return app(req, res);
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
};

// For local development only
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3001;
  
  const startServer = async () => {
    try {
      await connectDB();
      app.listen(PORT, () => {
        console.log(`✅ Server is running at http://localhost:${PORT}`);
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