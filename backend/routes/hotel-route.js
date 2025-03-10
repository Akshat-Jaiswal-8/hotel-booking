import express from "express";
import {
  createHotelController,
  deleteHotelController,
  getHotelController,
  getHotelsController,
  updateHotelController,
} from "../controllers/hotels-controller.js";

const router = express.Router();

router.post("/", createHotelController);
router.get("/hotels", getHotelsController);
router.get("/:hotelId", getHotelController);
router.patch("/:hotelId", updateHotelController);
router.delete("/:hotelId", deleteHotelController);

export default router;
