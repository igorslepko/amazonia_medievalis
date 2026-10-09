# Project Context

## Overview

Учебный fullstack-проект: средневековый интернет-магазин для практики backend-разработки и автотестов.

## Stack

- **Frontend:** Vanilla JS, HTML, CSS — GitHub Pages
- **Backend:** Python 3.12, FastAPI, SQLAlchemy 2.0 — Render
- **Database:** PostgreSQL 16 — Neon
- **Migrations:** Alembic
- **Testing:** pytest (31), Playwright (12 E2E)
- **CI/CD:** GitHub Actions
- **Local:** Docker Compose

## Architecture

[схема]

## Data Model

- Product (id, emoji, category, price, old_price)
- ProductTranslation (product_id, language, name, description)
- Cart (session_id) → CartItem (cart_id, product_id)
- Order (order_id, session_id, subtotal, discount, total) → OrderItem (order_id, product_id, price_at_purchase)

## Key Features

- Multi-language (ru/en/la), multi-currency (₽/$/⛃)
- Cart in DB with httponly cookie sessions
- 10% discount for 3+ indulgences
- Abandoned carts not cleaned (roadmap)

## Conventions

- pytest для backend, Playwright для E2E
- Page Object Model в e2e/pages/
- Моки API через `page.route()` в fixtures
- Async SQLAlchemy? Нет, sync
- `python -m app.seed` для заполнения БД

## Next Steps

- JWT auth
- Checkout page
- Order history
- TTL cleanup
