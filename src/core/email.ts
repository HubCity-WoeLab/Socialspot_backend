// import nodemailer from "nodemailer";
// import dotenv from "dotenv";
// dotenv.config();

// const host = process.env.SMTP_HOST;
// const port = Number(process.env.SMTP_PORT || 587);
// const secure = (process.env.SMTP_SECURE === 'true');
// const user = process.env.SMTP_USER;
// const pass = process.env.SMTP_PASS;
// const from = process.env.EMAIL_FROM || 'no-reply@socialspot.example';

// if (!host || !user || !pass) {
//   console.warn('SMTP not configured: set SMTP_HOST, SMTP_USER, SMTP_PASS in .env to send real emails.');
// }

// const transporter = nodemailer.createTransport({
//   host,
//   port,
//   secure,
//   auth: user && pass ? { user, pass } : undefined,
// });

// export const sendEmail = async (to: string, subject: string, html: string) => {
//   if (!host || !user || !pass) {
//     console.log('[email stub] to:', to, 'subject:', subject, 'html:', html);
//     return;
//   }
//   const info = await transporter.sendMail({
//     from,
//     to,
//     subject,
//     html,
//   });
//   console.log('Email sent:', info.messageId);
//   return info;
// };


import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Récupération des variables d'environnement
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
const SMTP_SECURE = process.env.SMTP_SECURE === "true"; // true si SSL, false si TLS
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const EMAIL_FROM = process.env.EMAIL_FROM || "SocialSpot <no-reply@socialspot.example.com>";

// Vérification de la configuration SMTP
if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
  console.warn(
    "SMTP not configured: set SMTP_HOST, SMTP_USER, SMTP_PASS in .env to send real emails."
  );
}

// Création du transporteur Nodemailer
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_SECURE,
  auth: SMTP_USER && SMTP_PASS ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
});

// Fonction pour envoyer un email
export const sendEmail = async (to: string, subject: string, html: string) => {
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    console.log(
      "[email stub] SMTP not configured. Email not sent.",
      { to, subject, html }
    );
    return;
  }

  try {
    const info = await transporter.sendMail({
      from: EMAIL_FROM,
      to,
      subject,
      html,
    });
    console.log("Email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error; // Pour que l'appelant puisse gérer l'erreur
  }
};
