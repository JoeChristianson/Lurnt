import { mysqlTable, varchar, json, float, boolean } from "drizzle-orm/mysql-core";
import { genericColumns } from "./genericColumns";
import { expertiseQuizzes } from "./expertiseQuizzes";
import { userExpertises } from "./userExpertises";
import { users } from "./users";
import type { QuizAnswer } from "@lurnt/domain";

export const expertiseQuizResults = mysqlTable("ExpertiseQuizResult", {
  ...genericColumns,
  expertiseQuizId: varchar("expertiseQuizId", { length: 128 })
    .notNull()
    .references(() => expertiseQuizzes.id),
  userExpertiseId: varchar("userExpertiseId", { length: 128 })
    .notNull()
    .references(() => userExpertises.id),
  userId: varchar("userId", { length: 128 })
    .notNull()
    .references(() => users.id),
  answers: json("answers").$type<QuizAnswer[]>().notNull(),
  score: float("score").notNull(),
  passed: boolean("passed").notNull(),
});
