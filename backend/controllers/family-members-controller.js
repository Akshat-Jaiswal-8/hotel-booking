import { db } from "../lib/db.js";

const createFamilyMemberController = async (req, res) => {
  const { name, aadhaar, bookingId } = req.body;
  try {
    const familyMember = await db.familyMember.create({
      data: {
        name,
        aadhaar,
        bookingId,
      },
    });

    return res.status(200).send(familyMember);
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
};
