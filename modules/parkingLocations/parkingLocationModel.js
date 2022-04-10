import mongoose from "mongoose";

const parkingLocationSchema = mongoose.Schema({
  location: { type: String, required: true },
  lantitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  takenSpots: { type: Number, required: true },
  totalSpots: { type: Number, required: true },
  price: { type: Number, required: true },
});

const ParkingLocation = mongoose.model(
  "ParkingLocation",
  parkingLocationSchema
);

export default ParkingLocation;
