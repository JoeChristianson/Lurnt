import { mysqlTable, varchar, text, mysqlEnum } from "drizzle-orm/mysql-core";
import { genericColumns } from "./genericColumns";
import { nodes } from "./nodes";
import { users } from "./users";
import { ResourceTypeEnum } from "@lurnt/domain";

export const resources = mysqlTable("Resource", {
  ...genericColumns,
  nodeId: varchar("nodeId", { length: 128 })
    .notNull()
    .references(() => nodes.id),
  url: varchar("url", { length: 2000 }).notNull(),
  title: varchar("title", { length: 500 }).notNull(),
  type: mysqlEnum("type", ResourceTypeEnum.options).notNull(),
  description: text("description"),
  submittedByUserId: varchar("submittedByUserId", { length: 128 })
    .references(() => users.id),
});
