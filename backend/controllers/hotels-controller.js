import { db } from "../lib/db.js";

export const createHotelController = async (req, res) => {
  const { hotelName, hotelLocation } = req.body;

  if (!hotelLocation || !hotelName) {
    return res.status(400).send({ message: "All fields are required." });
  }

  try {
    const hotel = await db.hotel.create({
      data: {
        name: hotelName,
        location: hotelLocation,
      },
    });
    return res
      .status(200)
      .send({ data: hotel, message: "Hotel created successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error, message: "Internal server error." });
  }
};

export const getHotelsController = async (req, res) => {
  try {
    const hotels = await db.hotel.findMany();
    return res
      .status(200)
      .json({ data: hotels, message: "Hotels fetched successfully." });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: error, message: "Internal server error." });
  }
};

export const getHotelController = async (req, res) => {
  const { hotelId } = req.params;
  try {
    const hotel = await db.hotel.findUnique({
      where: { id: hotelId },
    });
    return res
      .status(200)
      .json({ data: hotel, message: "Hotel fetched successfully." });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: error, message: "Internal server error." });
  }
};

export const updateHotelController = async (req, res) => {
  const { hotelId } = req.params;
  const { hotelName, hotelLocation } = req.body;

  if (!hotelId)
    return res.status(400).send({ message: "Hotel ID is required." });
  try {
    const updatedHotel = await prisma.hotel.update({
      where: { id: hotelId },
      data: {
        ...(hotelName && { name: hotelName }),
        ...(hotelLocation && { location: hotelLocation }),
      },
    });

    if (!updatedHotel)
      return res.status(404).send({ message: "Hotel not found." });

    return res.status(200).json({
      data: updatedHotel,
      message: "Hotel updated successfully.",
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: error, message: "Internal server error." });
  }
};

export const deleteHotelController = async (req, res) => {
  const { hotelId } = req.params;

  try {
    const deletedHotel = await db.hotel.delete({
      where: {
        id: hotelId,
      },
    });

    if (!deletedHotel) {
      return res.status(404).json({ message: "Hotel not found." });
    }

    return res
      .status(200)
      .json({ data: deletedHotel, message: "Hotel deleted successfully." });
  } catch (error) {
    return res
      .status(500)
      .json({ error: error, message: "Internal server error." });
  }
};
