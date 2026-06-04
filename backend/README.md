# ChurchConnect Backend API

Node.js + Express + MongoDB backend for ChurchConnect church management system.

## Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Create `.env` file:**
```bash
cp .env.example .env
```

3. **Configure environment variables:**
- `MONGODB_URI`: MongoDB connection string (default: mongodb://localhost:27017/churchconnect)
- `JWT_SECRET`: Secret key for JWT tokens
- `PORT`: Server port (default: 5000)
- `FRONTEND_URL`: Frontend URL for CORS (default: http://localhost:5173)

4. **Start MongoDB:**
```bash
# macOS with Homebrew
brew services start mongodb-community

# Or manually
mongod
```

5. **Run the server:**
```bash
# Development (with nodemon)
npm run dev

# Production
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Church
- `GET /api/church` - Get all churches
- `GET /api/church/:id` - Get church by ID
- `POST /api/church` - Create church (Admin, Pastor)
- `PUT /api/church/:id` - Update church (Admin, Pastor)
- `DELETE /api/church/:id` - Delete church (Admin)

### Members
- `GET /api/members` - Get all members
- `GET /api/members/:id` - Get member by ID
- `POST /api/members` - Create member (Admin, Pastor, Ministry Leader)
- `PUT /api/members/:id` - Update member (Admin, Pastor, Ministry Leader)
- `DELETE /api/members/:id` - Delete member (Admin, Pastor)

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get event by ID
- `POST /api/events` - Create event (Admin, Pastor, Ministry Leader)
- `PUT /api/events/:id` - Update event (Admin, Pastor, Ministry Leader)
- `DELETE /api/events/:id` - Delete event (Admin, Pastor)

### Donations (Protected)
- `GET /api/donations` - Get all donations (Admin, Pastor, Treasurer)
- `GET /api/donations/:id` - Get donation by ID (Admin, Pastor, Treasurer)
- `POST /api/donations` - Create donation (Admin, Pastor, Treasurer)
- `PUT /api/donations/:id` - Update donation (Admin, Pastor, Treasurer)
- `DELETE /api/donations/:id` - Delete donation (Admin, Treasurer)

### Ministries
- `GET /api/ministries` - Get all ministries
- `GET /api/ministries/:id` - Get ministry by ID
- `POST /api/ministries` - Create ministry (Admin, Pastor)
- `PUT /api/ministries/:id` - Update ministry (Admin, Pastor, Ministry Leader)
- `DELETE /api/ministries/:id` - Delete ministry (Admin, Pastor)

### Sermons
- `GET /api/sermons` - Get all sermons
- `GET /api/sermons/:id` - Get sermon by ID
- `POST /api/sermons` - Create sermon (Admin, Pastor)
- `PUT /api/sermons/:id` - Update sermon (Admin, Pastor)
- `DELETE /api/sermons/:id` - Delete sermon (Admin, Pastor)

### Documents
- `GET /api/documents` - Get all documents
- `GET /api/documents/:id` - Get document by ID
- `POST /api/documents` - Upload document (Admin, Pastor)
- `PUT /api/documents/:id` - Update document (Admin, Pastor)
- `DELETE /api/documents/:id` - Delete document (Admin)

### Prayer Requests
- `GET /api/prayer-requests` - Get all prayer requests
- `GET /api/prayer-requests/:id` - Get prayer request by ID
- `POST /api/prayer-requests` - Create prayer request (Authenticated)
- `PUT /api/prayer-requests/:id` - Update prayer request (Authenticated)
- `DELETE /api/prayer-requests/:id` - Delete prayer request (Authenticated)

### Community Posts
- `GET /api/posts` - Get all posts
- `GET /api/posts/:id` - Get post by ID
- `POST /api/posts` - Create post (Authenticated)
- `PUT /api/posts/:id` - Update post (Authenticated)
- `DELETE /api/posts/:id` - Delete post (Authenticated)

## Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <token>
```

Get a token by logging in:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'
```

## Role-Based Access Control

- **Admin**: Full access to all endpoints
- **Pastor**: Access to all except sensitive finance delete
- **Treasurer**: Finance and giving endpoints only
- **Ministry Leader**: Events, members, ministry management
- **Member**: Read-only access, can post prayer requests and community posts
- **Visitor**: Public endpoints only

## Project Structure

```
backend/
├── server.js              # Main server file
├── package.json           # Dependencies
├── .env.example          # Environment variables template
├── config/
│   └── db.js             # MongoDB connection
├── models/               # Mongoose schemas
├── routes/               # API routes
├── middleware/           # Auth and role middleware
└── utils/                # Utility functions (future)
```
