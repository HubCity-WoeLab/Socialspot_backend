# SocialSpot backend scaffold (Express + TypeScript + Prisma + PostgreSQL + Nodemailer)

What's included:

- Prisma schema for User, RefreshToken, Ad
- Auth controllers with OTP flow, refresh tokens, signin, logout
- Nodemailer integration for sending real emails (configurable via .env)
- Postman collection for testing

## Quick start:

1. Copy files into your repo or use as a separate backend folder.
2. npm install
3. Copy .env.example to .env and fill values (DATABASE_URL, SMTP config, JWT secret)
4. npx prisma generate
5. npx prisma migrate dev --name init
6. npm run dev

Note: nodemailer requires a real SMTP service (smtp host/user/pass) or an API provider like SendGrid (you can use nodemailer-sendgrid-transport).
