☕ May Coffee Store

May Coffee Store is a modern, UI-focused coffee shop website designed to attract customers through a clean, elegant interface, smooth animations, and a mobile-first experience.
The project prioritizes frontend design, user interaction, and visual storytelling, while supporting real-world features such as feedback, ratings, authentication, and admin management.

The website primarily targets Vietnamese users, with Vietnamese as the main language and English as a secondary language, translated naturally and professionally (not machine-translated).

🎯 Project Goals

Attract more customers to the coffee shop through a visually appealing website

Display menu items clearly with prices and short, engaging descriptions

Create a modern R&B-style coffee shop brand identity

Provide a smooth, responsive experience on both mobile and desktop

Enable real customer interaction through feedback, ratings, and email notifications

✨ Key Features
🌐 Multilingual Support

Vietnamese (primary)

English (secondary, professionally localized)

Language switching without breaking layout or UI design

📋 Menu System

Clear categorization (Coffee, Milk Tea, Fruit Tea, Yogurt, Smoothies, etc.)

Prices displayed for every item

Short, attractive drink descriptions

Optimized layout for readability on mobile

⭐ Feedback & Rating

Logged-in users can leave feedback and rate the shop (5-star system)

Admin approves which feedback appears publicly

Average rating calculated only from approved feedback

Thank-you email sent after each feedback submission

Rate limit: max 3 feedback submissions per user per day

👤 Authentication

User registration with:

Name

Email

Password

Email verification via 6-digit code (SendGrid)

Secure login system

Passwords are never exposed

🛠️ Admin System

Admin logs in like a normal user

Initial admin email:

dganhtuan.2k5@gmail.com


Admin can:

Approve / reject feedback

View user name & email (passwords hidden)

Add new admins by email

Delete user accounts (with reason email)

View feedback history of each user

📧 Email System

Email verification (6-digit code)

Event & promotion announcements (non-reply emails)

Feedback thank-you emails

Account deletion notification emails

Emails available in:

Vietnamese (primary)

English (secondary)

Email design matches website color palette & branding

📱 Responsive & UI-Driven

Fully responsive (mobile-first)

Optimized font sizes & button spacing for touch devices

Smooth animations & transitions

Icons used instead of emojis for professional look

Dynamic background and motion elements (without overwhelming the user)

🧾 QR Code Menu

QR code for online menu

Supports both Vietnamese & English

English shown first after scanning

Designed for in-store customer usage

Short, elegant drink descriptions

Professional tone matching Vietnam’s modern coffee industry

🧱 Tech Stack
Frontend

Modern frontend framework (React / Next.js)

Animation libraries for smooth transitions

Responsive UI design

Deployed on Vercel

Backend

Node.js + Express

MongoDB (via MONGODB_URI)

Authentication & authorization

Admin role management

Email service via SendGrid

Deployed on Railway

🔐 Security

Strong separation between frontend & backend

Sensitive data protected:

No exposed API keys

No exposed passwords

Environment variables properly secured

Only admins can view user emails

Protected routes & role-based access control

Secure authentication & session handling

🚀 Deployment Plan

Localhost development first

Frontend deployed on Vercel

Backend deployed on Railway

MongoDB connected via environment variable

Domain used for email verification & production use

🧩 Project Focus

This project is UI-first, experience-driven, and built to feel like a real coffee brand, not just a demo website.

The main priority is:

Visual quality

Ease of use

Performance

Professional branding

📌 Status

🚧 Actively developing
🔜 UI refinement, animation polish, and production deployment

