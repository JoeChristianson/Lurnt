import { mysqlTable, varchar, tinyint, uniqueIndex } from "drizzle-orm/mysql-core";
import { genericColumns } from "./genericColumns";
import { resources } from "./resources";
import { users } from "./users";

export const resourceVotes = mysqlTable("ResourceVote", {
  ...genericColumns,
  resourceId: varchar("resourceId", { length: 128 })
    .notNull()
    .references(() => resources.id),
  userId: varchar("userId", { length: 128 })
    .notNull()
    .references(() => users.id),
  value: tinyint("value").notNull(),
}, (table) => ({
  uniqueVote: uniqueIndex("unique_resource_user_vote").on(table.resourceId, table.userId),
}));
