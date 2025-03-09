import express from "express";
import cors from "cors";
import authRoute from "./routes/authRoute.js";

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 8000;

app.use("/api/v1/auth", authRoute);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
