import mongoose from "mongoose";

const deviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true }, // splitter | junction | closure | onu | customer
  latitude: Number,
  longitude: Number,
  description: String,
});

export default mongoose.model("Device", deviceSchema);
