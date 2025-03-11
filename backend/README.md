# ReserveGo Backend API

A REST API service that powers the ReserveGo hotel reservation system, providing authentication, booking management, and hotel operations.

## Features

- **User Authentication**: Secure JWT-based authentication system
- **Hotel Management**: API endpoints to create, fetch, and manage hotels
- **Booking System**: Complete reservation workflow with creation and management
- **Check-in Verification**: Aadhaar-based identity verification for check-ins

## Tech Stack

- **Node.js** with Express
- **Postgresql** as database
- **PRISMA** as ORM
- **JWT** for authentication
- **bcrypt** for password hashing

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Hotels
- `POST /api/hotel` - Create new hotel
- `GET /api/hotel/hotels` - Get all hotels
- `GET /api/hotel/:hotelId` - Get hotel details
- `PATCH /api/hotel/:hotelId` - Update hotel details
- `DELETE /api/hotel/:hotelId` - Delete hotel

### Bookings
- `POST /api/booking` - Create new booking
- `POST /api/booking/bookings` - Get all bookings
- `GET /api/booking/:userId` - Get user's bookings
- `PATCH /api/booking/checkIn` - Process guest check-in
- `DELETE /api/booking/:bookingId` - Delete specific booking


## Installation

```bash
# Clone the repository
git clone https://github.com/Akshat-Jaiswal-8/hotel-booking.git

# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Start the development server
npm run start
```

## Environment Variables

```
PORT=your_port
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=SCHEMA
JWT_SECRET=your_jwt_secret_key
```

## Project Structure

```
backend/
├── src/
│   ├── controllers/      # Request handlers
│   ├── routes/           # API routes
│   ├── lib/              # Utility and helper functions
│   └── prisma/           # Schema
├── .env                  # Environment variables
└── server.js             # Application entry point
```

## Database Schema

The application uses PostgreSQL with the following data models defined in Prisma:

- **User**: Stores user information with unique email addresses
    - id, name, email, password, bookings (relation)

- **Hotel**: Contains hotel details
    - id, name, location, bookings (relation)

- **Booking**: Records reservation information
    - id, userId, hotelId, user (relation), hotel (relation), members (relation)

- **FamilyMember**: Stores guest information for check-in
    - id, bookingId, booking (relation), name, aadhaar, checkIn (boolean)

