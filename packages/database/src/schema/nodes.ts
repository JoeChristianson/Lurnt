import { mysqlTable, varchar, text } from "drizzle-orm/mysql-core";
import { genericColumns } from "./genericColumns";

export const nodes = mysqlTable("Node", {
  ...genericColumns,
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
});
