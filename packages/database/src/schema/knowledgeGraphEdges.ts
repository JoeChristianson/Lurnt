import { mysqlTable, varchar } from "drizzle-orm/mysql-core";
import { genericColumns } from "./genericColumns";
import { knowledgeGraphs } from "./knowledgeGraphs";
import { edges } from "./edges";

export const knowledgeGraphEdges = mysqlTable("KnowledgeGraphEdge", {
  ...genericColumns,
  knowledgeGraphId: varchar("knowledgeGraphId", { length: 128 })
    .notNull()
    .references(() => knowledgeGraphs.id),
  edgeId: varchar("edgeId", { length: 128 })
    .notNull()
    .references(() => edges.id),
});
