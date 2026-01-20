# Formboom Backend

[![Node.js](https://img.shields.io/badge/node-%3E=18.x-brightgreen)](https://nodejs.org/) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Formboom Backend is a robust Node.js/Express REST API for managing forms, submissions, users, plans, and admin operations. It features secure authentication, rate limiting, logging, email notifications, and seamless integration with Firebase for user management.

---

## Features

- User & Admin authentication (JWT, Firebase)
- Form creation, update, and deletion
- Submission management with quota and plan enforcement
- Subscription plans (Free, Paid, etc.)
- Admin dashboard with CSV export
- Rate limiting & security middleware (Helmet, CORS, XSS)
- Logging (Winston) & error tracking
- Email notifications (SMTP)
- Sequelize ORM (MySQL)
- Modular codebase for scalability

---


## migration command
 - npx sequelize-cli db:migrate --config config/config.cjs

## Project Structure

```
└── 📁src/
    ├── 📁config/
    ├── 📁constants/
    ├── 📁database/
    ├── 📁middlewares/
    ├── 📁modules/
        ├── 📁admin/
            └── controller.js
            └── index.js
            └── joiSchema.js
            └── model.js
            └── service.js
        ├── 📁auth/
        ├── 📁form/
        ├── 📁form-submission/
        ├── 📁form-submission-data/
        ├── 📁log/
        ├── 📁plan/
        ├── 📁transaction/
        ├── 📁user/
        ├── 📁user-plan/
    ├── 📁routes/
    ├── 📁service/
    ├── 📁utils/
    ├── app.js
    ├── index.js
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- MySQL database

### Installation

```sh
git clone <repo-url>
cd Formboom-backend
npm install
```

### Environment Variables

Copy example.env to .env and fill in your credentials:

```sh
cp example.env .env
```

Key variables:

- `NODE_ENV`, `PORT`, `HOST`
- `JWT_SECRET`, `JWT_EXPIREIN`
- `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE`
- `FIREBASE_*` (see Firebase Admin SDK)
- `EMAIL_*` (SMTP credentials)

---

## Usage

### Development

```sh
npm run dev
```

### Production

```sh
npm start
```

### Database Migrations

```sh
npx sequelize-cli db:migrate
```

---

## API Overview

All endpoints are versioned under `/api/v1`.

- **Auth**: `/user/create`, `/user/verify`, `/admin/signup`, `/admin/login`
- **User**: `/user/:id`, `/user/dashboard`, `/user/:id/forms`, `/user/changePassword`
- **Form**: `/form/`, `/form/:id`, `/form/:id/update_mail`
- **Form Submission**: `/formsubmission/`, `/formsubmission/:id`, `/formsubmission/:id/csv`, `/formsubmission/User`, `/formsubmission/Quota`
- **Plan**: `/plan/`, `/plan/:id`
- **User Plan**: `/userplan/`, `/userplan/:id`, `/userplan/plan`, `/userplan/csv`
- **Admin**: `/admin/`, `/admin/all`, `/admin/alluser`, `/admin/allform`, `/admin/all/csv`, etc.
- **Transaction**: `/transaction/`, `/transaction/:id`, `/transaction/csv`
- **Logs**: `/logs/`

---

## Security & Middleware

- **Helmet**: HTTP headers
- **CORS**: Cross-origin
- **XSS-Clean**: XSS protection
- **Rate Limiting**: Prevent abuse
- **Winston**: Logging