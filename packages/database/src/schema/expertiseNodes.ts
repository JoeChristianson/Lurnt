import { mysqlTable, varchar } from "drizzle-orm/mysql-core";
import { genericColumns } from "./genericColumns";
import { expertises } from "./expertises";
import { nodes } from "./nodes";

export const expertiseNodes = mysqlTable("ExpertiseNode", {
  ...genericColumns,
  expertiseId: varchar("expertiseId", { length: 128 })
    .notNull()
    .references(() => expertises.id),
  nodeId: varchar("nodeId", { length: 128 })
    .notNull()
    .references(() => nodes.id),
});
