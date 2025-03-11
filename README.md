# Hotel Booking System

A full-stack web application for hotel reservation management with user authentication, booking management, and check-in functionality.

## Project Overview

This monorepo contains both frontend and backend applications for the ReserveGo hotel booking system:

- **Frontend**: React-based UI with authentication, hotel browsing, booking management, and check-in functionality
- **Backend**: Express REST API with JWT authentication, PostgreSQL database, and Prisma ORM

## Repository Structure

```
hotel-booking/
├── frontend/             # React frontend application
├── backend/              # Node.js backend application
├── package.json          # Root package.json for project scripts
└── README.md             # This file
```

## Quick Start

### Prerequisites

- Node.js (v16+)
- npm
- PostgreSQL database

### Installation

```bash
# Clone the repository
git clone https://github.com/Akshat-Jaiswal-8/hotel-booking.git

# Install root dependencies
npm install

# Install frontend and backend dependencies
cd frontend/ && npm install
cd ..
cd backend/ && npm install
```

### Configuration

1. Create and configure backend environment variables:
```bash
cd backend
cp .env.example .env
# Edit .env with your database and JWT settings
```

2. Create and configure frontend environment variables:
```bash
cd frontend
cp .env.example .env
```

### Running the Application

From the root directory, run:

```bash
# Start both frontend and backend concurrently
npm run start

# Or start them individually:
npm run start-server  # Backend only
npm run start-client  # Frontend only
```

- Frontend will be available at: http://localhost:5173
- Backend API will be available at: http://localhost:8080/api/v1

## Demo Credentials

```
Email: example@example.com
Password: example
```

## Tech Stack

### Frontend
- React with TypeScript
- React Router
- Zustand for state management
- Shadcn UI components
- Axios for API communication

### Backend
- Node.js with Express
- PostgreSQL with Prisma ORM
- JWT authentication
- bcrypt for password hashing


## Author

Akshat Jaiswal
<br/>
[Mail](mailto:akshatjaiswal.official@gmail.com)
