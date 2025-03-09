import { db } from "../lib/db.js";

export const hotelCreateController = async (req, res) => {
  const { name, location } = req.body;
  try {
    const hotel = await db.hotel.create({
      data: {
        name,
        location,
      },
    });
    return res.status(200).send(hotel);
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
};
