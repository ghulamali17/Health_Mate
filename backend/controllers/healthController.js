const healthController = {
  healthCheck: async (req, res) => {
    res.json({ 
      status: "OK", 
      message: "HealthMate API is running smoothly!",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });
  }
};

module.exports = healthController;