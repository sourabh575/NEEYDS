# 🏠 NEEYDS — Roommate & Room Finder (Full‑Stack)

NEEYDS is a full‑stack MERN application to post and browse roommate/room listings. It includes authentication, protected routes, profile management, and a clean responsive UI.

## ✨ Features

- **Authentication (JWT)**: Register/Login, protected routes, auto-logout on 401
- **Profile Management**: View & update user profile
- **Posts**: Create, browse feed, view post details, update and delete posts
- **Responsive UI**: Works seamlessly on mobile, tablet, and desktop
- **Filtering**: Filter posts by type, gender preference, budget, and location

## 🛠️ Tech Stack

### Frontend
- **React 19** + **React Router DOM**
- **Axios** for API calls
- **Vite** for build tooling
- **CSS3** for styling

### Backend
- **Node.js** + **Express 5**
- **MongoDB** + **Mongoose**
- **JWT** + **bcryptjs** for authentication
- **CORS** enabled for cross-origin requests

## 📁 Project Structure

```
roommate-finder/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── api/           # API configuration (axios.js)
│   │   ├── components/    # Reusable components (Navbar)
│   │   ├── pages/         # Page components
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Feed.jsx
│   │   │   ├── CreatePost.jsx
│   │   │   └── PostDetail.jsx
│   │   ├── styles/        # CSS styling files
│   │   ├── utils/         # Utility functions (auth.js)
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Entry point
│   ├── public/            # Static assets
│   ├── dist/              # Build output (for production)
│   ├── vite.config.js     # Vite configuration
│   └── package.json
│
├── backend/               # Backend Node.js application
│   ├── config/            # Configuration files
│   │   └── db.js          # MongoDB connection
│   ├── controllers/       # Route controllers
│   │   ├── userController.js
│   │   ├── postController.js
│   │   └── ...
│   ├── middleware/        # Custom middleware
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   ├── models/            # Database models
│   │   ├── User.js
│   │   ├── Post.js
│   │   └── ...
│   ├── routes/            # API routes
│   │   ├── user.routes.js
│   │   ├── post.routes.js
│   │   └── ...
│   ├── utils/             # Utility functions
│   │   ├── generateToken.js
│   │   └── ...
│   ├── server.js          # Server entry point
│   └── package.json
│
└── README.md
```

## 🚀 Getting Started (Local Development)

### Prerequisites

- **Node.js** (v16 or higher recommended)
- **MongoDB** (local installation or MongoDB Atlas account)
- **npm** or **yarn** package manager
- **Git** (optional, for version control)

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

   **Backend** - Create a `.env` file in the `backend` directory:
   ```env
   MONGO_URI=your_mongodb_connection_string
   
   PORT=5000
   FRONTEND_URL=http://localhost:5173
   ```

   **Frontend** - Create a `.env` file in the `client` directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

   > ⚠️ **Important**: Never commit `.env` files to version control. Add them to `.gitignore`.

5. **Start the backend server**
   ```bash
   cd backend
   npm start
   ```
   The server will run on `http://localhost:5000`

6. **Start the frontend development server** (in a new terminal)
   ```bash
   cd client
   npm run dev
   ```
   The client will run on `http://localhost:5173` (or another port if 5173 is busy)

7. **Open your browser**
   Navigate to `http://localhost:5173` to see the application.

## 📝 API Endpoints

### Authentication

- **POST** `/api/users/register` - Register a new user
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

