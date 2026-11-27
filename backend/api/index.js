// api/index.js - DEBUG WALA
try {
  const app = require('../server.js');
  module.exports = app;
} catch (err) {
  console.error("CRASH REASON:", err);
  const express = require('express');
  const app = express();
  app.get('/', (req, res) => {
    res.status(500).json({
      success: false,
      crash_in: "server.js load hote hue",
      message: err.message,
      stack: err.stack
    });
  });
  module.exports = app;
}