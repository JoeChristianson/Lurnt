import { mysqlTable, varchar, json } from "drizzle-orm/mysql-core";
import { genericColumns } from "./genericColumns";
import { expertises } from "./expertises";
import type { QuizQuestion } from "@lurnt/domain";

export const expertiseQuizzes = mysqlTable("ExpertiseQuiz", {
  ...genericColumns,
  expertiseId: varchar("expertiseId", { length: 128 })
    .notNull()
    .references(() => expertises.id),
  questions: json("questions").$type<QuizQuestion[]>().notNull(),
});
