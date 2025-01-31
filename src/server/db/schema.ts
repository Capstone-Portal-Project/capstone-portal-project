// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import {
  integer,
  pgTableCreator,
  timestamp,
  text,
  boolean,
  real,
  varchar,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `capstone-portal-project_${name}`);

export const users = createTable(
  "users",
  {
    u_id: integer("u_id").primaryKey().generatedByDefaultAsIdentity(),
    u_name: varchar("u_name", { length: 256 }).notNull(),
    email: varchar("email", { length: 256 }).notNull(),
  }
);

export const courses = createTable(
  "course",
  {
    course_id: integer("course_id").primaryKey().generatedByDefaultAsIdentity(),
    u_id: integer("u_id").references(() => users.u_id).notNull(),
    name: varchar("name", { length: 256 }).notNull(),
    term: varchar("term", { length: 256 }).notNull(),
    course_description: text("course_description"),
    is_archived: boolean("is_archived").notNull(),
  }
);

export const capstoneProjects = createTable(
  "capstone_project",
  {
    cp_id: integer("cp_id").primaryKey().generatedByDefaultAsIdentity(),
    course_id: integer("course_id").references(() => courses.course_id).notNull(),
    cp_title: varchar("cp_title", { length: 256 }).notNull(),
    cp_description: text("cp_description"),
    cp_objectives: text("cp_objectives"),
    cp_date_created: timestamp("cp_date_created", { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull(),
    cp_date_updated: timestamp("cp_date_updated", { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull(),
    cp_archived: boolean("cp_archived").notNull(),
  }
);

export const savedProjects = createTable(
  "saved_project",
  {
    save_id: integer("save_id").primaryKey().generatedByDefaultAsIdentity(),
    u_id: integer("u_id").references(() => users.u_id).notNull(),
    cp_id: integer("cp_id").references(() => capstoneProjects.cp_id).notNull(),
    date_saved: timestamp("date_saved", { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  }
);

export const reviews = createTable(
  "review",
  {
    review_id: integer("review_id").primaryKey().generatedByDefaultAsIdentity(),
    u_id: integer("u_id").references(() => users.u_id).notNull(),
    rating: real("rating").notNull(),
    comments: text("comments"),
    date_created: timestamp("date_created", { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  }
);