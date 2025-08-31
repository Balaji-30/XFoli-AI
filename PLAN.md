# Project Plan: AI Portfolio Agent

### 1. Project Overview

This document outlines the step-by-step implementation plan for building a full-stack AI Portfolio Agent application. The application will allow users to track their stock portfolios and leverage a sophisticated AI agent to get intelligent, narrative summaries of market performance. The project is designed to be built in logical phases, resulting in a fully functional, deployed web application.

### 2. Key Technologies

* **Frontend:** Next.js (React Framework)
* **Backend:** FastAPI (Python Framework)
* **Database:** Supabase (PostgreSQL)
* **Authentication:** Supabase Auth
* **Financial Data API:** Finnhub
* **AI Language Model:** Google Gemini API
* **Caching:** Redis
* **Deployment:** Vercel (Frontend), Render (Backend & Services)

---

### 3. Phased Implementation Plan

#### **Phase 1: Foundation - Project Setup & User Authentication**
**Goal:** Create the project structure, set up all required services, and enable users to sign up and log in.

* **Step 1: Account & API Key Setup**
    * Create a free account on **Supabase** for your database and user authentication.
    * Create a free account on **Render** for hosting your backend and Redis cache.
    * Create a free account on **Vercel** for hosting your frontend.
    * Get a free API key from **Finnhub**.
    * Get a free API key for the **Gemini API** from Google AI Studio.

* **Step 2: Project & Repository Setup**
    * On GitHub, create a new repository for your project.
    * Locally, create two main folders inside the repository: `frontend` and `backend`.

* **Step 3: Database Schema in Supabase**
    * In your Supabase project, go to the "Table Editor."
    * Create the necessary tables and enable Row Level Security (RLS) on them for security.
        * `portfolios` (columns: `id`, `user_id`, `name`)
        * `holdings` (columns: `id`, `portfolio_id`, `ticker_symbol`, `quantity`)

* **Step 4: Frontend Setup with Next.js**
    * Navigate into the `frontend` folder and initialize a Next.js app: `npx create-next-app@latest .`
    * Install necessary packages: `npm install @supabase/supabase-js tailwindcss`.
    * Create a `.env.local` file and add your Supabase project URL and anon key.
    * Build the UI for Sign-Up, Login, and a main navigation bar.

* **Step 5: Implement Authentication**
    * Use the `@supabase/supabase-js` library to implement sign-up, login, and logout functions.
    * Create a main dashboard page (`/dashboard`) that is a protected route, redirecting unauthenticated users to the login page.

#### **Phase 2: Core Application - Portfolio Tracking**
**Goal:** Allow logged-in users to create portfolios, add stocks, and see their current value based on live market data.

* **Step 6: Backend Setup with FastAPI**
    * Navigate into the `backend` folder and set up a Python virtual environment.
    * Install packages: `pip install fastapi uvicorn "psycopg2-binary" pydantic python-dotenv requests redis`.
    * Create a `.env` file for all your secret keys (Database URL, API keys, etc.).

* **Step 7: Backend CRUD for Portfolios & Holdings**
    * In your FastAPI app, create API endpoints to Create, Read, Update, and Delete portfolios and holdings (e.g., `POST /portfolios`, `POST /holdings`). These endpoints will execute SQL commands on your Supabase database.

* **Step 8: The Main Backend Endpoint**
    * Create the primary data endpoint: `GET /portfolio/{portfolio_id}/details`.
    * This endpoint will fetch a portfolio's holdings from the database, call the financial data API (e.g., Finnhub) to get the current price for each stock, calculate the total values, and return the complete data as JSON.

* **Step 9: Build the Frontend Dashboard**
    * On the `/dashboard` page, build the UI for creating portfolios and adding/editing stocks. These actions will call the CRUD endpoints from Step 7.
    * The main dashboard view will fetch data from the `/portfolio/{id}/details` endpoint and display it in a clean table showing live stock values.

#### **Phase 3: The AI Communications Agent**
**Goal:** Implement the "Explain Today's Performance" button that provides an AI-generated narrative.

* **Step 10: Implement Caching with Redis**
    * Create a free Redis instance on Render. Add its connection URL to your backend's `.env` file.
    * In your backend code, wrap your financial API calls in a caching function that checks Redis before making a live call. Set a short expiration time (e.g., 60 seconds) to save on API usage.

* **Step 11: Create the Agent Endpoint**
    * Create a new FastAPI endpoint: `POST /agent/explain_performance`.
    * This endpoint's logic will:
        1.  Fetch portfolio performance details, identifying the day's biggest mover.
        2.  Call the financial API's news endpoint (e.g., Finnhub `/company-news`) for that specific stock.
        3.  Construct a detailed prompt for the Gemini API, providing context about the portfolio's performance and the retrieved news headlines.
        4.  Call the Gemini API and return its textual explanation.

* **Step 12: Integrate on Frontend**
    * Add a button like "✨ Explain Today's Performance" to the dashboard.
    * On click, it will call the `/agent/explain_performance` endpoint and display the returned text in a modal or a dedicated section, with a loading indicator while the agent "thinks."

#### **Phase 4: Deployment & Final Touches**
**Goal:** Deploy the application to the web, making it publicly accessible.

* **Step 13: Prepare for Deployment**
    * Ensure all secret keys are managed through environment variables, not hard-coded.
    * Create a `requirements.txt` file for the Python backend (`pip freeze > requirements.txt`).

* **Step 14: Deploy Backend to Render**
    * On Render, create a new "Web Service" and connect it to your GitHub repository, pointing to the `backend` directory.
    * Set the Build Command: `pip install -r requirements.txt`.
    * Set the Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`.
    * In the "Environment" tab, add all your secret keys from your `.env` file.

* **Step 15: Deploy Frontend to Vercel**
    * On Vercel, create a new project and connect it to your GitHub repository.
    * Vercel will auto-detect the Next.js setup.
    * In the project settings, add your environment variables, including the Supabase keys and the URL of your deployed Render backend.

* **Step 16: Final Testing & Polish**
    * Thoroughly test the entire user flow on the live application.
    * Add loading indicators and handle potential errors gracefully to improve the user experience.
    * Congratulations! Your application is now live.