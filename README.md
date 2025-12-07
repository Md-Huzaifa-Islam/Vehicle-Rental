# Vehicle Rental Backend

A robust and scalable backend API for a vehicle rental management system built with Node.js, Express, and TypeScript.

## 🔗 Live URL

[https://vehiclerental-phi.vercel.app/](https://vehiclerental-phi.vercel.app/)

## ✨ Features

- **User Authentication & Authorization**

  - Secure user registration and login
  - JWT-based authentication
  - Role-based access control

- **Vehicle Management**

  - Create, read, update, and delete vehicle listings
  - Vehicle availability tracking
  - Detailed vehicle information management

- **Booking System**

  - Real-time vehicle booking
  - Booking history and management
  - Booking status tracking

- **User Management**
  - User profile management
  - User data operations
  - Secure user data handling

## 🛠️ Technology Stack

### Core Technologies

- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **TypeScript** - Type-safe JavaScript
- **PostgreSQL** - SQL database with Neon serverless platform

### Tools & Libraries

- **JWT** - JSON Web Tokens for authentication
- **Vercel** - Deployment platform
- **ESLint** - Code linting
- **Prettier** - Code formatting (if configured)

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- Node.js (v14 or higher)
- npm or yarn
- PostgreSQL database (Neon account for cloud instance)

## 🚀 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/Md-Huzaifa-Islam/Vehicle-Rental.git
cd Vehicle-Rental
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory and add the following variables:

```env
CONNECTION_URL=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

### 4. Build the Project

```bash
npm run build
```

### 5. Start the Development Server

```bash
npm run dev
```

The server will start running on `http://localhost:5000` (or your configured port).

## 📖 Usage

### API Endpoints

#### Authentication

- `POST /api/v1/auth/signup` - Register a new user
- `POST /api/v1/auth/signin` - User login

#### Vehicles

- `GET /api/v1/vehicle` - Get all vehicles
- `POST /api/v1/vehicle` - Create a new vehicle (admin)
- `PUT /api/v1/vehicle/:id` - Update vehicle details (admin)
- `DELETE /api/v1/vehicle/:id` - Delete a vehicle (admin)

#### Bookings

- `GET /api/v1/booking` - Get all bookings
- `POST /api/v1/booking` - Create a new booking
- `PUT /api/v1/booking/:id` - Update booking details
- `DELETE /api/v1/booking/:id` - Cancel a booking

#### Users

- `GET /api/v1/user` - Get user information
- `PUT /api/v1/user/:id` - Update user profile
- `DELETE /api/v1/user/:id` - Delete user account

## 📁 Project Structure

```
src/
├── api/
│   ├── api.routes.ts
│   └── v1/
│       ├── v1.routes.ts
│       ├── auth/
│       ├── booking/
│       ├── user/
│       └── vehicle/
├── config/
│   ├── config.ts
│   └── db.ts
├── middleware/
│   └── auth.ts
├── types/
│   └── express/
├── app.ts
└── server.ts
```

## 🔒 Security

- All passwords are hashed using bcrypt
- JWT tokens for secure authentication
- Protected routes with middleware authentication
- Environment variables for sensitive data

## 🚢 Deployment

This project is deployed on Vercel. To deploy your own instance:

1. Install Vercel CLI:

```bash
npm install -g vercel
```

2. Deploy:

```bash
vercel
```

## 📝 License

This project is licensed under the ISC License.

## 👤 Author

**Md Huzaifa Islam**

- GitHub: [@Md-Huzaifa-Islam](https://github.com/Md-Huzaifa-Islam)

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

⭐️ If you find this project helpful, please consider giving it a star!
