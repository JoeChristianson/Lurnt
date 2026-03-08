import { mysqlTable, varchar } from "drizzle-orm/mysql-core";
import { genericColumns } from "./genericColumns";
import { userExpertises } from "./userExpertises";

export const knowledgeGraphs = mysqlTable("KnowledgeGraph", {
  ...genericColumns,
  userExpertiseId: varchar("userExpertiseId", { length: 128 })
    .notNull()
    .references(() => userExpertises.id),
});
