import { mysqlTable, varchar, json, boolean } from "drizzle-orm/mysql-core";
import { genericColumns } from "./genericColumns";
import { expertiseAssessments } from "./expertiseAssessments";
import { userExpertises } from "./userExpertises";
import { users } from "./users";
import type { AssessmentMessage } from "@lurnt/domain";

export const expertiseAssessmentResults = mysqlTable("ExpertiseAssessmentResult", {
  ...genericColumns,
  expertiseAssessmentId: varchar("expertiseAssessmentId", { length: 128 })
    .notNull()
    .references(() => expertiseAssessments.id),
  userExpertiseId: varchar("userExpertiseId", { length: 128 })
    .notNull()
    .references(() => userExpertises.id),
  userId: varchar("userId", { length: 128 })
    .notNull()
    .references(() => users.id),
  conversation: json("conversation").$type<AssessmentMessage[]>().notNull(),
  passed: boolean("passed").notNull(),
});
