# Purple - Social Media Application

A full-stack social media application built with React, Node.js, Express, and Prisma.

## Project Structure

- **frontend/**: React application (Vite)
- **backend/**: Node.js/Express API with Prisma ORM

## Getting Started

### Prerequisites

- Node.js (v16+)
- MySQL Database

### Backend Setup

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `backend` directory with the following variables:
    ```env
    PORT=3001
    DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"
    ACCESS_TOKEN_SECRET="your_access_token_secret"
    REFRESH_TOKEN_SECRET="your_refresh_token_secret"
    NODE_ENV="development" # Set to "production" when deploying
    ```
4.  Run database migrations:
    ```bash
    npx prisma migrate dev
    ```
5.  Start the server:
    ```bash
    npm start
    ```

### Frontend Setup

1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env.local` file in the `frontend` directory for local development:
    ```env
    VITE_API_URL=http://localhost:3001
    ```
4.  Start the development server:
    ```bash
    npm run dev
    ```
5.  Open `http://localhost:5173` in your browser.

## Features

- User Authentication (Login/Register/Logout) with HttpOnly Cookies
- Post Creation with Image Upload
- Profile Management
- Comments and Likes
- Real-time features (planned/in-progress)

## Deployment

### Backend (Render/Heroku/etc.)

- Ensure `NODE_ENV` is set to `production`.
- Set `DATABASE_URL`, `ACCESS_TOKEN_SECRET`, and `REFRESH_TOKEN_SECRET` in your hosting provider's environment variables.
- The application uses `SameSite=None; Secure` cookies in production to support cross-site requests.

### Frontend (Cloudflare Pages/Vercel/Netlify)

- Set the `VITE_API_URL` environment variable to your deployed backend URL (e.g., `https://purple-lfdw.onrender.com`).
- Build command: `npm run build`
- Output directory: `dist`
