import { mysqlTable, varchar, text } from "drizzle-orm/mysql-core";
import { genericColumns } from "./genericColumns";
import { users } from "./users";

export const items = mysqlTable("Item", {
  ...genericColumns,
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull().default(""),
  userId: varchar("userId", { length: 128 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});
