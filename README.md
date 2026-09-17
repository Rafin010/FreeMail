# FreeMail

A production-ready Email Marketing SaaS platform for Campaign Management, Audience/CRM, Segmentation, Email Automation, AI-assisted Content Creation, Analytics, Deliverability, Integrations, Forms, and Transactional Email.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, TypeScript, Tailwind CSS, shadcn/ui |
| Backend | FastAPI, Python 3.12+, SQLAlchemy 2.0, Pydantic v2 |
| Database | PostgreSQL 16 |
| Cache/Queue | Redis 7 |
| Background Jobs | Celery |
| Email Sending | Provider abstraction (SES, SendGrid, Mailgun) |
| AI | Provider abstraction (OpenAI, Gemini) |

## Quick Start

### Prerequisites

- Docker & Docker Compose
- Node.js 20+ (for local frontend dev)
- Python 3.12+ (for local backend dev)

### Development Setup

```bash
# 1. Clone and configure
cp .env.example .env

# 2. Start all services
docker-compose up -d

# 3. Run database migrations
docker-compose exec backend alembic upgrade head

# 4. Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

### Local Development (without Docker)

```bash
# Backend
cd backend
python -m venv .venv
.venv/Scripts/activate  # Windows
pip install -e ".[dev]"
uvicorn app.main:app --reload

# Frontend
cd frontend
npm install
npm run dev
```

## Project Structure

```
FreeMail/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── api/v1/         # API route handlers
│   │   ├── core/           # Security, permissions, utils
│   │   ├── models/         # SQLAlchemy models
│   │   ├── schemas/        # Pydantic schemas
│   │   ├── services/       # Business logic
│   │   └── workers/        # Celery tasks
│   ├── alembic/            # Database migrations
│   └── tests/              # Backend tests
├── frontend/                # Next.js frontend
│   └── src/
│       ├── app/            # App Router pages
│       ├── components/     # React components
│       └── lib/            # Utilities, hooks, stores
├── docker-compose.yml
└── .env.example
```

## API Documentation

Once running, visit `http://localhost:8000/docs` for interactive Swagger documentation.

## License

Proprietary. All rights reserved.