- **POST** `/api/users/login` - Login user
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```

### User Profile

- **GET** `/api/users/profile` - Get current user profile (Protected)
  - Requires: `Authorization: Bearer <token>`

- **GET** `/api/users/:id` - Get user by ID (Protected)
  - Requires: `Authorization: Bearer <token>`

- **PUT** `/api/users/:id` - Update user profile (Protected)
  - Requires: `Authorization: Bearer <token>`
  ```json
  {
    "name": "John Doe",
    "location": "New York",
    "budget": 1200,
    "preferences": "Non-smoker, tidy, vegetarian"
  }
  ```

### Posts

- **GET** `/api/posts` - Get all posts (with optional query params)
  - Query params: `type`, `genderPref`, `budget`, `location`

- **GET** `/api/posts/:id` - Get post by ID

- **POST** `/api/posts` - Create a new post (Protected)
  - Requires: `Authorization: Bearer <token>`
  ```json
  {
    "title": "Looking for a roommate",
    "type": "join-flat",
    "rent": 8000,
    "location": "Bangalore",
    "genderPref": "male",
    "desc": "2BHK apartment, neat & calm environment."
  }
  ```

- **PUT** `/api/posts/:id` - Update post (Protected)
  - Requires: `Authorization: Bearer <token>`

- **DELETE** `/api/posts/:id` - Delete post (Protected)
  - Requires: `Authorization: Bearer <token>`

## 🌐 Deployment Guide

### Backend Deployment on Render

[Render](https://render.com) is a cloud platform that makes it easy to deploy web services.

#### Step 1: Prepare Your Backend

1. Ensure your `backend/package.json` has a `start` script:
   ```json
   {
     "scripts": {
       "start": "node server.js"
     }
   }
   ```

2. Create a `render.yaml` file in the `backend` directory (optional, for infrastructure as code):
   ```yaml
   services:
     - type: web
       name: neeyds-backend
       env: node
       buildCommand: npm install
       startCommand: npm start
       envVars:
         - key: MONGO_URI
           sync: false
         - key: JWT_SECRET
           sync: false
         - key: PORT
           value: 10000
         - key: FRONTEND_URL
           sync: false
   ```

#### Step 2: Deploy on Render

1. **Create a Render Account**
   - Go to [render.com](https://render.com) and sign up/login

2. **Create a New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository (or use public Git repository)
   - Select the repository

3. **Configure the Service**
   - **Name**: `neeyds-backend` (or your preferred name)
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Root Directory**: Leave empty (or set to `backend` if deploying from root)

4. **Set Environment Variables**
   Click "Environment" tab and add:
   - `MONGO_URI`: Your MongoDB Atlas connection string
  
   - `JWT_SECRET`: A long, random string (e.g., use `openssl rand -base64 32`)
   - `PORT`: `10000` (Render sets this automatically, but you can specify)
   - `FRONTEND_URL`: Your Vercel frontend URL (e.g., `https://your-app.vercel.app`)

5. **Deploy**
   - Click "Create Web Service"
   - Render will build and deploy your backend
   - Note the service URL (e.g., `https://neeyds-backend.onrender.com`)

#### Step 3: Update MongoDB Atlas (if using)

