import { db } from "../lib/db.js";

const createBookingController = async (req, res) => {
  const { userId, hotelId } = req.body;
  try {
    const booking = await db.booking.create({
      data: {
        userId,
        hotelId,
        checkIn: true,
      },
    });
    return res.status(200).send(booking);
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
};

const getBookingsController = async (req, res) => {
  const { bookingId } = req.params;
  try {
    const members = await db.familyMember.findMany({
      where: { bookingId },
    });
    return res.status(200).json(members);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};
