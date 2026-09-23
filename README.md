# Digital Heroes — Editorial Golf Platform

![Digital Heroes](Golf.png)

> **Play Your Game. Power A Cause. Win Rewards.**

Digital Heroes is a modern full-stack golf platform designed around golf score tracking, charitable giving, monthly audited draws, memberships, and administrative management.

The project combines a premium editorial-style interface with a functional backend, authentication, role-based access, PostgreSQL data management, and production deployment.

---
## 🌐 Live Demo

**Live Application:**  
https://golfweb-hazel.vercel.app

**Backend API:**  
https://digitalheros-1tz0.onrender.com

**GitHub Repository:**  
https://github.com/AdityaSarse/DigitalHeros

---

## ✨ Features

### 👤 Member Features

- User registration and authentication
- Secure login using Supabase Authentication
- Personal member dashboard
- Golf scorecard management
- Record golf round scores
- Score history
- Latest five scores used as monthly draw entries
- View published monthly draw results
- View official winning numbers
- View prize-pool distribution
- Browse partner charities
- Designate a charity/cause
- Membership and subscription interface
- View winnings and verification information

### 🛡️ Admin Features

- Protected admin command center
- Role-based access control
- Admin authentication
- User management
- Charity management
- Monthly draw management
- Create monthly draws
- Publish winning numbers
- View draw cycles
- View registered users
- View charity information
- Verification queue
- Administrative overview dashboard

### 🎨 UI / UX

- Premium editorial golf aesthetic
- Responsive design
- Minimal monochrome visual system
- Gold accent color system
- Serif editorial typography
- Responsive navigation
- Framer Motion animations
- GSAP animations
- Responsive member dashboard
- Responsive admin dashboard

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| Frontend | React.js |
| Language | JavaScript |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| Animation | GSAP |
| Backend | Node.js |
| API | Express.js |
| Database | PostgreSQL |
| Database Platform | Supabase |
| Authentication | Supabase Auth |
| Frontend Deployment | Vercel |
| Backend Deployment | Render |

---

# 📸 Application Screenshots

## 🏠 Home Page

![Home Page](assets/Screenshot%202026-09-22%20224637.png)

The home page introduces the Digital Heroes concept with an editorial golf-inspired design.

The primary experience focuses on:

- Playing golf
- Tracking golf scores
- Supporting charitable causes
- Participating in monthly draws
- Winning rewards

The landing page uses large editorial typography, monochrome photography, gold accents, and a structured grid layout.

---

## 🎯 Member Dashboard

![Member Dashboard](assets/Screenshot%202026-09-22%20224830.png)

The member dashboard provides a centralized view of the user's activity.

It includes:

- Current monthly draw entry
- Recorded scores
- Membership status
- Designated charity
- Current draw cycle
- Total winnings
- Draw results access

---

## ⛳ Golf Scorecard

![Scorecard](assets/Screenshot%202026-09-22%20224806.png)

The scorecard allows members to record their golf rounds.

Features include:

- Score submission
- Score validation
- Score history
- Latest five scores
- Draw-entry tracking
- Score archive
- Edit score functionality
- Delete score functionality

The latest five valid scores are used as the official draw-entry balls.

---

## 🎟️ Monthly Draw Results

![Draw Results](assets/Screenshot%202026-09-22%20224849.png)

The draw results page displays published monthly draw information.

It includes:

- Draw cycle
- Total prize pool
- Official winning numbers
- Winning balls
- Prize tier distribution
- Draw archive
- Published draw status

Example prize distribution displayed in the application:

- 5 Match — Jackpot
- 4 Match — Secondary Tier
- 3 Match — Base Match Tier

---

## ❤️ Charities

![Charities](assets/Screenshot%202026-09-22%20225109.png)

The charities section allows members to browse available causes and designate a charity.

Each charity can contain information such as:

- Charity name
- Cause category
- Description
- Minimum contribution share
- Designation action

The platform is designed around connecting golf participation with charitable contribution.

---

## 👑 Membership / Patronage

![Membership](assets/Screenshot%202026-09-22%20224748.png)

The membership section provides the interface for selecting a membership plan.

It includes:

- Membership tier
- Subscription cycle
- Membership status
- Pricing information
- Plan selection

The subscription architecture is prepared for payment integration.

---

## 🛡️ Admin Command Center

![Admin Dashboard](assets/Screenshot%202026-09-22%20224701.png)

The Admin Command Center provides administrative controls for the platform.

The overview includes:

- Total users
- Active charities
- Draw cycles
- Verification queue
- Published draws
- Administrative actions

Admins can access different management sections from the command center.

---

# 🔐 Test Credentials

The following test accounts are available for reviewing the deployed application.

### Admin Account