1. Go to your MongoDB Atlas dashboard
2. Click "Network Access"
3. Add `0.0.0.0/0` to allow all IPs (or add Render's IP ranges)
4. Ensure your database user has proper permissions

---

### Frontend Deployment on Vercel

[Vercel](https://vercel.com) is an excellent platform for deploying React applications.

#### Step 1: Prepare Your Frontend

1. Ensure your `client/package.json` has a `build` script:
   ```json
   {
     "scripts": {
       "build": "vite build"
     }
   }
   ```

2. Create a `vercel.json` file in the `client` directory (optional):
   ```json
   {
     "buildCommand": "npm run build",
     "outputDirectory": "dist",
     "devCommand": "npm run dev",
     "installCommand": "npm install",
     "framework": "vite",
     "rewrites": [
       {
         "source": "/(.*)",
         "destination": "/index.html"
       }
     ]
   }
   ```

#### Step 2: Deploy on Vercel

1. **Create a Vercel Account**
   - Go to [vercel.com](https://vercel.com) and sign up/login (GitHub integration recommended)

2. **Import Your Project**
   - Click "Add New..." → "Project"
   - Import your GitHub repository
   - Select the repository

3. **Configure the Project**
   - **Framework Preset**: Vite (or leave as "Other")
   - **Root Directory**: `client` (important!)
   - **Build Command**: `npm run build` (or leave default)
   - **Output Directory**: `dist` (Vite's default output)
   - **Install Command**: `npm install` (or leave default)

4. **Set Environment Variables**
   Click "Environment Variables" and add:
   - `VITE_API_URL`: Your Render backend URL + `/api`
     - Example: `https://neeyds-backend.onrender.com/api`

5. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy your frontend
   - Note the deployment URL (e.g., `https://neeyds.vercel.app`)

#### Step 3: Update Backend CORS

1. Go back to Render dashboard
2. Update the `FRONTEND_URL` environment variable to your Vercel URL
3. Redeploy the backend service (or it will auto-redeploy)

---

## 🔧 Environment Variables Summary

### Backend (Render)
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here
PORT=10000
FRONTEND_URL=https://your-app.vercel.app
```

### Frontend (Vercel)
```env
VITE_API_URL=https://your-backend.onrender.com/api
```

---

## 🔒 Security Notes

- ✅ Password hashing using **bcryptjs**
- ✅ **JWT token-based** authentication
- ✅ Protected API routes with middleware
- ✅ Input validation on backend
- ✅ CORS configured for production
- ✅ Environment variables for sensitive data
- ⚠️ The client stores JWT/user in `localStorage` (consider httpOnly cookies for production)
- ⚠️ Always use HTTPS in production

---

## 🧯 Troubleshooting

### Common Issues

1. **"Cannot find module" errors on Render**
   - Ensure `package.json` has all dependencies listed
   - Check that `node_modules` is not committed to Git
   - Verify build command includes `npm install`

2. **CORS errors in production**
   - Verify `FRONTEND_URL` in backend matches your Vercel URL exactly
   - Check that CORS middleware is properly configured
   - Ensure no trailing slashes in URLs

3. **MongoDB connection errors**
   - Verify `MONGO_URI` is correct
   - Check MongoDB Atlas network access (allow all IPs or specific IPs)
   - Ensure database user has proper permissions

4. **401 Unauthorized errors**
   - Check that `JWT_SECRET` is set in backend environment variables
   - Verify token is being sent in Authorization header
   - Check token expiration

5. **Blank screen after deployment**
   - Check browser console for errors
   - Verify `VITE_API_URL` is set correctly in Vercel
   - Ensure build completed successfully
   - Check that routes are properly configured

6. **Build fails on Vercel**
   - Ensure `Root Directory` is set to `client`
   - Check that `package.json` has a `build` script
   - Verify all dependencies are listed in `package.json`

---

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Desktop** (1920px and above)
- **Laptop** (1024px - 1919px)
- **Tablet** (768px - 1023px)
- **Mobile** (320px - 767px)

---

## 🧪 Quick Test Checklist

### Local Development
- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] Can register a new user
- [ ] Can login with registered user
- [ ] Can view profile
- [ ] Can create a post
- [ ] Can view feed
- [ ] Can view post details
- [ ] Can logout

### Production Deployment
- [ ] Backend deployed on Render
- [ ] Frontend deployed on Vercel
- [ ] Environment variables set correctly
- [ ] MongoDB connection working
- [ ] CORS configured properly
- [ ] All API endpoints accessible
- [ ] Authentication working
- [ ] Can create and view posts

---

## 🎯 Future Enhancements

- [ ] Roommate matching algorithm
- [ ] Advanced search and filter functionality
- [ ] Messaging system between users
- [ ] Profile image upload
- [ ] Email verification
- [ ] Password reset functionality
- [ ] Advanced preferences matching
- [ ] Favorites/bookmark system
- [ ] Reviews and ratings
- [ ] Real-time notifications
- [ ] Map integration for locations

---

## 📄 License

ISC (see `package.json`)

---

## 👨‍💻 Author

Developed with ❤️ for finding perfect roommates

---

## 📞 Support

Create a GitHub issue or PR for any questions or contributions.

---

## 🔗 Useful Links

- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [React Documentation](https://react.dev)
- [Express Documentation](https://expressjs.com)

---

**Note**: Always keep `.env` files private and never commit them to version control. Use environment variables in your deployment platforms.
