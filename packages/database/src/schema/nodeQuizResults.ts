import { mysqlTable, varchar, json, float, boolean } from "drizzle-orm/mysql-core";
import { genericColumns } from "./genericColumns";
import { nodeQuizzes } from "./nodeQuizzes";
import { knowledgeGraphNodes } from "./knowledgeGraphNodes";
import { users } from "./users";
import type { QuizAnswer } from "@lurnt/domain";

export const nodeQuizResults = mysqlTable("NodeQuizResult", {
  ...genericColumns,
  nodeQuizId: varchar("nodeQuizId", { length: 128 })
    .notNull()
    .references(() => nodeQuizzes.id),
  knowledgeGraphNodeId: varchar("knowledgeGraphNodeId", { length: 128 })
    .notNull()
    .references(() => knowledgeGraphNodes.id),
  userId: varchar("userId", { length: 128 })
    .notNull()
    .references(() => users.id),
  answers: json("answers").$type<QuizAnswer[]>().notNull(),
  score: float("score").notNull(),
  passed: boolean("passed").notNull(),
});
