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
router.get("/:userId", getBookingController);
router.patch("/checkIn", checkInController);
router.delete("/:bookingId", deleteBookingController);

export default router;
