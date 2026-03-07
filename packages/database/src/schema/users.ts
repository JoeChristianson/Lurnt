import {
  mysqlTable,
  varchar,
  timestamp,
  tinyint,
  json,
} from "drizzle-orm/mysql-core";

export type SocialLinks = {
  twitter?: string;
  instagram?: string;
  bluesky?: string;
  mastodon?: string;
} | null;

export const users = mysqlTable("User", {
  id: varchar("id", { length: 128 }).primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  handle: varchar("handle", { length: 255 }).unique(),
  passwordHash: varchar("passwordHash", { length: 255 }),
  googleId: varchar("googleId", { length: 128 }).unique(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow().onUpdateNow(),
  termsAcceptedAt: timestamp("termsAcceptedAt"),
  emailVerified: tinyint("emailVerified").notNull().default(0),
  emailVerificationToken: varchar("emailVerificationToken", { length: 128 }),
  emailVerificationExpiresAt: timestamp("emailVerificationExpiresAt"),
  bio: varchar("bio", { length: 500 }),
  websiteUrl: varchar("websiteUrl", { length: 500 }),
  socialLinks: json("socialLinks").$type<SocialLinks>(),
  theme: varchar("theme", { length: 32 }),
  isAdmin: tinyint("isAdmin").notNull().default(0),
});

