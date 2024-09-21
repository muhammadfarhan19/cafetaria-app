/* eslint-disable @typescript-eslint/ban-types */
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { UserType } from "../types/auth.type";

dotenv.config();

export const signJWT = (
  payload: {
    id: number;
    role: "superadmin" | "owner" | "manager" | null;
    user: UserType;
  },
  options?: jwt.SignOptions
) => {
  return jwt.sign(payload, process.env.JWT_PRIVATE as string, {
    ...(options && options),
    algorithm: "RS256",
  });
};

export function verifyJWT(token: string) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_PUBLIC as string, {
      algorithms: ["RS256"],
    }) as { id: number; role: "superadmin" | "owner" | "manager" | null };
    return { decoded };
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return { expired: true };
    }
    if (err instanceof jwt.JsonWebTokenError) {
      throw new Error("Invalid token");
    }
    throw err;
  }
}
