import { mysqlTable, varchar, mysqlEnum } from "drizzle-orm/mysql-core";
import { genericColumns } from "./genericColumns";
import { users } from "./users";
import { expertises } from "./expertises";
import { UserExpertiseStatusEnum } from "@lurnt/domain";

export const userExpertises = mysqlTable("UserExpertise", {
  ...genericColumns,
  userId: varchar("userId", { length: 128 })
    .notNull()
    .references(() => users.id),
  expertiseId: varchar("expertiseId", { length: 128 })
    .notNull()
    .references(() => expertises.id),
  status: mysqlEnum("status", UserExpertiseStatusEnum.options).notNull().default("active"),
});
