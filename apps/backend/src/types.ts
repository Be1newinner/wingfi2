import "express";

export type StringValue =
  | `${number}`
  | `${number}${"d" | "m" | "h"}`
  | `${number} ${"d" | "m" | "h"}`;

// src/types/express/index.d.ts

declare module "express" {
  export interface Request {
    user?: {
      email: string;
      role: string;
      uid: string;
    };
  }
}
