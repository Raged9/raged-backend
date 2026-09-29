# edgar-portfolio-backend

REST API backend for Edgar ("Raged") Portfolio website. Built with Node.js, Express, and TypeScript.

## Features

- **Projects CMS API**: Endpoints to fetch, create, update, and delete portfolio projects.
- **Typing Scores Leaderboard API**: Record and retrieve high scores for the retro typewriter typing game.
- **Admin Authentication**: JWT-based secure authentication for portfolio dashboard management.
- **Contact API**: Handles contact message submissions with validation.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript (executed with `tsx`)
- **Authentication**: JSON Web Tokens (`jsonwebtoken`)
- **Data Persistence**: JSON-based storage engine with auto-seeding

## Getting Started

### 1. Installation

```bash
npm install
```

### 2. Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Adjust variables in `.env` as needed:

```env
PORT=5000
CORS_ORIGIN=http://localhost:3000
JWT_SECRET=your_secret_key_here
ADMIN_EMAIL=edgar@portfolio.dev
ADMIN_PASSWORD=your_secure_password
```

### 3. Run Development Server

```bash
npm run dev
```

The API will be available at `http://localhost:5000`.

### 4. Build for Production

```bash
npm run build
npm start
```
