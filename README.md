# 🏠 Roommate Finder Application

A full-stack web application built with React and Node.js that helps users find compatible roommates based on their preferences, location, and budget.

## ✨ Features

- **User Authentication**: Secure registration and login system with JWT tokens
- **User Profile Management**: Create and update your profile with personal information
- **Modern UI/UX**: Beautiful, responsive design with smooth animations
- **Form Validation**: Client-side and server-side validation for better user experience
- **Protected Routes**: Secure profile page that requires authentication
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern UI library
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API requests
- **Vite** - Fast build tool and dev server
- **CSS3** - Custom styling with modern design patterns

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
roommate-finder/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── api/           # API configuration
│   │   ├── pages/         # Page components
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── Profile.jsx
│   │   ├── styles/        # CSS styling files
│   │   │   ├── Login.css
│   │   │   ├── Register.css
│   │   │   └── Profile.css
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Entry point
│   └── package.json
│
├── backend/                # Backend Node.js application
│   ├── config/            # Configuration files
│   │   └── db.js          # Database connection
│   ├── controllers/       # Route controllers
│   │   └── userController.js
│   ├── middleware/        # Custom middleware
│   │   └── authMiddleware.js
│   ├── models/            # Database models
│   │   └── User.js
│   ├── routes/            # API routes
│   │   └── userRoutes.js
│   ├── utils/             # Utility functions
│   │   └── generateToken.js
│   ├── server.js          # Server entry point
│   └── package.json
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance like MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd roommate-finder
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Set up environment variables**

   Create a `.env` file in the `backend` directory:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   ```


5. **Start the backend server**
   ```bash
   cd backend
   npm start
   ```
   The server will run on `http://localhost:5000`

6. **Start the frontend development server**
   ```bash
   cd client
   npm run dev
   ```
   The client will run on `http://localhost:5173` (or another port if 5173 is busy)

## 📝 API Endpoints

### Authentication

- `POST /api/users/register` - Register a new user
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "gender": "Male",
    "location": "New York",
    "budget": 1000
  }
  ```

- `POST /api/users/login` - Login user
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```

### User Profile

- `GET /api/users/:id` - Get user profile (Protected)
  - Requires: `Authorization: Bearer <token>`

- `PUT /api/users/:id` - Update user profile (Protected)
  - Requires: `Authorization: Bearer <token>`
  ```json
  {
    "name": "John Doe",
    "location": "New York",
    "budget": 1200,
    "preferences": "Non-smoker, tidy, vegetarian"
  }
  ```

## 🎨 Features in Detail

### Login Page (`/login`)
- Clean, modern design with gradient background
- Email and password authentication
- Error handling with user-friendly messages
- Link to registration page
- Automatic redirect to profile after successful login

### Register Page (`/register`)
- Comprehensive registration form
- Required field validation
- Gender selection dropdown
- Budget and location fields
- Link to login page
- Automatic token storage on successful registration

### Profile Page (`/profile`)
- Protected route (requires authentication)
- View and edit user information
- Update preferences
- Success and error message notifications
- Logout functionality
- Loading state handling

## 🔒 Security Features

- Password hashing using bcryptjs
- JWT token-based authentication
- Protected API routes
- Input validation
- Secure token storage in localStorage

## 🐛 Bug Fixes Implemented

1. **Profile Page**: Fixed null reference errors when user data is not available
2. **Authentication**: Improved error handling and user feedback
3. **Form Validation**: Added client-side validation for required fields
4. **Loading States**: Added loading indicators for better UX
5. **Error Handling**: Enhanced error messages for better user experience
6. **Token Management**: Improved token storage and retrieval logic

## 🎯 Future Enhancements

- [ ] Roommate matching algorithm
- [ ] Search and filter functionality
- [ ] Messaging system between users
- [ ] Profile image upload
- [ ] Email verification
- [ ] Password reset functionality
- [ ] Advanced preferences matching
- [ ] Favorites/bookmark system
- [ ] Reviews and ratings

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Desktop (1920px and above)
- Laptop (1024px - 1919px)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🧪 Testing

To test the application:

1. Start both backend and frontend servers
2. Navigate to `http://localhost:5173`
3. Register a new account
4. Login with your credentials
5. Update your profile information

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

Developed with ❤️ for finding perfect roommates

## 📞 Support

For support, email your-email@example.com or create an issue in the repository.

---

**Note**: Make sure to keep your `.env` file secure and never commit it to version control. Add it to your `.gitignore` file.
