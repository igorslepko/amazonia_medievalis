# Amazonia Medievalis

> A fullstack learning project: a medieval-themed online shop for practicing backend development and automated testing.

[![Backend Tests](https://github.com/igorslepko/amazonia_medievalis/actions/workflows/backend-tests.yml/badge.svg)](https://github.com/igorslepko/amazonia_medievalis/actions/workflows/backend-tests.yml)
[![E2E Tests](https://github.com/igorslepko/amazonia_medievalis/actions/workflows/e2e-tests.yml/badge.svg)](https://github.com/igorslepko/amazonia_medievalis/actions/workflows/e2e-tests.yml)
![Python](https://img.shields.io/badge/Python-3.12-blue?logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-ready-2496ED?logo=docker&logoColor=white)

---

## Live Demo

**Frontend:** https://igorslepko.github.io/amazonia_medievalis/

**API (Swagger):** _coming soon_

---

## About

**Amazonia Medievalis** is a joke online shop styled as a medieval marketplace. You can buy indulgences, chastity belts, and a spare horse.

The project was built **for practice** in fullstack development:

- REST API with FastAPI
- PostgreSQL and database migrations
- Automated tests on two levels (API + E2E)
- CI/CD via GitHub Actions
- Docker and Docker Compose

## Features

- **Product catalog** with category filtering and search
- **Multi-language** — Russian, English, Latin
- **Multi-currency** — rubles, dollars, ducats
- **Shopping cart** — add, remove, clear
- **10% discount** — when buying 3+ indulgences
- **Swagger** — auto-generated API docs
- **Sessions** — via http only cookies

## Tech Stack

| Layer        | Technologies                                         |
| ------------ | ---------------------------------------------------- |
| **Frontend** | Vanilla JS, HTML, CSS                                |
| **Backend**  | Python 3.12, FastAPI, SQLAlchemy 2.0, Pydantic       |
| **Database** | PostgreSQL 16, Alembic (migrations)                  |
| **Testing**  | pytest (31 backend tests), Playwright (12 E2E tests) |
| **DevOps**   | Docker, Docker Compose, GitHub Actions               |
| **Hosting**  | GitHub Pages (frontend)                              |

## Architecture

──────────────┐ HTTP ┌──────────────┐ SQL ┌──────────────┐
│ Frontend │ ──────────▶ │ Backend │ ─────────▶ │ PostgreSQL │
│ (Vanilla) │ │ (FastAPI) │ │ 16 │
└──────────────┘ └──────────────┘ └──────────────┘
│ │
│ Playwright │ pytest
▼ ▼
E2E tests API tests

## Getting Started

### Requirements

- Docker Desktop
- Python 3.12+
- Node.js 20+ (for E2E tests)

### Run the project

# 1. Clone the repository

git clone https://github.com/igorslepko/amazonia_medievalis.git
cd amazonia_medievalis

# 2. Create .env file

echo "POSTGRES_USER=amazonia
POSTGRES_PASSWORD=change_me
POSTGRES_DB=amazonia" > .env

# 3. Start (Postgres + API)

docker compose up --build

# 4. Apply migrations and seed data

docker compose exec api alembic upgrade head
docker compose exec api python -m app.seed
API: http://localhost:8000/docs

Run tests

# Backend

cd backend
pip install -r requirements.txt
pytest tests/ -v

# E2E

cd e2e
npm install
npx playwright install chromium
npx playwright test

## Project Structure

text
amazonia_medievalis/
├── backend/ # FastAPI + SQLAlchemy
│ ├── app/
│ │ ├── core/ # database, discount, cart_store
│ │ ├── routers/ # products, cart
│ │ ├── models.py # SQLAlchemy models
│ │ └── main.py
│ ├── tests/ # pytest (31 test)
│ └── Dockerfile
├── e2e/ # Playwright
│ ├── pages/ # Page Objects
│ └── tests/ # 12 E2E tests
├── frontend/ # Vanilla JS SPA
└── docker-compose.yml

## Test Coverage

Backend (31 tests):
Products API (11 tests) — filtering, search, localization
Cart API (11 tests) — add, remove, discount, checkout
Discount logic (9 tests) — unit tests

E2E (12 tests):
Category navigation
Cart — add, remove, clear
Multi-language (ru/en/la)
Multi-currency (₽/$/⛃)
Search and toast notifications

## Roadmap

☑ SPA + UI logic
☑ Playwright E2E
☑ FastAPI backend
☑ SQLAlchemy + PostgreSQL
☑ Alembic migrations
☑ Docker Compose
☑ CI (GitHub Actions)
□ Deploy to Render + Neon
□ JWT authentication

## License

MIT — do whatever you want, sinner.
