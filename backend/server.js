// const app = require("./app");
// const connectDB = require("./connection");

// // For Vercel deployment - serverless function
// const server = async (req, res) => {
//   try {
//     // Connect to DB on first request (cold start)
//     await connectDB();
    
//     return app(req, res);
//   } catch (error) {
//     console.error('Server error:', error);
//     return res.status(500).json({ 
//       error: 'Internal server error',
//       details: error.message 
//     });
//   }
// };

// // For local development only
// if (require.main === module) {
//   const PORT = process.env.PORT || 3001;
  
//   const startServer = async () => {
//     try {
//       await connectDB();
//       app.listen(PORT, () => {
//         console.log(`✅ Server is running at http://localhost:${PORT}`);
//       });
//     } catch (error) {
//       console.error('❌ Failed to start server:', error);
//       process.exit(1);
//     }
//   };
  
//   startServer();
// }

// // For Vercel deployment
// module.exports = server;
const app = require("./app");
const connectDB = require("./connection");

// Connect to database
connectDB().then(() => {
  console.log('✅ MongoDB connected');
}).catch(err => {
  console.error('❌ MongoDB connection failed:', err);
});

// Export the Express app directly for Vercel
module.exports = app;