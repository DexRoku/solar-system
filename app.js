const path = require('path');
const express = require('express');
const OS = require('os');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/')));
app.use(cors());

// Connect to MongoDB (no deprecated options)
async function connectDB() {
  try {
    await mongoose.connect('mongodb+srv://superuser:SuperPassword@supercluster.d83jj.mongodb.net/superData');
    console.log("MongoDB Connection Successful");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
}

connectDB();

// Define Schema and Model
const dataSchema = new mongoose.Schema({
  name: String,
  id: Number,
  description: String,
  image: String,
  velocity: String,
  distance: String
});

const planetModel = mongoose.model('planets', dataSchema);

// POST /planet using async/await and promises (no callback)
app.post('/planet', async (req, res) => {
  try {
    const planetData = await planetModel.findOne({ id: req.body.id }).exec();
    if (!planetData) {
      return res.status(404).send("Planet not found. Select a number from 0 - 9");
    }
    res.send(planetData);
  } catch (err) {
    res.status(500).send("Error in Planet Data");
  }
});

// Serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// OS info
app.get('/os', (req, res) => {
  res.json({
    os: OS.hostname(),
    env: process.env.NODE_ENV || 'development'
  });
});

// Live status
app.get('/live', (req, res) => {
  res.json({ status: "live" });
});

// Ready status
app.get('/ready', (req, res) => {
  res.json({ status: "ready" });
});

// Start server only if running directly
if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server successfully running on port - ${port}`);
  });
}

module.exports = app;
