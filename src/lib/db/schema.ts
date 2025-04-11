import { pgTable, serial, varchar, text, integer, timestamp, boolean, pgEnum } from "drizzle-orm/pg-core";

export const capstone_program_status = pgEnum("capstone_program_status", [
  "submissions",
  "matching",
  "active",
  "ending",
  "archived",
  "hidden",
]);

export const season = pgEnum("season", [
  "winter",
  "spring",
  "summer",
  "fall",
]);

export const user_type = pgEnum("user_type", [
  "project_partner",
  "student",
  "instructor",
  "admin",
]);

export const capstone_portal_project_programs = pgTable("capstone-portal-project_programs", {
  program_id: serial("program_id").primaryKey(),
  program_name: varchar("program_name", { length: 256 }).notNull(),
  program_description: text("program_description"),
  program_status: capstone_program_status("program_status").notNull(),
  start_term_id: integer("start_term_id").notNull(),
  end_term_id: integer("end_term_id").notNull(),
});

export const capstone_portal_project_term = pgTable("capstone-portal-project_term", {
  id: serial("id").primaryKey(),
  season: season("season").notNull(),
  year: integer("year").notNull(),
  is_published: boolean("is_published").notNull(),
});

export const capstone_portal_project_users = pgTable("capstone-portal-project_users", {
  user_id: serial("user_id").primaryKey(),
  username: varchar("username", { length: 256 }).notNull(),
  email: varchar("email", { length: 256 }).notNull(),
  date_created: timestamp("date_created", { withTimezone: true }).defaultNow().notNull(),
  type: user_type("type"),
  program_id: integer("program_id"),
  ranking_submitted: boolean("ranking_submitted").notNull(),
  team_id: integer("team_id"),
});

export const capstone_portal_project_instructors = pgTable("capstone-portal-project_instructors", {
  program_id: integer("program_id").notNull(),
  user_id: integer("user_id").notNull(),
}); 