import { mysqlTable, varchar, mysqlEnum } from "drizzle-orm/mysql-core";
import { genericColumns } from "./genericColumns";
import { knowledgeGraphs } from "./knowledgeGraphs";
import { nodes } from "./nodes";
import { KnowledgeGraphNodeStatusEnum } from "@lurnt/domain";

export const knowledgeGraphNodes = mysqlTable("KnowledgeGraphNode", {
  ...genericColumns,
  knowledgeGraphId: varchar("knowledgeGraphId", { length: 128 })
    .notNull()
    .references(() => knowledgeGraphs.id),
  nodeId: varchar("nodeId", { length: 128 })
    .notNull()
    .references(() => nodes.id),
  status: mysqlEnum("status", KnowledgeGraphNodeStatusEnum.options).notNull().default("locked"),
});
