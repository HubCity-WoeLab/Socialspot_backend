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

// Création du transporteur Nodemailer avec TLS correction
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_SECURE,
  auth: SMTP_USER && SMTP_PASS ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
  tls: {
    rejectUnauthorized: false, // Correction pour Gmail et certificats auto-signés
  },
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
    console.log("Tentative d'envoi d'email à :", to, "Sujet :", subject);
    const info = await transporter.sendMail({
      from: EMAIL_FROM,
      to,
      subject,
      html,
    });
    console.log("Email sent:", info.messageId, "Réponse SMTP:", info.response);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error; // Pour que l'appelant puisse gérer l'erreur
  }
};