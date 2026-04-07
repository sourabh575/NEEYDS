# 🏠 NEEYDS — Smart Roommate & Room Finder Platform

> A modern, full-stack MERN application connecting people looking for roommates and rooms with an intuitive interface and powerful filtering capabilities.

<div align="center">

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-20LTS-green?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-6.0-green?logo=mongodb)
![Vite](https://img.shields.io/badge/Vite-5.0-purple?logo=vite)
![License](https://img.shields.io/badge/License-ISC-blue)

**[Live Demo](#-deployment-guide) • [Features](#-features) • [Installation](#-installation) • [Documentation](#-documentation)**

</div>

---

## ✨ Features

### 🎯 Core Features
- **Smart Authentication System**
  - JWT-based authentication with auto-logout on token expiration
  - Secure password hashing with bcryptjs
  - Protected routes and API endpoints
  - Google OAuth integration (optional)

- **Modern Feed Interface**
  - Beautiful card-based layout with hover animations
  - Real-time image gallery with thumbnail navigation
  - User profile cards directly in feed
  - Type indicators (🏠 I Have a Room / 🔍 Need a Room)

- **Advanced Filtering**
  - Filter by post type (looking to share / looking to find)
  - Filter by gender preference
  - Budget-based filtering
  - Location-based search

- **User Profile Management**
  - View and edit user profile
  - Gender and occupation information
  - Active status indicators
  - Profile avatar support

- **Post Management**
  - Create detailed listings with photos
  - Edit and delete your posts
  - View detailed post information
  - Browse community listings

- **Fully Responsive Design**
  - Optimized for Desktop (1920px+)
  - Optimized for Laptop (1024px - 1919px)
  - Optimized for Tablet (768px - 1023px)
  - Optimized for Mobile (320px - 767px)

---

## 🎨 UI/UX Improvements (Latest Updates)

### Enhanced Feed Page
- **Modern Card Design**: Sleek cards with smooth hover animations and depth effects
- **Image Gallery Component**: Beautiful image carousel with thumbnail navigation and error handling
- **User Profile Cards**: Informative user badges showing name, age, gender, occupation, and active status
- **Gradient Backgrounds**: Eye-catching gradient UI elements throughout
- **Improved Typography**: Better font hierarchy and readability
- **Visual Feedback**: Smooth transitions and interactive elements

### Better Image Handling
- **Image Upload Integration**: Support for multiple room photos
- **Placeholder Images**: Graceful fallbacks when images aren't available
- **Gallery Navigation**: Easy image browsing with next/previous controls
- **Performance Optimized**: Lazy loading and optimized image handling

---

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern UI library
- **React Router DOM** - Client-side routing
- **Vite** - Lightning-fast build tool
- **Axios** - HTTP client
- **CSS3** - Modern styling with gradients and animations

### Backend
- **Node.js** - JavaScript runtime
- **Express 5** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Token-based authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

### Deployment
- **Render** - Backend hosting
- **Vercel** - Frontend hosting
- **MongoDB Atlas** - Cloud database

---

## 📁 Updated Project Structure

```
roommate-finder/
├── client/                           # React Frontend
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js             # API configuration
│   │   ├── components/
│   │   │   ├── UserProfileCard.jsx  # ✨ New user profile display
│   │   │   ├── ImageGallery.jsx     # ✨ New image gallery
│   │   │   ├── Navbar.jsx
│   │   │   ├── AuthNavbar.jsx
│   │   │   └── GoogleAuthButton.jsx
│   │   ├── pages/
│   │   │   ├── Feed.jsx             # 🎨 Improved with new components
│   │   │   ├── PostDetail.jsx
│   │   │   ├── CreatePost.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── VerifyEmail.jsx
│   │   │   └── Loginbygoogle.jsx
│   │   ├── styles/
│   │   │   ├── Feed.css             # 🎨 Modernized styling
│   │   │   ├── UserProfileCard.css  # ✨ New styles
│   │   │   ├── ImageGallery.css     # ✨ New styles
│   │   │   ├── CreatePost.css
│   │   │   ├── Profile.css
│   │   │   ├── Login.css
│   │   │   ├── PostDetail.css
│   │   │   └── Register.css
│   │   ├── utils/
│   │   │   └── auth.js              # Auth utilities
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── vite.config.js
│   ├── package.json
│   └── index.html
│
├── backend/                          # Node.js Backend
│   ├── config/
│   │   └── db.js                    # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js        # Auth logic
│   │   ├── userController.js        # User management
│   │   ├── postController.js        # Post management
│   │   ├── roomController.js
│   │   ├── partnerController.js
│   │   ├── pgController.js
│   │   └── googleLogin.js
│   ├── middleware/
│   │   ├── authMiddleware.js        # JWT verification
│   │   └── errorMiddleware.js       # Error handling
│   ├── models/
│   │   ├── User.js
│   │   ├── Post.js
│   │   ├── Room.js
│   │   ├── Partner.js
│   │   └── PG.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── user.routes.js
│   │   ├── post.routes.js
│   │   ├── roomRoutes.js
│   │   ├── partnerRoutes.js
│   │   └── pgRoutes.js
│   ├── utils/
│   │   ├── uploadUtils.js           # File upload handling
│   │   ├── emailService.js          # Email utilities
│   │   ├── generateToken.js
│   │   ├── tokenUtils.js
│   │   └── auth.js
│   ├── server.js
│   └── package.json
│
├── QUICK_START.md                   # Quick setup guide
├── COMPLETE_REFERENCE.md            # API Reference
├── IMPLEMENTATION_SUMMARY.md        # Feature summary
├── UPGRADE_GUIDE.md                 # Version updates
└── README.md                        # This file
```

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- **Node.js** v16+ ([Download](https://nodejs.org/))
- **MongoDB** (Local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- **npm** or **yarn** package manager
- **Git** (optional)

### Step 1: Clone & Install

```bash
# Clone repository
git clone <repository-url>
cd roommate-finder

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../client
npm install
```

### Step 2: Environment Setup

**Create `.env` file in `backend/` directory:**
```env
# MongoDB
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/<dbname>?retryWrites=true&w=majority

# Server
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=your_super_secret_jwt_key_generate_with_openssl_rand_base64_32

# CORS
FRONTEND_URL=http://localhost:5173

# Email (optional)
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

**Create `.env` file in `client/` directory:**
```env
VITE_API_URL=http://localhost:5000/api
```

### Step 3: Start Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```
✅ Backend runs on `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```
✅ Frontend runs on `http://localhost:5173`

### Step 4: Open Application
Navigate to `http://localhost:5173` in your browser

---

## 📝 API Endpoints Reference

### 🔐 Authentication Endpoints

#### Register User
```http
POST /api/users/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "gender": "Male"
}
```

#### Login
```http
POST /api/users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "63f7a1b2c4d5e6f7g8h9i0j1",
    "name": "John Doe",
    "email": "john@example.com",
    "gender": "Male"
  }
}
```

### 👤 User Endpoints

#### Get Profile
```http
GET /api/users/profile
Authorization: Bearer <token>
```

#### Update Profile
```http
PUT /api/users/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Updated",
  "gender": "Male",
  "location": "Bangalore",
  "avatar": "https://example.com/avatar.jpg"
}
```

### 📌 Post Endpoints

#### Get All Posts (with filters)
```http
GET /api/posts?type=join-my-flat&genderPref=male&budget=10000&location=Bangalore
```

#### Get Single Post
```http
GET /api/posts/:id
```

#### Create Post
```http
POST /api/posts
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Looking for Roommate",
  "type": "join-my-flat",
  "location": "Bangalore",
  "rent": 8000,
  "genderPreference": "male",
  "description": "Spacious 2BHK apartment",
  "roomType": "2BHK",
  "sharingType": "double",
  "amenities": ["wifi", "ac", "kitchen"],
  "roomPhotos": ["https://example.com/photo1.jpg"]
}
```

#### Update Post
```http
PUT /api/posts/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "rent": 9000,
  "description": "Updated description"
}
```

#### Delete Post
```http
DELETE /api/posts/:id
Authorization: Bearer <token>
```

---

## 🌐 Deployment Guide

### Deploy Backend on Render

1. **Connect Repository**
   - Go to [render.com](https://render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

2. **Configure Service**
   - **Name**: `neeyds-backend`
   - **Environment**: Node
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Root Directory**: (leave empty)

3. **Set Environment Variables**
   ```env
   MONGO_URI=mongodb+srv://...
   JWT_SECRET=your_secret_key
   PORT=10000
   FRONTEND_URL=https://your-app.vercel.app
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment
   - Note your service URL

### Deploy Frontend on Vercel

1. **Connect Repository**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New" → "Project"
   - Import your GitHub repository

2. **Configure Project**
   - **Root Directory**: `client`
   - **Framework**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

3. **Set Environment Variables**
   ```env
   VITE_API_URL=https://your-backend.onrender.com/api
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment
   - Access your live app!

---

## 🧪 Testing Checklist

### Local Development
- [ ] Backend server starts
- [ ] Frontend server starts
- [ ] Can register new account
- [ ] Can login with credentials
- [ ] JWT token stored in localStorage
- [ ] Can view profile
- [ ] Can create new post
- [ ] Can view feed with posts
- [ ] Filters work correctly
- [ ] Images display properly
- [ ] Can logout successfully

### Production
- [ ] Backend deployed on Render
- [ ] Frontend deployed on Vercel
- [ ] Environment variables configured
- [ ] MongoDB Atlas connection works
- [ ] CORS allows frontend domain
- [ ] All endpoints accessible
- [ ] Authentication working
- [ ] Image gallery functional

---

## 🔒 Security Best Practices

✅ **Implemented**
- Password hashing with bcryptjs
- JWT-based authentication
- Protected API routes
- Input validation on backend
- CORS configured for production
- Environment variables for secrets
- Secure password storage

⚠️ **Production Recommendations**
- Use HTTPS only (enforced by Vercel/Render)
- Consider httpOnly cookies for tokens
- Add rate limiting on auth endpoints
- Implement email verification
- Add request validation middleware
- Use environment secrets in CI/CD

---

## 🐛 Troubleshooting

### Backend Issues

**MongoDB Connection Error**
```
Error: connect EREFUSED localhost:27017
```
Solution: 
- Verify MongoDB is running locally OR
- Check MONGO_URI in .env for Atlas account
- Ensure IP whitelist includes your address

**Port Already in Use**
```
Error: listen EADDRINUSE :::5000
```
Solution:
```bash
# Kill process on port 5000
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

**JWT Authentication Failing**
- Verify JWT_SECRET is set in backend .env
- Check Authorization header format: `Bearer <token>`
- Ensure token hasn't expired

### Frontend Issues

**API Call Failing (CORS)**
```
Access to XMLHttpRequest blocked by CORS policy
```
Solution:
- Check FRONTEND_URL in backend .env
- Ensure VITE_API_URL in frontend .env is correct
- Clear browser cache and restart dev server

**Images Not Showing**
- Verify image URLs are accessible
- Check network tab for 403/404 errors
- Ensure image URLs support CORS

**Build Fails on Vercel**
- Ensure Root Directory is set to `client`
- Verify all imports are correct
- Check package.json has build script
- Clear cache and redeploy

---

## 📊 Project Statistics

- **Frontend Components**: 10+
- **Backend Routes**: 25+
- **Database Models**: 5
- **API Endpoints**: 20+
- **UI Improvements**: Modern gradients, animations, responsive design
- **Responsive Breakpoints**: 4 (Desktop, Laptop, Tablet, Mobile)

---

## 🎯 Roadmap & Future Enhancements

### Phase 2 (upcoming)
- [ ] Advanced matching algorithm
- [ ] Messaging system between users
- [ ] User reviews and ratings
- [ ] Favorites/bookmark functionality
- [ ] Map integration for locations
- [ ] Advanced search with "smart match"

### Phase 3
- [ ] Mobile app (React Native)
- [ ] Real-time notifications
- [ ] Payment integration
- [ ] Verified user badges
- [ ] AI-powered recommendations

---

## 📚 Documentation Files

- **[QUICK_START.md](./QUICK_START.md)** - 5-minute quick start guide
- **[COMPLETE_REFERENCE.md](./COMPLETE_REFERENCE.md)** - Complete API reference
- **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - Implementation details
- **[UPGRADE_GUIDE.md](./UPGRADE_GUIDE.md)** - Version upgrade instructions

---

## 💡 Key Technologies Explained

### Why Vite?
- ⚡ Lightning-fast HMR (Hot Module Replacement)
- 📦 Zero-config build setup
- 🚀 Optimized production builds
- 📊 Modern ES modules support

### Why MongoDB?
- 🔄 Flexible document schema
- 📈 Scales horizontally
- 🛠️ Rich query capabilities
- 🌍 Global replication support

### Why JWT?
- 🔐 Stateless authentication
- 📱 Perfect for APIs
- 🌐 Works across domains
- ⏱️ Built-in expiration

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the ISC License - see the `package.json` file for details.

---

## 👨‍💻 Author

**Sourabh Patel**
- GitHub: [@sourabh575](https://github.com/sourabh575)
- Repository: [NEEYDS](https://github.com/sourabh575/NEEYDS)

---

## 🙏 Acknowledgments

- React team for an amazing framework
- Express.js community for robust backend framework
- MongoDB for powerful database
- All contributors and testers

---

## 📞 Support & Contact

- 📧 Email: [your-email@example.com]
- 🐙 GitHub Issues: [Create an issue](https://github.com/sourabh575/NEEYDS/issues)
- 💬 Discussions: [Join discussions](https://github.com/sourabh575/NEEYDS/discussions)

---

## 🔗 Useful Resources

- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Shell Guide](https://docs.mongodb.com/mongodb-shell/)
- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com)
- [JWT.io](https://jwt.io)

---

<div align="center">

**Made with ❤️ to help people find their perfect roommate**

⭐ If you like this project, please give it a star!

</div>
