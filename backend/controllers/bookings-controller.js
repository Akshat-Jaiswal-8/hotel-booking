import { db } from "../lib/db.js";

export const createBookingController = async (req, res) => {
  const { userId, hotelId, familyMembers } = req.body;

  if (!userId) {
    return res.status(400).send({ message: "User ID is required." });
  }

  if (!hotelId) {
    return res.status(400).send({ message: "Hotel ID is required." });
  }

  try {
    if (familyMembers?.length > 0) {
      const aadhaarNumbers = familyMembers.map((member) => member.aadhaar);

      const existingMembers = await db.familyMember.findMany({
        where: {
          aadhaar: {
            in: aadhaarNumbers,
          },
          booking: {
            hotelId: hotelId,
          },
        },
        include: {
          booking: true,
        },
      });

      if (existingMembers.length > 0) {
        const duplicateAadhaar = existingMembers.map(
          (member) => member.aadhaar,
        );
        return res.status(400).send({
          message:
            "One or more family members already exist in our system with these Aadhaar numbers.",
          duplicateAadhaar,
        });
      }
    }

    const booking = await db.booking.create({
      data: {
        userId,
        hotelId,
        members:
          familyMembers?.length > 0
            ? {
                create: familyMembers,
              }
            : undefined,
      },
      include: {
        members: true,
      },
    });
    return res
      .status(200)
      .send({ data: booking, message: "Booking created successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error, message: "Internal server error." });
  }
};

export const getBookingController = async (req, res) => {
  const { userId } = req.params;
  try {
    const bookings = await db.booking.findMany({
      where: { userId },
      include: { members: true },
    });
    return res
      .status(200)
      .json({ data: bookings, message: "Booking fetched successfully." });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: error, message: "Internal server error." });
  }
};

export const getAllBookingsController = async (req, res) => {
  try {
    const bookings = await db.booking.findMany({
      include: {
        members: true,
      },
    });
    return res
      .status(200)
      .json({ data: bookings, message: "Bookings fetched successfully." });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: error, message: "Internal server error." });
  }
};

export const checkInController = async (req, res) => {
  const { aadhaar, bookingId } = req.body;

  try {
    const familyMember = await db.familyMember.findFirst({
      where: { aadhaar, bookingId },
    });

    if (!familyMember) {
      return res.status(404).json({ message: "Family member not found." });
    }

    const updatedFamilyMember = await db.familyMember.update({
      where: { id: familyMember.id },
      data: { checkIn: true },
    });

    return res.status(200).json({
      data: updatedFamilyMember,
      message: "Family member checked in successfully.",
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: error.message, message: "Internal server error." });
  }
};

export const deleteBookingController = async (req, res) => {
  const { bookingId } = req.params;

  try {
    const deletedBooking = await db.booking.delete({
      where: {
        id: bookingId,
      },
    });

    if (!deletedBooking) {
      return res.status(404).json({ message: "Booking not found." });
    }

    return res
      .status(200)
      .json({ data: deletedBooking, message: "Booking deleted successfully." });
  } catch (error) {
    return res
      .status(500)
      .json({ error: error, message: "Internal server error." });
  }
};
