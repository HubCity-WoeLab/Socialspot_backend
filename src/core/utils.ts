// import Jwt, { Secret } from "jsonwebtoken";
// import dotenv from "dotenv";
// dotenv.config();
// const JWT_SECRET = process.env.JWT_SECRET as Secret;
// const ACCESS_TTL = process.env.JWT_ACCESS_TTL || "15m";
// const REFRESH_TTL = process.env.JWT_REFRESH_TTL || "7d";

// export interface loginToken {
//   id: number;
//   email: string;
//   role: string;
// }

// export interface authToken {
//   id: number;
//   email: string;
//   role: string;
// }

// export const generateAuthToken = (data: authToken): string => {
//   return Jwt.sign(data, JWT_SECRET, { expiresIn: ACCESS_TTL });
// };

// export const decodeAuthToken = (token: string): authToken => {
//   return Jwt.verify(token, JWT_SECRET) as authToken;
// };

// export const generateLoginToken = (data: loginToken): string => {
//   return Jwt.sign(data, JWT_SECRET, { expiresIn: REFRESH_TTL });
// };

// export const decodeLoginToken = (token: string): loginToken => {
//   return Jwt.verify(token, JWT_SECRET) as loginToken;
// };
import jwt, { SignOptions } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";
const ACCESS_TTL = (process.env.JWT_ACCESS_TTL || "15m") as SignOptions["expiresIn"];
const REFRESH_TTL = (process.env.JWT_REFRESH_TTL || "7d") as SignOptions["expiresIn"];

export interface LoginToken {
  id: number;
  email: string;
  role: string;
}

export interface AuthToken {
  id: number;
  email: string;
  role: string;
}

// Fonction utilitaire pour générer un token
const signToken = (data: object, ttl: SignOptions["expiresIn"]): string => {
  const options: SignOptions = { expiresIn: ttl };
  return jwt.sign(data, JWT_SECRET, options);
};

// Génération et décodage du token d'authentification
export const generateAuthToken = (data: AuthToken): string => signToken(data, ACCESS_TTL);
export const decodeAuthToken = (token: string): AuthToken => jwt.verify(token, JWT_SECRET) as AuthToken;

// Génération et décodage du token de login
export const generateLoginToken = (data: LoginToken): string => signToken(data, REFRESH_TTL);
export const decodeLoginToken = (token: string): LoginToken => jwt.verify(token, JWT_SECRET) as LoginToken;
