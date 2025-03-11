type User = {
  id: string;
  email: string;
  name: string;
};

interface AuthStore {
  user: User | null;
  setUser: (user: User) => void;
  logout: () => void;
}

interface Hotel {
  id: string;
  name: string;
  location: string;
}

type Booking = {
  id: string;
  userId: string;
  hotelId: string;
  members: Member[];
};

type Member = {
  id: string;
  bookingId: string;
  name: string;
  aadhaar: string;
  checkIn: boolean;
};

type BookingsResponse = {
  data: Booking[];
  message: string;
};
