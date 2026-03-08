import { mysqlTable, varchar, json } from "drizzle-orm/mysql-core";
import { genericColumns } from "./genericColumns";
import { nodes } from "./nodes";
import type { QuizQuestion } from "@lurnt/domain";

export const nodeQuizzes = mysqlTable("NodeQuiz", {
  ...genericColumns,
  nodeId: varchar("nodeId", { length: 128 })
    .notNull()
    .references(() => nodes.id),
  questions: json("questions").$type<QuizQuestion[]>().notNull(),
});
