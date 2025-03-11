# ReserveGo Frontend

A modern, responsive web application for hotel reservation management with user authentication, booking management, and check-in functionality.

## Features

- **User Authentication**: Secure login and registration system
- **Hotel Browsing**: View and search available hotels
- **Booking Management**: Create, view, and manage hotel bookings
- **Check-in System**: Simple check-in process with Aadhaar verification
- **Responsive Design**: Optimized for both desktop and mobile devices

## Tech Stack

- **React** with TypeScript
- **React Router** for navigation
- **Zustand** for state management
- **Shadcn UI** components
- **Axios** for API communication
- **React Hook Form** with Zod validation
- **Sonner** for toast notifications

## Screenshots


![Login Page](/frontend/demo-images/home.png)

![Hotels Page](/frontend/demo-images/hotels.png)

![Hotel booking Page](/frontend/demo-images/hotel-booking.png)

![Bookings Page](/frontend/demo-images/bookings.png)

![Check-in Page](/frontend/demo-images/check-in.png)


## Installation

```bash
# Clone the repository
git clone https://github.com/Akshat-Jaiswal-8/hotel-booking.git

# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Start the development server
npm run dev
```

## Usage

Navigate to `http://localhost:5173` in your browser to start using the application.

### Demo Credentials

To test the application's functionality, you can use these credentials:

```
- Email: example@example.com
- Password: example
```

## Project Structure

```
frontend/
├── src/
│   ├── components/       # Reusable UI components
│   ├── lib/              # Utility functions
│   ├── middleware/       # Middlewares
│   ├── store/            # State management
└── public/               # Static assets
```


