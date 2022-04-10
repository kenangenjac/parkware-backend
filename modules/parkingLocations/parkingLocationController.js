import express from "express";
import mongoose from "mongoose";

import ParkingLocation from "./parkingLocationModel.js";

const router = express.Router();

export const getParkingLocations = async (req, res) => {
  try {
    const parkingLocation = await ParkingLocation.find();

    res.status(200).json(parkingLocation);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const postParkingLocation = async (req, res) => {
  const { location, lantitude, longitude, takenSpots, totalSpots, price } =
    req.body;

  const newParkingLocation = new ParkingLocation({
    location,
    lantitude,
    longitude,
    takenSpots,
    totalSpots,
    price,
  });

  try {
    await newParkingLocation.save();

    res.status(201).json(newParkingLocation);
  } catch (error) {
    res.status(409).json({ message: "Something went wrong" });
  }
};

export const reserveParkingLocationSpot = async (req, res) => {
  const { id } = req.body;

  try {
    const parkingLocation = await ParkingLocation.findById(id);

    if (!parkingLocation)
      return res.status(404).json({ message: "Parking location not found" });

    if (parkingLocation.takenSpots >= parkingLocation.totalSpots)
      return res.status(400).json({ message: "Parking location full" });

    const newParkingLocation = await ParkingLocation.updateOne(
      { id: id },
      { takenSpots: parkingLocation.takenSpots + 1 }
    );

    res.status(201).json(newParkingLocation);
  } catch (error) {
    res.status(409).json({ message: "Something went wrong" });
  }
};

export default router;
