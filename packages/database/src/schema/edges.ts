import { mysqlTable, varchar, text, float, mysqlEnum } from "drizzle-orm/mysql-core";
import { genericColumns } from "./genericColumns";
import { nodes } from "./nodes";
import { EdgeRelationEnum } from "@lurnt/domain";

export const edges = mysqlTable("Edge", {
  ...genericColumns,
  sourceNodeId: varchar("sourceNodeId", { length: 128 })
    .notNull()
    .references(() => nodes.id),
  targetNodeId: varchar("targetNodeId", { length: 128 })
    .notNull()
    .references(() => nodes.id),
  relation: mysqlEnum("relation", EdgeRelationEnum.options).notNull(),
  justification: text("justification").notNull(),
  weight: float("weight").notNull().default(1),
});
