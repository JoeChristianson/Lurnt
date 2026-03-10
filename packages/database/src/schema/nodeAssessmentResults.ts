import {
  mysqlTable,
  varchar,
  json,
  boolean,
  foreignKey,
} from "drizzle-orm/mysql-core";
import { genericColumns } from "./genericColumns";
import { nodeAssessments } from "./nodeAssessments";
import { knowledgeGraphNodes } from "./knowledgeGraphNodes";
import { users } from "./users";
import type { AssessmentMessage } from "@lurnt/domain";

export const nodeAssessmentResults = mysqlTable(
  "NodeAssessmentResult",
  {
    ...genericColumns,
    nodeAssessmentId: varchar("nodeAssessmentId", { length: 128 })
      .notNull()
      .references(() => nodeAssessments.id),
    knowledgeGraphNodeId: varchar("knowledgeGraphNodeId", {
      length: 128,
    }).notNull(),
    userId: varchar("userId", { length: 128 })
      .notNull()
      .references(() => users.id),
    conversation: json("conversation")
      .$type<AssessmentMessage[]>()
      .notNull(),
    passed: boolean("passed").notNull(),
  },
  (table) => [
    foreignKey({
      name: "NodeAssessResult_kgNodeId_KGNode_id_fk",
      columns: [table.knowledgeGraphNodeId],
      foreignColumns: [knowledgeGraphNodes.id],
    }),
  ],
);
