import dotenv from "dotenv";
import { StringValue } from "../types.ts";
dotenv.config();

const DEFAULT_ENV_VALUES: Record<string, string> = {
  PORT: "5000",
  NODE_ENV: "development",
  ACCESS_TOKEN_EXPIRY: "1d",
  REFRESH_TOKEN_EXPIRY: "7d",
  SMTP_PORT: "587",
  FRONTEND_URL: "http://localhost:3000",
};

const REQUIRED_ENV_VARS = [
  "PORT",
  "MONGODB_URI",
  "ACCESS_TOKEN_SECRET",
  "REFRESH_TOKEN_SECRET",
  "ACCESS_TOKEN_EXPIRY",
  "REFRESH_TOKEN_EXPIRY",
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_USER",
  "SMTP_PASS",
  "FIREBASE_PRIVATE_KEY",
  "FIREBASE_PROJECT_ID",
  "FIREBASE_CLIENT_EMAIL",
  "FRONTEND_URL",
  "NODE_ENV",
] as const;

const missingVars = REQUIRED_ENV_VARS.filter(
  (key) => !process.env[key] && !DEFAULT_ENV_VALUES[key]
);
if (missingVars.length > 0)
  throw new Error(`Missing environment variables: ${missingVars.join(", ")}`);

export const ENV_CONFIGS: Record<string, string | StringValue> =
  Object.fromEntries(
    REQUIRED_ENV_VARS.map((key) => [
      key,
      key === "ACCESS_TOKEN_EXPIRY" || key === "REFRESH_TOKEN_EXPIRY"
        ? ((process.env[key] || DEFAULT_ENV_VALUES[key]) as StringValue)
        : ((process.env[key] || DEFAULT_ENV_VALUES[key]) as string),
    ])
  );
