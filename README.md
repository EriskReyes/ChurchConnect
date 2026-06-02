Exacto. Aquí tienes el `README.md` limpio, hablando solo del proyecto, sin decir que es para portafolio ni aprendizaje.

# ChurchConnect

ChurchConnect is a full-stack web application for church administration and Christian community management.

The platform is designed to help churches manage events, members, staff, ministries, donations, documents, flyers, image galleries, sermons, prayer requests and community interaction in one place.

ChurchConnect combines church administration with a Christian community platform.

---

## Project Overview

Churches often need to organize many areas at the same time.

They manage events, members, donations, staff, ministries, documents, flyers, images, sermons and internal communication.

ChurchConnect provides one central system where these areas can be managed in a structured and modern way.

The application is planned as a full-stack system with frontend, backend, database, authentication, file upload and role-based permissions.

---

## Main Areas

ChurchConnect is divided into two main areas:

```txt
1. Church Administration
2. Christian Community Platform
```

The administration area is used by pastors, admins, treasurers and ministry leaders.

The community area is used by members to see events, read posts, share prayer requests and access church material.

---

## Main Modules

The application includes the following modules:

```txt
Dashboard
Authentication
Roles and permissions
Church management
Event management
Member management
Staff management
Ministry management
Donations and collections
Documents
Flyers
Image gallery
Sermons
Prayer requests
Christian community posts
Comments and likes
Chat
Notifications
Reports
Admin settings
```

---

## Dashboard

The dashboard gives an overview of the church activity.

Planned dashboard information:

```txt
Total members
Upcoming events
Total donations
Active ministries
Latest uploaded documents
Latest flyers
Latest community posts
Recent prayer requests
Financial overview
```

---

## Authentication

The application includes a login system.

Planned authentication features:

```txt
Register church account
Login
Logout
Protected pages
User session
Password security
Role-based access
```

The system controls what each user can access depending on the assigned role.

---

## Roles and Permissions

ChurchConnect uses roles to control access inside the application.

| Role            | Permissions                                         |
| --------------- | --------------------------------------------------- |
| Pastor          | Full access to all areas                            |
| Admin           | Manage users, events, files and settings            |
| Treasurer       | Manage donations, collections and financial reports |
| Ministry Leader | Manage ministry events and ministry files           |
| Staff           | Help with selected administrative tasks             |
| Member          | View events, files and community posts              |
| Visitor         | View public information only                        |

Example logic:

```js
if (user.role === "Pastor") {
  // user can access all areas
}
```

---

## Church Management

The church management module stores basic church information.

Planned church data:

```txt
Church name
Address
Contact email
Phone number
Website
Pastor name
Church logo
Church description
```

This module allows the system to manage one church first and later support multiple churches.

---

## Event Management

The event section is used to manage church events.

Example events:

```txt
Sunday sermon
Worship night
Prayer meeting
Baptism
Youth meeting
Music rehearsal
Bible study
Conference
Leadership meeting
```

Planned functions:

```txt
Show event list
Create event
Edit event
Delete event
Filter events by type
Filter events by date
Connect flyers to events
Connect documents to events
Connect images to events
Show event details
Show event leader
```

---

## Member Management

The member section is used to manage people inside the church.

Planned functions:

```txt
Show member list
Add new member
Edit member information
Delete member
Assign role
Assign ministry
Search members
Filter members by ministry
Show member details
```

Planned member data:

```txt
Name
Email
Phone
Role
Ministry
Status
Baptism status
Join date
```

---

## Staff Management

The staff section is used to manage people who serve in the church.

Example staff roles:

```txt
Pastor
Assistant pastor
Worship leader
Youth leader
Children ministry leader
Treasurer
Media team
Administrator
```

Planned functions:

```txt
Create staff profile
Assign responsibilities
Connect staff to events
Connect staff to ministries
Manage availability
```

---

## Ministry Management

The ministry section helps organize the different areas of church service.

Example ministries:

```txt
Worship
Youth
Children
Prayer
Evangelism
Media
Teaching
Administration
```

Planned functions:

```txt
Create ministry
Edit ministry
Assign leader
Assign members
Connect events to ministry
Connect files to ministry
```

---

## Donations and Collections

The donation section is used to register church financial records.

Planned functions:

```txt
Register donation
Register Sunday collection
Register special collection
Register event donation
Show total amount
Show donation history
Filter by date
Filter by type
Generate simple reports
```

Example donation record:

```txt
Date: 2026-06-07
Type: Sunday Collection
Amount: 250 CHF
Registered by: Treasurer
```

Important:

The first version does not store bank card data or real payment information.

Financial data should only be visible to authorized roles such as pastor, admin and treasurer.

---

## Documents

The document section is used to manage church files.

Example documents:

```txt
Sermon notes
Baptism documents
Ministry documents
Teaching material
Internal documents
PDF files
Event documents
```

Planned functions:

```txt
Upload document
Show document list
Download document
Delete document
Organize documents by category
Connect documents to events
Connect documents to ministries
```

---

