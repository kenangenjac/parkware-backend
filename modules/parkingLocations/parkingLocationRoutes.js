import { Router } from "express";

import { verifyAccessToken } from "../../middlewares/auth.js";
import {
  getParkingLocations,
  postParkingLocation,
  reserveParkingLocationSpot,
} from "./parkingLocationController.js";

const router = Router();
router.get("/", verifyAccessToken, getParkingLocations);
router.post("/", verifyAccessToken, postParkingLocation);
router.patch("/reserve", verifyAccessToken, reserveParkingLocationSpot);

export default router;
