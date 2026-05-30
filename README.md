# 🛡️ SafeHer — Women Safety Platform

A full-stack Women Safety web application built with **HTML/CSS/JS** frontend and **Django + Supabase** backend.

---

## 📁 Project Structure

```
womensafety/
├── frontend/                  # Static HTML/CSS/JS
│   ├── index.html             # Home page
│   ├── css/style.css          # Global styles
│   ├── js/main.js             # All frontend JS + API calls
│   └── pages/
│       ├── register.html      # User registration
│       ├── login.html         # User login
│       ├── sos.html           # SOS Emergency page
│       ├── report.html        # Incident reporting
│       ├── contacts.html      # Emergency contacts
│       ├── resources.html     # Safety resources & helplines
│       ├── admin-login.html   # Admin login
│       └── admin-dashboard.html # Admin panel
│
└── backend/                   # Django REST API
    ├── manage.py
    ├── requirements.txt
    ├── .env.example
    ├── supabase_schema.sql    # Run in Supabase SQL Editor
    ├── womensafety/
    │   ├── settings.py
    │   └── urls.py
    └── api/
        ├── views.py           # All API endpoints
        ├── urls.py            # URL routing
        ├── auth.py            # JWT authentication
        └── supabase_client.py # Supabase connection
```

---

## 🚀 Setup Guide

### Step 1 — Supabase Setup

1. Go to [https://supabase.com](https://supabase.com) and create a new project.
2. Open **SQL Editor** and run the contents of `backend/supabase_schema.sql`.
3. From **Project Settings → API**, copy:
   - **Project URL** → `SUPABASE_URL`
   - **anon public key** → `SUPABASE_KEY`
   - **service_role secret key** → `SUPABASE_SERVICE_KEY`

### Step 2 — Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your Supabase credentials

# Run Django server
python manage.py runserver
```

The API will be available at `http://127.0.0.1:8000/api/`

### Step 3 — Frontend Setup

Open `frontend/index.html` in your browser, or serve it with any static server:

```bash
cd frontend
python -m http.server 5500
# Visit http://localhost:5500
```

---

## 🔐 Admin Access

| Field    | Value   |
|----------|---------|
| Username | `admin` |
| Password | `123`   |
| URL      | `pages/admin-login.html` |

---

## 📡 API Endpoints

| Method | Endpoint                       | Auth     | Description              |
|--------|--------------------------------|----------|--------------------------|
| POST   | `/api/register/`               | —        | User registration        |
| POST   | `/api/login/`                  | —        | User login               |
| POST   | `/api/sos/`                    | Optional | Trigger SOS alert        |
| GET    | `/api/incidents/`              | User     | Get my incidents         |
| POST   | `/api/incidents/`              | User     | Report incident          |
| GET    | `/api/contacts/`               | User     | Get emergency contacts   |
| POST   | `/api/contacts/`               | User     | Add emergency contact    |
| DELETE | `/api/contacts/<id>/`          | User     | Remove contact           |
| POST   | `/api/admin/login/`            | —        | Admin login              |
| GET    | `/api/admin/stats/`            | Admin    | Dashboard statistics     |
| GET    | `/api/admin/incidents/`        | Admin    | All incidents            |
| PATCH  | `/api/admin/incidents/<id>/`   | Admin    | Update incident status   |
| GET    | `/api/admin/sos/`              | Admin    | All SOS alerts           |
| GET    | `/api/admin/users/`            | Admin    | All registered users     |

---

## ✨ Features

### User Features
- 🔐 Secure Registration & Login (JWT)
- 🚨 **One-tap SOS Alert** with GPS location sharing
- 📋 Incident Reporting (harassment, stalking, assault, etc.)
- 👥 Emergency Contact Management
- 📍 Location-aware SOS with contact notification
- 📚 Safety Resources & Helplines
- 📞 Quick-dial emergency numbers (112, 1091, 181, 1098)

### Admin Features
- 🔒 Admin login (`admin` / `123`)
- 📊 Live Dashboard Statistics
- 📋 Incident Management with status updates
- 🚨 SOS Alert Log with GPS coordinates
- 👥 User Management

---

## 🛠️ Tech Stack

| Layer     | Technology            |
|-----------|-----------------------|
| Frontend  | HTML5, CSS3, Vanilla JS |
| Backend   | Python 3.11, Django 4.2, Django REST Framework |
| Database  | Supabase (PostgreSQL) |
| Auth      | JWT (PyJWT)           |
| Hosting   | Any (Vercel for frontend, Railway/Render for Django) |

---

## 📞 Emergency Numbers (India)

| Number | Service              |
|--------|----------------------|
| 112    | Emergency Services   |
| 1091   | Women Helpline       |
| 181    | Domestic Violence    |
| 1098   | Child Helpline       |

---

## 🚀 Production Deployment

1. Set `DEBUG=False` in `.env`
2. Use a strong `SECRET_KEY` and `JWT_SECRET`
3. Restrict `CORS_ALLOW_ALL_ORIGINS = False` and whitelist frontend domain
4. Deploy Django to **Railway**, **Render**, or **Heroku**
5. Deploy frontend to **Vercel** or **Netlify**
6. Integrate **Twilio** for SMS notifications on SOS trigger
