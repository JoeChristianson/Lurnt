import { mysqlTable, varchar, text } from "drizzle-orm/mysql-core";
import { genericColumns } from "./genericColumns";
import { nodes } from "./nodes";

export const nodeAssessments = mysqlTable("NodeAssessment", {
  ...genericColumns,
  nodeId: varchar("nodeId", { length: 128 })
    .notNull()
    .references(() => nodes.id),
  prompt: text("prompt").notNull(),
  gradingInstructions: text("gradingInstructions").notNull(),
});
