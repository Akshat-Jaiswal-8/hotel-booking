import express from "express";
import cors from "cors";
import authRoute from "./routes/auth-route.js";
import bookingRoute from "./routes/booking-route.js";
import hotelRoute from "./routes/hotel-route.js";

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 8000;

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/booking", bookingRoute);
app.use("/api/v1/hotel", hotelRoute);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
