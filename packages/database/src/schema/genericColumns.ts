import { varchar, timestamp } from "drizzle-orm/mysql-core";

export const genericColumns = {
  id: varchar("id", { length: 128 }).primaryKey(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow().onUpdateNow(),
};

export const userColumns = {
  ...genericColumns,
  userId: varchar("userId", { length: 128 }).notNull(),
};
