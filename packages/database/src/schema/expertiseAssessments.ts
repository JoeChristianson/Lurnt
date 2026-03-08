import { mysqlTable, varchar, text } from "drizzle-orm/mysql-core";
import { genericColumns } from "./genericColumns";
import { expertises } from "./expertises";

export const expertiseAssessments = mysqlTable("ExpertiseAssessment", {
  ...genericColumns,
  expertiseId: varchar("expertiseId", { length: 128 })
    .notNull()
    .references(() => expertises.id),
  prompt: text("prompt").notNull(),
  gradingInstructions: text("gradingInstructions").notNull(),
});
