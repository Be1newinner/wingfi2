import jwt from "jsonwebtoken";
import { ROLE } from "../models/users.model.ts";

type Unit =
  | "Years"
  | "Year"
  | "Yrs"
  | "Yr"
  | "Y"
  | "Weeks"
  | "Week"
  | "W"
  | "Days"
  | "Day"
  | "D"
  | "Hours"
  | "Hour"
  | "Hrs"
  | "Hr"
  | "H"
  | "Minutes"
  | "Minute"
  | "Mins"
  | "Min"
  | "M"
  | "Seconds"
  | "Second"
  | "Secs"
  | "Sec"
  | "s"
  | "Milliseconds"
  | "Millisecond"
  | "Msecs"
  | "Msec"
  | "Ms";

type UnitAnyCase = Unit | Uppercase<Unit> | Lowercase<Unit>;

export type JWT_EXPIRY_FORMAT =
  | `${number}`
  | `${number}${UnitAnyCase}`
  | `${number} ${UnitAnyCase}`;

interface JwtPayload {
  [key: string]: unknown;
}

/**
 * Generates a JWT token
 * @param {JwtPayload} data - Payload data to encode
 * @param {JWT_EXPIRY_FORMAT} expiry - Expiry time in JWT format
 * @returns {Promise<string>} - Signed JWT token
 */
export async function generateToken(
  data: JwtPayload,
  expiry: JWT_EXPIRY_FORMAT
): Promise<string> {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is required!");

  return jwt.sign({ data }, secret, { expiresIn: expiry });
}

export type TokenPayload = {
  email: string;
  role: ROLE;
  _id: string;
};

/**
 * Generates access & refresh tokens for authentication
 * @param {JwtPayload} data - User data to encode
 * @returns {Promise<{ accessToken: string; refreshToken: string }>} - JWT tokens
 */
export async function generateLoginTokens({
  email,
  role,
  _id,
}: TokenPayload): Promise<{ accessToken: string; refreshToken: string }> {
  const refreshExpiry =
    (process.env.JWT_REFRESH_EXPIRY as JWT_EXPIRY_FORMAT) || "7d";

  if (!refreshExpiry) throw new Error("JWT_REFRESH_EXPIRY is required!");

  return {
    accessToken: await generateAccessToken({ email, role, _id }),
    refreshToken: await generateToken({ email, role, _id }, refreshExpiry),
  };
}

export async function generateAccessToken({ email, role, _id }: TokenPayload) {
  const accessExpiry =
    (process.env.JWT_SHORT_EXPIRY as JWT_EXPIRY_FORMAT) || "1d";

  if (!accessExpiry) throw new Error("JWT_ACCESS_EXPIRY is required!");

  return await generateToken({ email, role, _id }, accessExpiry);
}

export async function generateRefreshToken({ email, role, _id }: TokenPayload) {
  const accessExpiry =
    (process.env.JWT_SHORT_EXPIRY as JWT_EXPIRY_FORMAT) || "1d";

  if (!accessExpiry) throw new Error("JWT_ACCESS_EXPIRY is required!");

  return await generateToken({ email, role, _id }, accessExpiry);
}

export async function decodeToken(token: string): Promise<TokenPayload> {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is required!");

  return (await jwt.verify(token, secret)) as TokenPayload;
}
