# **Ark** - A Real-Time Income Stabilization Engine

Building a financial safety net for gig workers using AI, real-time data, and automated payouts for disruption-driven income loss. A parametric income protection platform for gig workers, offering dynamic premium calculation, automated disruption detection, and zero-touch claim processing.

## Core Features
- **Dynamic Premium Calculation**: Weekly premiums are dynamically adjusted via the Gemini ML engine based on hyper-local risk factors and work profile.
- **Automated Trigger Engine**: Real-time evaluation of environmental APIs (Open-Meteo) to detect disruptions (Rain, Heat, AQI) automatically.
- **Zero-Touch Claims**: Claims and payout simulations are instantly generated when disruption thresholds are breached, requiring no manual filing.
- **Worker Dashboard**: An interactive PWA-enabled interface for managing policies, calculating premiums, and tracking claims.

## Tech Stack
- **Backend:** FastAPI, PostgreSQL, Redis, Celery (Alembic for migrations)
- **Frontend:** React, Vite, TailwindCSS (PWA-enabled)
- **Inference:** Gemini 1.5 Pro (via Google Generative AI)
- **Infrastructure:** Docker and Docker Compose

## Quick Start (Docker)

1. Clone the repository and navigate into the `Ark` directory.
2. Initialize environment variables from the template:
   ```bash
   cp .env.example .env
   ```
   *Note: Ensure you add your GEMINI_API_KEY to the .env file for full functionality.*
3. Start the application stack:
   ```bash
   docker compose up --build -d
   ```
4. Access the applications:
   - Frontend: http://localhost:5173
   - Backend API Docs: http://localhost:8000/docs

## Manual Deployment (Bare Metal)

### Backend Setup
1. Navigate to the `backend` directory.
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: .\venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the database migrations & seeder:
   ```bash
   python seed.py
   ```
5. Start the FastAPI server:
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
   ```

### Frontend Setup
1. Navigate to the `frontend` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Workers and Tasks
The background engine requires Redis and Celery to process parametric triggers.
- Start Celery Worker: `celery -A app.core.celery_app worker --loglevel=info`
- Start Celery Beat: `celery -A app.core.celery_app beat --loglevel=info`

## Deployment to Production

### Using Docker Compose (Recommended)
For production, ensure `GEMINI_API_KEY` and `DATABASE_URL` are securely managed. Use the following command for a production-ready build:
```bash
docker compose -f docker-compose.yml up -d --build
```

### CI/CD Considerations
- **Environment Variables**: Use GitHub Secrets or a similar vault for `GEMINI_API_KEY`.
- **Database**: Use a managed PostgreSQL instance (e.g., AWS RDS or Supabase) in production instead of the local container.
- **SSL/TLS**: Ensure the frontend and API are served over HTTPS using a reverse proxy like Nginx or Caddy.

## Demo Mode
The application includes a Demo Mode panel in the dashboard, enabling users to mock conditions that trigger parametric payout logic without waiting for real-world phenomena.
