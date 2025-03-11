import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Hero } from "@/components/hero.tsx";
import { Navbar } from "@/components/navbar.tsx";
import { Footer } from "@/components/footer.tsx";
import { Login } from "@/components/login.tsx";
import { Register } from "@/components/register.tsx";
import { Hotel } from "@/components/hotel.tsx";
import { Booking } from "@/components/booking.tsx";
import AuthMiddleware from "@/middleware/auth-middleware.tsx";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Hero />} />

        <Route
          path="/hotels"
          element={
            <AuthMiddleware>
              <Hotel />
            </AuthMiddleware>
          }
        />
        <Route
          path="/bookings"
          element={
            <AuthMiddleware>
              <Booking />
            </AuthMiddleware>
          }
        />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
