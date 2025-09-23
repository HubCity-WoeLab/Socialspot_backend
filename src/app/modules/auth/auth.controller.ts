// import { Request, Response } from "express";
// import { PrismaClient } from "@prisma/client";
// import bcrypt from "bcrypt";
// import { generateAuthToken, generateLoginToken, decodeLoginToken } from "../../../core/utils";
// import { saveRefreshToken, findRefreshToken, revokeRefreshToken } from "../../../core/refresh.service";
// import { sendEmail } from "../../../core/email";

// const prisma = new PrismaClient();

// // POST /api/auth/signup
// export const signup = async (req: Request, res: Response) => {
//   console.log("Signup route called", req.body);
//   try {
//     const { firstName, lastName, email } = req.body;
//     if (!firstName || !lastName || !email) {
//       console.log("Missing fields");
//       return res.status(400).json({ success: false, error: "Missing fields" });
//     }

//     const existing = await prisma.user.findUnique({ where: { email } });
//     if (existing) {
//       console.log("Email already used");
//       return res.status(409).json({ success: false, error: "Email already used" });
//     }

//     const otp = String(Math.floor(100000 + Math.random() * 900000));
//     const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

//     const user = await prisma.user.create({
//       data: {
//         firstName,
//         lastName,
//         email,
//         otpCode: otp,
//         otpExpiry,
//         emailVerified: false
//       }
//     });
//     console.log("User created:", user);

//     try {
//       await sendEmail(email, "Votre code SocialSpot", `<p>Votre code: <strong>${otp}</strong></p>`);
//       console.log("OTP email sent to:", email);
//     } catch (emailErr) {
//       console.error("Error sending OTP email:", emailErr);
//       return res.status(500).json({ success: false, error: "Failed to send OTP email" });
//     }

//     return res.json({ success: true, message: "OTP sent to email" });
//   } catch (err) {
//    console.error(err);
//     return res.status(500).json({ message: "Internal error" });
//   }
// };

// // POST /api/auth/verify-otp
// export const verifyOtp = async (req: Request, res: Response) => {
//   try {
//     const { email, otp, password } = req.body;
//     if (!email || !otp || !password) return res.status(400).json({ message: "Missing fields" });

//     const user = await prisma.user.findUnique({ where: { email } });
//     if (!user) return res.status(400).json({ message: "User not found" });

//     if (!user.otpCode || user.otpCode !== otp) return res.status(400).json({ message: "Invalid OTP" });
//     if (user.otpExpiry && user.otpExpiry < new Date()) return res.status(400).json({ message: "OTP expired" });

//     const hashed = await bcrypt.hash(password, 12);
//     await prisma.user.update({
//       where: { id: user.id },
//       data: { password: hashed, emailVerified: true, otpCode: null, otpExpiry: null }
//     });

//     return res.json({ message: "Account verified. You can sign in." });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ message: "Internal error" });
//   }
// };

// // POST /api/auth/signin
// export const signin = async (req: Request, res: Response) => {
//   try {
//     const { email, password } = req.body;
//     if (!email || !password) return res.status(400).json({ message: "Missing fields" });

//     const user = await prisma.user.findUnique({ where: { email } });
//     if (!user || !user.password) return res.status(401).json({ message: "Invalid credentials" });

//     const ok = await bcrypt.compare(password, user.password);
//     if (!ok) return res.status(401).json({ message: "Invalid credentials" });

//     const accessToken = generateAuthToken({ id: user.id, email: user.email, role: user.role });
//     const refreshToken = generateLoginToken({ id: user.id, email: user.email, role: user.role });

//     await saveRefreshToken(user.id, refreshToken, 7);

//     return res.json({ accessToken, refreshToken, user: { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role } });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ message: "Internal error" });
//   }
// };

// // POST /api/auth/refresh-token
// export const refreshTokenHandler = async (req: Request, res: Response) => {
//   try {
//     const { refreshToken } = req.body;
//     if (!refreshToken) return res.status(400).json({ message: "Missing refreshToken" });

