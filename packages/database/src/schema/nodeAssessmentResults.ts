import { mysqlTable, varchar, json, boolean } from "drizzle-orm/mysql-core";
import { genericColumns } from "./genericColumns";
import { nodeAssessments } from "./nodeAssessments";
import { knowledgeGraphNodes } from "./knowledgeGraphNodes";
import { users } from "./users";
import type { AssessmentMessage } from "@lurnt/domain";

export const nodeAssessmentResults = mysqlTable("NodeAssessmentResult", {
  ...genericColumns,
  nodeAssessmentId: varchar("nodeAssessmentId", { length: 128 })
    .notNull()
    .references(() => nodeAssessments.id),
  knowledgeGraphNodeId: varchar("knowledgeGraphNodeId", { length: 128 })
    .notNull()
    .references(() => knowledgeGraphNodes.id),
  userId: varchar("userId", { length: 128 })
    .notNull()
    .references(() => users.id),
  conversation: json("conversation").$type<AssessmentMessage[]>().notNull(),
  passed: boolean("passed").notNull(),
});
