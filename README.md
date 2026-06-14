# Inventory & Order Management System

A full-stack web application to manage products, customers, and orders — with real-time inventory tracking.

---

## Live Demo

| Service  | URL |
|----------|-----|
| Frontend | https://inventory-nine-omega.vercel.app |
| Backend API | https://inventory-production-ecc6.up.railway.app |
| Docker Image | https://hub.docker.com/r/voidrohit/inventory-backend |

**Login:** `admin@ethara.ai` / `admin@12345`

---

## What It Does

- **Products** — Add, update, and delete products with SKU, price, quantity, and currency (USD / INR)
- **Customers** — Manage customer records with name, email, and phone
- **Orders** — Create orders for customers, auto-calculates totals and deducts stock
- **Inventory tracking** — Stock goes down when an order is placed, comes back if cancelled
- **Dashboard** — At-a-glance view of totals and low-stock alerts

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite + Tailwind CSS |
| Backend | Python + FastAPI |
| Database | PostgreSQL |
| Auth | JWT |
| Containers | Docker + Docker Compose |

---

## Running Locally

**Prerequisites:** Docker and Docker Compose installed.

```bash
git clone https://github.com/voidrohit/inventory.git
cd inventory
docker compose up --build
```

| Service  | URL |
|----------|-----|
| Frontend | http://localhost:8080 |
| Backend API | http://localhost:8000 |
| API Docs | http://localhost:8000/docs |

---

## Project Structure

```
inventory/
├── backend/        # FastAPI app
│   ├── app/
│   │   ├── api/        # Route handlers
│   │   ├── services/   # Business logic
│   │   ├── repositories/ # Database queries
│   │   ├── models/     # SQLAlchemy models
│   │   └── schemas/    # Pydantic schemas
│   └── alembic/    # Database migrations
└── frontend/       # React app
    └── src/
        ├── features/   # Products, Customers, Orders, Dashboard
        ├── components/ # Shared UI components
        ├── hooks/      # React Query hooks
        └── api/        # API client functions
```

---

## Environment Variables

Copy `.env` and update values before running:

```env
ADMIN_EMAIL=admin@ethara.ai
ADMIN_PASSWORD=your_password
JWT_SECRET=your_secret_key
DATABASE_URL=postgresql+psycopg://...
```
