import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Mongo Connected"))
  .catch(err => console.log("Mongo Error:", err));

// Basic model
const LocationSchema = new mongoose.Schema({
  type: String,      // "splitter", "joint", "onu"
  name: String,
  latitude: Number,
  longitude: Number,
  details: Object
});

const Location = mongoose.model("Location", LocationSchema);

// Routes
app.post("/add", async (req, res) => {
  const data = await Location.create(req.body);
  res.json({ success: true, data });
});

app.get("/all", async (req, res) => {
  const data = await Location.find();
  res.json(data);
});

app.listen(8080, () => console.log("Server running on port 8080"));