## Flyers

The flyer section is used to manage church flyers.

Example flyers:

```txt
Event flyer
Baptism flyer
Worship night flyer
Youth event flyer
Conference flyer
Prayer meeting flyer
```

Planned functions:

```txt
Upload flyer
Show flyer list
Preview flyer
Delete flyer
Connect flyer to event
Share flyer in community posts
```

---

## Image Gallery

The image gallery is used to organize church images.

Example images:

```txt
Event photos
Worship night photos
Baptism photos
Community photos
Ministry photos
```

Planned functions:

```txt
Upload image
Show image gallery
Preview image
Delete image
Filter images by event
Filter images by ministry
Connect images to community posts
```

---

## Sermons

The sermon section is used to manage sermon material.

Planned functions:

```txt
Create sermon entry
Add title
Add speaker
Add date
Add Bible verse
Add notes
Upload sermon document
Connect sermon to event
```

Example sermon data:

```txt
Title: Faith in Difficult Times
Speaker: Pastor John
Date: 2026-06-07
Bible Verse: Romans 10:17
```

---

## Prayer Requests

The prayer request section allows members to share prayer needs.

Planned functions:

```txt
Create prayer request
Show prayer requests
Mark request as answered
Comment on prayer request
Set request as public or private
```

Privacy is important in this module.

Some prayer requests should only be visible to pastors or trusted leaders.

---

## Christian Community

The community area is a Christian social space inside the application.

Planned functions:

```txt
Create posts
Read posts
Like posts
Comment posts
Share church images
Share event flyers
Share prayer requests
Show posts from church members
```

This area works like a small Christian community feed for the church.

---

## Chat

The chat feature is planned for direct and group communication.

Planned functions:

```txt
Private messages
Group messages
Ministry group chats
Event group chats
```

The chat module requires secure user access, privacy control and real-time functionality.

---

## Notifications

The notification system informs users about important activity.

Planned notifications:

```txt
New event
Event reminder
New prayer request
New document
New flyer
New community post
Donation report reminder
```

---

## Reports

The report section is planned for pastors, admins and treasurers.

Planned reports:

```txt
Donation reports
Event reports
Member reports
Ministry reports
Attendance reports
Document activity reports
```

---

## Tech Stack

### Frontend

| Technology         | Purpose                      |
| ------------------ | ---------------------------- |
| React              | Frontend framework           |
| JavaScript         | Programming language         |
| Tailwind CSS       | Styling                      |
| React Router       | Page navigation              |
| Axios or Fetch API | API requests                 |
| localStorage       | Temporary local data storage |

---

### Backend

| Technology                       | Purpose                                    |
| -------------------------------- | ------------------------------------------ |
| Node.js / Express or Spring Boot | Backend API                                |
| REST API                         | Communication between frontend and backend |
| JWT                              | Authentication                             |
| bcrypt                           | Password hashing                           |
| Middleware                       | Route protection and permissions           |

Possible backend options:

```txt
Node.js with Express
Spring Boot with Java
```

---

### Database

| Technology | Purpose                  |
| ---------- | ------------------------ |
| PostgreSQL | Main relational database |

Planned database tables:

```txt
churches
users
roles
permissions
members
staff
ministries
events
donations
documents
flyers
images
sermons
prayer_requests
posts
comments
likes
messages
notifications
```

---

### File Storage

| Technology                        | Purpose                         |
| --------------------------------- | ------------------------------- |
| Firebase Storage or Cloud Storage | Store uploaded files and images |

Planned uploaded file types:

```txt
PDF
JPG
PNG
WEBP
DOCX
```

---

### DevOps

| Technology                | Purpose                       |
| ------------------------- | ----------------------------- |
| GitHub                    | Source code repository        |
| GitHub Actions            | CI/CD pipeline                |
| Docker                    | Containerization              |
| Docker Compose            | Local development environment |
| Vercel                    | Frontend deployment           |
| Render or Railway         | Backend deployment            |
| PostgreSQL Cloud Database | Production database           |

---

## Full Project Architecture

```txt
User
 │
 ▼
Frontend Application
React / Tailwind CSS
 │
 ▼
Backend API
Node.js / Express or Spring Boot
 │
 ├── Authentication
 ├── Role Permissions
 ├── Event Service
 ├── Member Service
 ├── Donation Service
 ├── Media Service
 ├── Community Service
 │
 ▼
Database
PostgreSQL
 │
 ▼
File Storage
Firebase Storage or Cloud Storage
```

---

## Planned Pages

```txt
/login
/register
/dashboard
/church
/events
/events/:id
/members
/members/:id
/staff
/ministries
/donations
/documents
/flyers
/gallery
/sermons
/prayer-requests
/community
/chat
/reports
/settings
```

---

## Example Data Models

### User

```js
const user = {
  id: 1,
  name: "John Smith",
  email: "user@example.com",
  role: "Admin",
  churchId: 1
};
```

### Event

```js
const event = {
  id: 1,
  title: "Sunday Sermon",
  type: "Sermon",
  date: "2026-06-07",
  leader: "Pastor John",
  churchId: 1
};
```

