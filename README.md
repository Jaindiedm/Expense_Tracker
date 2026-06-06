# Expense Tracker

A full-stack expense tracking web application.
## Tech Stack

- **Backend:** Java 17 + Spring Boot 3.2 + Spring Security + JWT
- **Frontend:** React + Vite + Tailwind CSS
- **Database:** MySQL 
- **Containerisation:** Docker + docker-compose

## Features

- User registration and login with JWT authentication
- Add, edit, delete expense records with categories
- Add, edit, delete income records
- Dashboard with total income, expenses, balance, monthly stats, top category
- Latest 5 transactions on dashboard
- User profile page

---

## Option 1 — Run with Docker (Recommended)

### Prerequisites
- Docker Desktop installed and running

### Steps

1. Clone the repository:
```bash
git clone https://github.com/Jaindiedm/Expense_Tracker
cd Expense_Tracker
```

2. Copy the environment file:
```bash
cp .env.example .env
```

3. Start everything with one command:
```bash
docker-compose up --build
```

4. Open your browser:
   http://localhost:5173


That's it! Docker automatically sets up MySQL, runs the backend, and serves the frontend.

---

## Option 2 — Run Locally (Without Docker)

### Prerequisites
- Java 17+
- Maven 3.9+
- Node.js 20+
- MySQL 

### Database Setup

Open phpMyAdmin or MySQL CLI and run:
```sql
CREATE DATABASE expense_tracker;
CREATE USER 'slts'@'localhost' IDENTIFIED BY 'slts1234';
GRANT ALL PRIVILEGES ON expense_tracker.* TO 'slts'@'localhost';
FLUSH PRIVILEGES;
```

### Backend Setup

```bash
cd backend
cp src/main/resources/application.properties.example src/main/resources/application.properties
mvn spring-boot:run
```

Backend runs on: http://localhost:8080

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: http://localhost:5173

---

## Running Tests

### Backend Tests (JUnit 5 + Mockito)

```bash
cd backend
mvn test
```

Expected output:
Tests run: 10, Failures: 0, Errors: 0
BUILD SUCCESS

### Frontend Tests (Vitest + React Testing Library)

```bash
cd frontend
npm test
```

Expected output:
Test Files: 1 passed
Tests: 5 passed

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | No | Register new user |
| POST | /api/auth/login | No | Login — returns JWT token |
| GET | /api/auth/profile | Yes | Get user profile |
| GET | /api/expenses | Yes | Get all expenses |
| POST | /api/expenses | Yes | Create expense |
| PUT | /api/expenses/{id} | Yes | Update expense |
| DELETE | /api/expenses/{id} | Yes | Delete expense |
| GET | /api/income | Yes | Get all income |
| POST | /api/income | Yes | Create income |
| PUT | /api/income/{id} | Yes | Update income |
| DELETE | /api/income/{id} | Yes | Delete income |
| GET | /api/dashboard | Yes | Get dashboard summary |

---

## Project Structure

```
Expense_Tracker/
├── backend/                    # Spring Boot API
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/slts/expense_tracker/
│   │   │   │   ├── config/         # Security & CORS configuration
│   │   │   │   ├── controller/     # REST controllers
│   │   │   │   ├── dto/            # Request / Response objects
│   │   │   │   ├── model/          # JPA entities
│   │   │   │   ├── repository/     # Spring Data JPA repositories
│   │   │   │   ├── security/       # JWT filter & utility classes
│   │   │   │   └── service/        # Business logic layer
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/                   # JUnit 5 + Mockito unit tests
│   └── Dockerfile
├── frontend/                   # React + Vite SPA
│   ├── src/
│   │   ├── api/                # Axios instance & interceptors
│   │   ├── components/         # Shared UI components (Navbar, etc.)
│   │   ├── context/            # AuthContext (JWT session management)
│   │   ├── pages/              # Route-level pages
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Expenses.tsx
│   │   │   ├── Income.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   └── Profile.tsx
│   │   └── tests/              # Vitest + React Testing Library
│   ├── index.html
│   ├── nginx.conf              # Production nginx config
│   └── Dockerfile
├── docker-compose.yml          # Orchestrates all services
├── .env.example                # Environment variable template
└── README.md
```
