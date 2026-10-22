# NEEYDS — Roommate and Room Finder

NEEYDS is a full-stack MERN application that helps people find an available room or a compatible person to search for a room with. It turns an informal, trust-sensitive process—usually handled through WhatsApp groups or word of mouth—into structured listings, filtering, saved posts, and consent-based contact sharing.

## Interview summary

**Problem:** Finding a room or roommate is slow because information is scattered, incomplete, and contact details are often shared too early.

**Solution:** NEEYDS supports two listing types:

- **Join My Flat:** a user already has a room and wants a roommate.
- **Partner Up:** a user wants a compatible partner to look for accommodation together.

**Why it matters:** Budget, location, gender preference, occupation, move-in date, and room type make matching faster. The request-and-approval flow protects users from exposing personal phone numbers to everyone who views a listing.

## How it works

```text
React client → Express REST API → MongoDB
                   │
                   ├─ JWT authentication
                   ├─ Google identity-token verification
                   └─ Cloudinary image storage
```

1. A user registers with email/password or signs in with Google.
2. The backend hashes local passwords with bcrypt and issues a 30-day JWT.
3. The client sends the JWT as `Authorization: Bearer <token>` for protected requests.
4. A user creates a room listing with up to five room photos, or a partner listing with a profile image.
5. Other users filter and save listings, then request contact details from a post owner.
6. The owner accepts or rejects the request. Phone numbers are included only for accepted requests.

## Key features

- Email/password authentication with bcrypt hashing and JWT-protected APIs
- Google sign-in using a verified Google ID token
- Two purpose-built listing workflows with server-side validation
- Cloudinary-backed image upload, replacement, and cleanup
- Feed filters for listing type, gender preference, budget, and location
- Wishlist for saved listings
- Contact-request workflow that reveals phone numbers only after approval
- Responsive React UI with image-gallery fallbacks

## Example

Priya has an empty room in a 2BHK near Indiranagar. She creates a **Join My Flat** listing with rent of ₹15,000, room photos, amenities, and a preference for a working female roommate.

Ananya filters the feed by location and budget, saves Priya's listing, then sends an interest request. Priya sees the request in **Requests** and accepts it. Only then do both users see each other's phone number, so they can arrange a viewing.

## Tech stack

| Layer | Technology | Role |
| --- | --- | --- |
| Frontend | React 19, React Router, Vite, Axios | Single-page UI, routing, API communication |
| Backend | Node.js, Express 5 | REST endpoints and business rules |
| Database | MongoDB with Mongoose | Users, listings, wishlists, and contact requests |
| Auth | JWT, bcryptjs, Google Auth Library | Authenticated and secure access |
| Media | Multer, Cloudinary | Image validation and storage |

## Project structure

```text
client/                 React application
  src/pages/            Login, profile, feed, listing, wishlist, requests
  src/components/       Navigation, cards, image gallery
  src/api/axios.js      Shared API client and auth interceptor
backend/                Express API
  controllers/          Authentication, users, posts, wishlist, requests
  models/               Mongoose schemas
  routes/               REST route definitions
  middleware/           JWT protection and upload handling
```

## Run locally

Prerequisites: Node.js 20+ and a MongoDB database. You also need a Cloudinary account for image uploads; Google login is optional.

```bash
cd backend
npm install

cd ../client
npm install
```

Create `backend/.env`:

```env
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>/<database>
JWT_SECRET=<long-random-secret>
PORT=5000
CLOUDINARY_CLOUD_NAME=<cloud-name>
CLOUDINARY_API_KEY=<api-key>
CLOUDINARY_API_SECRET=<api-secret>
GOOGLE_CLIENT_ID=<optional-google-client-id>
```

Create `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=<optional-google-client-id>
```

Start the backend and frontend in separate terminals:

```bash
cd backend
npm start
```

```bash
cd client
npm run dev
```

## Deploy to Render and Vercel

This repository is split into two deployments: the Express API on Render and the Vite single-page app on Vercel. Deploy each from the repository root with the service root directory set as shown below. Do not commit `.env` files or paste secret values into the Vercel frontend environment; Vite variables are public in the built JavaScript.

### Render API

Create a Render Blueprint from this repository using the root `render.yaml`, or create a **Web Service** manually with:

- Root directory: `backend`
- Runtime: Node
- Build command: `npm ci`
- Start command: `npm start`
- Health check path: `/health`

Set `MONGO_URI` to your MongoDB Atlas connection string and `JWT_SECRET` to a long random secret. Set `FRONTEND_URL` to the deployed Vercel origin, for example `https://your-project.vercel.app` (no trailing slash). Set `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` for image uploads. Google login needs `GOOGLE_CLIENT_ID`; email verification needs `RESEND_API_KEY`, `FROM_EMAIL`, and `FRONTEND_URL`. Render provides `PORT` automatically.

In MongoDB Atlas, allow connections from Render (for a quick setup, `0.0.0.0/0` with a strong database password; restrict further if you have stable outbound IPs). Configure the Google OAuth authorized JavaScript origins with the Vercel domain and add the matching client ID to both services.

### Vercel frontend

Import this repository as a Vercel project and set:

- Root directory: `client`
- Framework preset: Vite
- Build command: `npm run build`
- Output directory: `dist`
- Install command: `npm ci`

Set `VITE_API_URL` to `https://<your-render-service>.onrender.com/api` and `VITE_GOOGLE_CLIENT_ID` to the same Google OAuth client ID used on Render. Redeploy after setting environment variables. The `client/vercel.json` rewrite supports client-side routes.

After the first Vercel deploy, copy its production origin into Render's `FRONTEND_URL`, then redeploy/restart the Render service. If you use a custom Vercel domain, update `FRONTEND_URL` to that origin too. Test `/health`, signup/login, image upload, and a nested route after both deployments finish.

### Before deploying

- Ensure the repository has the latest intended changes committed and pushed. This working tree already contains other uncommitted changes; review them before deploying.
- Rotate any secrets that have ever been committed or shared, and keep production values in the hosting providers' environment settings.
- `backend/.env.example` documents the variables the API reads. `client/.env.example` documents the two `VITE_` variables; set the production API URL there in Vercel rather than using the local fallback.
- Render's free web services may sleep when idle; the first request after inactivity can be slow. Choose a paid instance if that delay is unsuitable.

## API examples

Register a user:

```http
POST /api/users/register
Content-Type: application/json

{
  "name": "Ananya Sharma",
  "email": "ananya@example.com",
  "password": "a-strong-password",
  "phone": "9876543210"
}
```

Create a contact request:

```http
POST /api/contact-request/send
Authorization: Bearer <jwt>
Content-Type: application/json

{ "receiverId": "<post-owner-id>", "postId": "<post-id>" }
```

## Design and security decisions to discuss

- Passwords are never stored in plain text; bcrypt hashes them before persistence.
- The backend verifies JWTs and authorizes ownership before profile or post updates.
- The server checks that a request targets the post owner and prevents self-requests and duplicates.
- Phone numbers are removed from pending and rejected request responses.
- Image uploads accept image MIME types only, cap each image at 5 MB, and limit a listing to five files.
- Replacing an image saves the database update before old Cloudinary assets are deleted. Failed updates clean up newly uploaded files to prevent orphaned media.

## Recent maintenance fixes

- Profile `age` and `location` are now persisted; previously the UI collected them but the server discarded them.
- The client has a local API URL fallback for development when `VITE_API_URL` is absent.
- Listing type is immutable after creation, preventing inconsistent data between the two listing models.
- The frontend lint check is clean.

## Useful commands

```bash
cd client && npm run lint
cd client && npm run build
cd backend && npm start
```