```text
Email: test@example.com
Password: Test@12345
Role: Admin
User Account
Email: test1@example.com
Password: Test@12345
Role: User

These credentials are provided for internship assessment/testing purposes.

🔑 Authentication & Authorization

The application uses Supabase Authentication for user authentication.

The backend implements role-based authorization for protected administrative endpoints.

The application differentiates between:

USER
ADMIN

Protected admin operations require an authenticated user with the appropriate administrative role.

🔌 Backend API

The backend is built using:

Node.js
Express.js
Supabase
PostgreSQL
REST APIs

The backend handles application operations including:

Authentication
User management
Golf scores
Charities
Draws
Winning numbers
Membership-related data
Administrative operations
Backend URL

https://digitalheros-1tz0.onrender.com

🗄️ Database

The application uses PostgreSQL through Supabase.

The database is used for persistent application data including:

Users
Roles
Golf scores
Charities
Draw cycles
Winning numbers
Membership information
Application records

Supabase also provides the authentication layer used by the application.

📊 Draw System

The platform includes a monthly draw system based on member golf scores.

The basic flow is:

Member
   ↓
Record Golf Score
   ↓
Score Stored
   ↓
Latest Five Scores
   ↓
Monthly Draw Entry
   ↓
Published Draw
   ↓
Winning Numbers
   ↓
Prize Evaluation

The application displays the official winning numbers and prize distribution for published draw cycles.

❤️ Charity Flow

The charity flow connects membership activity with charitable causes.

Member
   ↓
Browse Charities
   ↓
Select Cause
   ↓
Designate Charity
   ↓
Membership Contribution
   ↓
Charitable Allocation
💳 Stripe Integration

Stripe payment processing has been kept as a planned next-phase integration.

The current application includes the membership/subscription flow and backend architecture required for the feature.

Stripe can be integrated into the existing architecture without requiring a major redesign of the application structure.

🚀 Deployment

The application is deployed using separate frontend and backend services.

Frontend

Vercel

https://golfweb-hazel.vercel.app

Backend

Render

https://digitalheros-1tz0.onrender.com

Database

Supabase PostgreSQL

Environment variables are configured separately from the source code for the deployed environments.

📁 Project Structure
DigitalHeros/
│
├── assets/
│   ├── Screenshot 2026-09-22 224637.png
│   ├── Screenshot 2026-09-22 224701.png
│   ├── Screenshot 2026-09-22 224748.png
│   ├── Screenshot 2026-09-22 224806.png
│   ├── Screenshot 2026-09-22 224830.png
│   ├── Screenshot 2026-09-22 224849.png
│   └── Screenshot 2026-09-22 225109.png
│
├── Golf.png
├── frontend/
├── backend/
└── README.md
🧩 Main Application Sections

The platform contains the following major sections:

Home
│
├── The Club
├── The Process
├── Charities
├── Draws
├── Dashboard
├── Scorecard
├── Patronage
└── Winnings

Administrative users additionally have access to:

Command Center
│
├── Overview
├── Users
├── Charities
├── Draws
└── Winners
🎨 Design System

The interface follows an editorial-inspired visual direction.

Design characteristics
Minimal layout
Large serif typography
Monospace-style labels
Fine grid lines
White / off-white backgrounds
Black typography
Gold highlights
Grayscale imagery
Structured spacing
Editorial photography
Responsive layouts

The design was created to give the platform the feel of a premium golf publication while maintaining a functional full-stack application experience.

⚙️ Local Development

Clone the repository:

git clone https://github.com/AdityaSarse/DigitalHeros.git

Move into the project:

cd DigitalHeros

Install dependencies:

npm install

Start the development server:

npm run dev

The backend should be configured with the required environment variables before running API-dependent features locally.

🔐 Environment Variables

The application uses environment variables for configuration.

Frontend environment variables include:

VITE_API_URL=
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=

Backend environment variables contain the required server-side configuration for:

Supabase
PostgreSQL
Authentication
API configuration

Sensitive keys should never be committed to GitHub.

🧪 Testing

The deployed application can be tested using the provided credentials.

Admin Testing
Email: test@example.com
Password: Test@12345

Admin functionality can be tested through:

Command Center
→ Users
→ Charities
→ Draws
→ Winners
User Testing
Email: test1@example.com
Password: Test@12345

User functionality can be tested through:

Dashboard
→ Scorecard
→ Charities
→ Draws
→ Patronage
→ Winnings
🎯 Internship Assessment

This project was developed as part of the Digital Heroes Full Stack Development Internship Technical Assessment.

The implementation demonstrates:

Full-stack development
React.js development
REST API development
Node.js and Express.js
PostgreSQL database integration
Supabase integration
Authentication
Role-based authorization
Admin functionality
CRUD operations
Responsive UI development
Modern UI/UX implementation
Animation
Production deployment
📌 Key Technical Highlights
Frontend
React.js
JavaScript
Tailwind CSS
Framer Motion
GSAP
Backend
Node.js
Express.js
REST API
Database
PostgreSQL
Supabase
Authentication
Supabase Authentication
Role-Based Access Control
Deployment
Vercel
Render
Supabase
🔗 Important Links
Live Website

https://golfweb-hazel.vercel.app

Backend API

https://digitalheros-1tz0.onrender.com

GitHub Repository

https://github.com/AdityaSarse/DigitalHeros

Portfolio

https://my-portfolio-two-alpha-15.vercel.app/

👨‍💻 Author
Aditya Sarse

Full Stack Developer & UI/UX Designer

GitHub:
https://github.com/AdityaSarse

Portfolio:
https://my-portfolio-two-alpha-15.vercel.app/

⭐ Digital Heroes

Golf · Community · Impact

Play Your Game. Power A Cause. Win Rewards.