### Donation

```js
const donation = {
  id: 1,
  type: "Sunday Collection",
  amount: 250,
  currency: "CHF",
  date: "2026-06-07",
  registeredBy: "Treasurer",
  churchId: 1
};
```

### Media File

```js
const mediaFile = {
  id: 1,
  title: "Baptism Flyer",
  type: "Flyer",
  fileType: "PDF",
  category: "Baptism",
  url: "/files/baptism-flyer.pdf",
  eventId: 1,
  churchId: 1
};
```

### Community Post

```js
const post = {
  id: 1,
  author: "Maria Lopez",
  content: "God has been good this week.",
  likes: 12,
  churchId: 1
};
```

---

## Planned API Endpoints

### Auth

```txt
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
```

### Users

```txt
GET    /api/users
GET    /api/users/:id
POST   /api/users
PUT    /api/users/:id
DELETE /api/users/:id
```

### Events

```txt
GET    /api/events
GET    /api/events/:id
POST   /api/events
PUT    /api/events/:id
DELETE /api/events/:id
```

### Members

```txt
GET    /api/members
GET    /api/members/:id
POST   /api/members
PUT    /api/members/:id
DELETE /api/members/:id
```

### Donations

```txt
GET    /api/donations
GET    /api/donations/:id
POST   /api/donations
PUT    /api/donations/:id
DELETE /api/donations/:id
```

### Media

```txt
GET    /api/media
GET    /api/media/:id
POST   /api/media/upload
DELETE /api/media/:id
```

### Community

```txt
GET    /api/posts
POST   /api/posts
PUT    /api/posts/:id
DELETE /api/posts/:id
POST   /api/posts/:id/like
POST   /api/posts/:id/comments
```

### Prayer Requests

```txt
GET    /api/prayer-requests
POST   /api/prayer-requests
PUT    /api/prayer-requests/:id
DELETE /api/prayer-requests/:id
```

---

## Security Considerations

Security is important because the application can contain personal data, church information and financial records.

Planned security features:

```txt
Password hashing
JWT authentication
Protected routes
Role-based permissions
Input validation
File type validation
File size limits
Private prayer requests
Restricted financial access
Secure backend endpoints
```

The application should not expose sensitive financial or personal data to users without permission.

---

## Development Roadmap

### Phase 1: Project Setup

```txt
Create GitHub repository
Create frontend project
Create project structure
Add README documentation
Add basic routing
Add layout and navigation
```

### Phase 2: Frontend Prototype

```txt
Build dashboard page
Build event page
Build member page
Build donation page
Build document page
Build flyer page
Build gallery page
Build community page
Add mock data
Add basic role logic
```

### Phase 3: Local Frontend Functions

```txt
Create event function
Delete event function
Create member function
Register donation function
Add document list
Add flyer list
Add image gallery
Save temporary data in localStorage
```

### Phase 4: Backend API

```txt
Create backend project
Create REST API structure
Create auth routes
Create event routes
Create member routes
Create donation routes
Create media routes
Create community routes
Add validation
Add error handling
```

### Phase 5: Database

```txt
Design database schema
Create PostgreSQL database
Create user table
Create role table
Create event table
Create member table
Create donation table
Create media table
Create post table
Connect backend to database
```

### Phase 6: Authentication and Permissions

```txt
Add register function
Add login function
Add logout function
Add JWT authentication
Add protected routes
Add role-based access control
Restrict financial pages
Restrict admin pages
```

### Phase 7: File and Image Upload

```txt
Add document upload
Add flyer upload
Add image upload
Add file validation
Add image preview
Add PDF download
Connect files with events
Connect files with ministries
Connect upload with Firebase Storage or Cloud Storage
```

### Phase 8: Community Features

```txt
Add community posts
Add comments
Add likes
Add prayer requests
Add image sharing
Add public and private posts
```

### Phase 9: Advanced Features

```txt
Add chat
Add notifications
Add reports
Add admin settings
Add church settings
Add multi-church support
Add CI/CD pipeline
Add Docker support
```

---

## How to Run the Project

Clone the repository:

```bash
git clone https://github.com/YOUR-USERNAME/churchconnect.git
```

Go into the project folder:

```bash
cd churchconnect
```

Install frontend dependencies:

```bash
npm install
```

Start the frontend development server:

```bash
npm run dev
```

Open the app in the browser:

```txt
http://localhost:5173
```

Backend setup will be added when the backend is implemented.

---

## Future Full-Stack Structure

The project may use this structure:

```txt
churchconnect/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── src/
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   └── package.json
│
├── database/
│   └── schema.sql
│
├── docs/
│   └── architecture.md
│
├── docker-compose.yml
└── README.md
```

---

## Project Status

ChurchConnect is currently in development.

The complete project idea is documented in this README.

The application will be implemented step by step with frontend, backend, database, authentication, permissions, file upload, community features and reports.

---

## Author

Created by Rigo Erisk Reyes.
