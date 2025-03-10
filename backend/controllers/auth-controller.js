import { db } from "../lib/db.js";
import { comparePassword, hashPassword } from "../lib/auth-helper.js";
import JWT from "jsonwebtoken";

export const registerController = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).send("All fields are required");
  }

  const existingUser = await db.User.findUnique({
    where: {
      email,
    },
  });
  if (existingUser) {
    return res.status(400).send("User already exists.");
  }

  const hashedPassword = await hashPassword(password);

  try {
    const user = await db.User.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
    return res.status(200).send({
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      message: "User created successfully.",
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ data: error, message: "Internal server error." });
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(401).send({
        success: false,
        message: "Invalid user",
      });
    }

    const user = await db.User.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(404).send({
        message: "User not found.",
      });
    }

    const match = await comparePassword(password, user.password);

    if (!match) {
      return res.status(200).send({
        message: "Invalid password",
      });
    }

    const token = await JWT.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).send({
      message: "Login successfully.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Login Failed",
      error,
    });
  }
};
