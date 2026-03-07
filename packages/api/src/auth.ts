import jwt from "jsonwebtoken";

export { hashPassword, verifyPassword } from "@lurnt/utils";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

export function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: "7d",
  });
}

export function verifyToken(
  token: string,
): { userId: string } | null {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as {
      userId: string;
    };
    return payload;
  } catch {
    return null;
  }
}
