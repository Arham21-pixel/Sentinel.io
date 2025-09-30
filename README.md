<<<<<<< HEAD
# Sentinel - Advanced Parental Control System

A modern, enterprise-grade parental control system built with React, TypeScript, and cutting-edge UI components. Monitor, control, and protect your family's digital experience with professional grade features.

![Sentinel Dashboard](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![React](https://img.shields.io/badge/React-18.x-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.x-blue)

## Features
- React UI to test decisions and view rules

## Getting Started

Requirements: Node 18+

### Backend

```bash
cd server
npm i
npm run dev
```

API: `http://localhost:4000`

### Frontend

```bash
cd web
npm i
npm run dev
```

Open `http://localhost:5173`.

## API Endpoints

- `GET /api/users`
- `GET /api/rules`
- `POST /api/evaluate` → `{ userId, url, isoDateTime? }`

## Example Rules

- Block entertainment on weekdays 17:00-20:00: `isWeekday and time:between(17:00,20:00) and url:category(is,entertainment)`
- Allow Wikipedia always: `url:host(is,wikipedia.org) or url:host(endsWith,.wikipedia.org)`
- Parent override: `role:is(parent)`

## Notes

- Data is in-memory. Replace with a database for production.
- Add auth, audit logs, and deployment scripts for a full production setup.


=======
# Sentinel.io
Parental Control Web
>>>>>>> 40382b4d5a2b7b5cc49a85c2d0e9a85dd1b5f817
