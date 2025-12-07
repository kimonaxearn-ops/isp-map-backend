// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// --- 1. MIDDLEWARE (Security & Data) ---
app.use(cors()); // Allows your Netlify/Mobile app to talk to this server
app.use(express.json()); // Allows server to understand JSON data

// --- 2. DATABASE CONNECTION ---
// Replace this string with your MongoDB Atlas connection string if not using .env
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://kimonaxearn_db_user:gu6Pb2kRZjTtS4V5@cluster0.kqqizsf.mongodb.net/?appName=Cluster0';

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch(err => {
    console.error('❌ DB Connection Error:', err);
    process.exit(1); // Stop app if DB fails
  });

// --- 3. DATA MODEL (The Blueprint) ---
const AssetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true }, // Splitter, Closure, ONU
  details: String,
  location: { 
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  date: { type: Date, default: Date.now }
});

const Asset = mongoose.model('Asset', AssetSchema);

// --- 4. API ROUTES ---

// GET: Fetch all assets for the map
app.get('/api/assets', async (req, res) => {
  try {
    // We sort by date (newest first) so you see recent adds easily
    const assets = await Asset.find().sort({ date: -1 });
    res.json(assets);
  } catch (error) {
    res.status(500).json({ message: "Server Error: Could not fetch assets" });
  }
});

// POST: Save a new asset (Splitter/ONU)
app.post('/api/assets', async (req, res) => {
  const { name, type, details, location } = req.body;

  // Validation: Ensure location exists
  if (!location || !location.lat || !location.lng) {
    return res.status(400).json({ message: "Location (lat/lng) is required" });
  }

  const newAsset = new Asset({ 
    name, 
    type, 
    details, 
    location 
  });
  
  try {
    const savedAsset = await newAsset.save();
    console.log(`✅ Saved: ${name} (${type})`);
    res.status(201).json(savedAsset);
  } catch (error) {
    console.error("Save Error:", error);
    res.status(400).json({ message: "Error saving asset" });
  }
});

// DELETE: Remove an asset
app.delete('/api/assets/:id', async (req, res) => {
    try {
        await Asset.findByIdAndDelete(req.params.id);
        res.json({ message: "Asset deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete asset" });
    }
});

// SEARCH: (Optional) Backend search if you have thousands of items
app.get('/api/search', async (req, res) => {
  const { query } = req.query; // ?query=SPL-01
  try {
    const results = await Asset.find({ 
      name: { $regex: query, $options: 'i' } // Case-insensitive search
    });
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: "Search failed" });
  }
});

// --- 5. START SERVER ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));