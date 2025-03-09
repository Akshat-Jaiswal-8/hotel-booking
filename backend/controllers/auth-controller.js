import { db } from "../lib/db.js";

export const registerController = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const user = await db.User.create({
      data: {
        name,
        email,
        password,
      },
    });
    return res.status(200).send(user);
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
};