//     const stored = await findRefreshToken(refreshToken);
//     if (!stored || stored.revokedAt) return res.status(401).json({ message: "Invalid refresh token" });
//     if (stored.expiresAt < new Date()) return res.status(401).json({ message: "Expired refresh token" });

//     const decoded = decodeLoginToken(refreshToken);
//     const newAccess = generateAuthToken({ id: decoded.id, email: decoded.email, role: decoded.role });
//     return res.json({ accessToken: newAccess });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ message: "Internal error" });
//   }
// };

// // POST /api/auth/logout
// export const logout = async (req: Request, res: Response) => {
//   try {
//     const { refreshToken } = req.body;
//     if (!refreshToken) return res.status(400).json({ message: "Missing refreshToken" });
//     await revokeRefreshToken(refreshToken);
//     return res.json({ message: "Logged out" });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ message: "Internal error" });
//   }
// };
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { generateAuthToken, generateLoginToken, decodeLoginToken } from "../../../core/utils";
import { saveRefreshToken, findRefreshToken, revokeRefreshToken } from "../../../core/refresh.service";
import { sendEmail } from "../../../core/email";

const prisma = new PrismaClient();

// POST /api/auth/signup
export const signup = async (req: Request, res: Response) => {
  console.log("Signup route called", req.body);
  try {
    const { firstName, lastName, email } = req.body;
    if (!firstName || !lastName || !email) {
      console.log("Missing fields");
      return res.status(400).json({ success: false, error: "Missing fields" });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      console.log("Email already used");
      return res.status(409).json({ success: false, error: "Email already used" });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        otpCode: otp,
        otpExpiry,
        emailVerified: false
      }
    });
    console.log("User created:", user);

    try {
      await sendEmail(email, "Votre code SocialSpot", `<p>Votre code: <strong>${otp}</strong></p>`);
      console.log("OTP email sent to:", email);
    } catch (emailErr) {
      console.error("Error sending OTP email:", emailErr);
      return res.status(500).json({ success: false, error: "Failed to send OTP email" });
    }

    return res.json({ success: true, message: "OTP sent to email" });
  } catch (err) {
   console.error(err);
    return res.status(500).json({ message: "Internal error" });
  }
};

// POST /api/auth/verify-otp
export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp, password } = req.body;
    if (!email || !otp || !password) return res.status(400).json({ message: "Missing fields" });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ message: "User not found" });

    if (!user.otpCode || user.otpCode !== otp) return res.status(400).json({ message: "Invalid OTP" });
    if (user.otpExpiry && user.otpExpiry < new Date()) return res.status(400).json({ message: "OTP expired" });

    const hashed = await bcrypt.hash(password, 12);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashed, emailVerified: true, otpCode: null, otpExpiry: null }
    });

    return res.json({ message: "Account verified. You can sign in." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal error" });
  }
};

// POST /api/auth/signin
export const signin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Missing fields" });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.password) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const accessToken = generateAuthToken({ id: user.id, email: user.email, role: user.role });
    const refreshToken = generateLoginToken({ id: user.id, email: user.email, role: user.role });

    await saveRefreshToken(user.id, refreshToken, 7);

    return res.json({ accessToken, refreshToken, user: { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal error" });
  }
};

// POST /api/auth/refresh-token
export const refreshTokenHandler = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ message: "Missing refreshToken" });

    const stored = await findRefreshToken(refreshToken);
    if (!stored || stored.revokedAt) return res.status(401).json({ message: "Invalid refresh token" });
    if (stored.expiresAt < new Date()) return res.status(401).json({ message: "Expired refresh token" });

    const decoded = decodeLoginToken(refreshToken);
    const newAccess = generateAuthToken({ id: decoded.id, email: decoded.email, role: decoded.role });
    return res.json({ accessToken: newAccess });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal error" });
  }
};

// POST /api/auth/logout
export const logout = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ message: "Missing refreshToken" });
    await revokeRefreshToken(refreshToken);
    return res.json({ message: "Logged out" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal error" });
  }
};
