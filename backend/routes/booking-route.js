import express from "express";

import {
  checkInController,
  createBookingController,
  deleteBookingController,
  getAllBookingsController,
  getBookingController,
} from "../controllers/bookings-controller.js";

const router = express.Router();

router.post("/", createBookingController);
router.get("/bookings", getAllBookingsController);
router.get("/:bookingId", getBookingController);
router.patch("/:bookingId", checkInController);
router.delete("/:bookingId", deleteBookingController);

export default router;
