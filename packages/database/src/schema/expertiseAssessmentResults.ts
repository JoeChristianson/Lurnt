import {
  mysqlTable,
  varchar,
  json,
  boolean,
  foreignKey,
  mysqlEnum,
} from "drizzle-orm/mysql-core";
import { genericColumns } from "./genericColumns";
import { expertiseAssessments } from "./expertiseAssessments";
import { userExpertises } from "./userExpertises";
import { users } from "./users";
import type { AssessmentMessage, IntakeSummary } from "@lurnt/domain";

export const expertiseAssessmentResults = mysqlTable(
  "ExpertiseAssessmentResult",
  {
    ...genericColumns,
    expertiseAssessmentId: varchar("expertiseAssessmentId", {
      length: 128,
    }),
    userExpertiseId: varchar("userExpertiseId", { length: 128 })
      .notNull()
      .references(() => userExpertises.id),
    userId: varchar("userId", { length: 128 })
      .notNull()
      .references(() => users.id),
    conversation: json("conversation")
      .$type<AssessmentMessage[]>()
      .notNull(),
    passed: boolean("passed").notNull().default(false),
    status: mysqlEnum("status", ["in_progress", "completed"])
      .notNull()
      .default("in_progress"),
    summary: json("summary").$type<IntakeSummary>(),
  },
  (table) => [
    foreignKey({
      name: "ExpAssessResult_assessId_ExpAssess_id_fk",
      columns: [table.expertiseAssessmentId],
      foreignColumns: [expertiseAssessments.id],
    }),
  ],
);
