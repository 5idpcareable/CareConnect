# CareAble Frontend

A modern mobile-first healthcare capability assessment platform built with React, TypeScript, Vite, Tailwind CSS, and Framer Motion.

## Overview

CareAble is a digital platform designed to help hidden carers self-assess their caregiving capabilities and receive a digital certificate based on their caregiving strengths.

The platform includes:

* Mobile-first responsive UI
* User authentication
* Caregiving capability assessment
* Results analytics dashboard
* Digital certificate generation
* Admin dashboard
* Animated onboarding experience

---

# Tech Stack

## Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* React Router DOM
* Framer Motion
* Lucide React Icons

---

# Features

## User Features

### Splash Screen

* Animated startup screen
* Auto navigation to landing page

### Authentication

* Login page
* Register page
* Multiple user role support

### Dashboard

* Capability progress tracking
* Recent activity
* Statistics overview

### Assessment System

* Research-based caregiving questionnaire
* Likert-scale responses
* Progress tracking
* Multiple domains

### Results Page

* Capability insights
* Skill breakdown
* Progress indicators
* Growth recommendations

### Certificate

* Digital certificate UI
* Capability score
* Certificate ID
* Download button

### Profile

* Account management
* Settings UI
* Notifications section
* Privacy & security section

---

# Admin Features

* User analytics
* User management
* Platform metrics
* Assessment tracking
* Certificate validation

---

# Project Structure

```bash
src
 ├── assets
 ├── components
 │    ├── BottomNav.tsx
 │    ├── Card.tsx
 │    ├── Input.tsx
 │    ├── PageHeader.tsx
 │    └── PageTransition.tsx
 │
 ├── layouts
 │    └── MobileLayout.tsx
 │
 ├── pages
 │    ├── AdminDashboardPage.tsx
 │    ├── AssessmentPage.tsx
 │    ├── CertificatePage.tsx
 │    ├── DashboardPage.tsx
 │    ├── LandingPage.tsx
 │    ├── LoginPage.tsx
 │    ├── ProfilePage.tsx
 │    ├── RegisterPage.tsx
 │    ├── ResultsPage.tsx
 │    └── SplashScreen.tsx
 │
 ├── services
 │    └── mockData.ts
 │
 ├── App.tsx
 ├── main.tsx
 └── index.css
```

---

# Installation

## Clone Repository

```bash
git clone <repository-url>
```

## Open Project

```bash
cd careable-frontend
```

## Install Dependencies

```bash
npm install
```

---

# Run Development Server

```bash
npm run dev
```

Open:

```bash
http://localhost:5173
```

---

# Build Production

```bash
npm run build
```

---

# Future Improvements

* Firebase Authentication
* Supabase Database
* PDF Certificate Export
* Real Analytics Charts
* AI Capability Scoring
* Push Notifications
* Dark Mode
* API Integration
* Cloud Deployment
* Employer Portal
* Multi-language Support

---

# Deployment Options

* Vercel
* Netlify
* Firebase Hosting
* AWS Amplify

---

# Assessment Domains

The caregiving assessment includes:

* Communication & Relational Care
* System Navigation & Advocacy
* Emotional Resilience & Self-Regulation
* Self-Care & Energy Management
* Social Connection & Belonging
* Digital Literacy
* Planning & Organisation
* Leadership & Coordination

---

# UI Design Goals

* Mobile-first design
* iOS-inspired interface
* Modern SaaS styling
* Smooth animations
* Healthcare-focused accessibility
* Premium startup-quality UX

---

# Authors

Developed for the CareAble Capstone Project.

La Trobe University
Australian Centre for AI in Medical Innovation

---

# License

This project is developed for educational and research purposes.
