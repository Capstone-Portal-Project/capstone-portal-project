import { sql } from "drizzle-orm";
import {
  integer,
  pgTableCreator,
  timestamp,
  text,
  boolean,
  varchar,
  pgEnum,
  primaryKey,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `capstone-portal-project_${name}`);

// Enums
export const userTypeEnum = pgEnum('user_type', ['project_partner', 'student', 'instructor', 'admin']);
export const programStatusEnum = pgEnum('capstone_program_status', ['submissions', 'matching', 'active', 'ending', 'archived', 'hidden']);
export const projectStatusEnum = pgEnum('capstone_project_status', ['draft', 'submitted', 'deferred', 'active', 'archived', 'incomplete']);
export const projectLogTypeEnum = pgEnum('capstone_project_log_type', ['submission', 'deferment', 'approval', 'partner_message', 'instructor_admin_message', 'course_transfer']);
export const sequenceTypeEnum = pgEnum('sequence_type', ['iterated', 'repeated']);
export const seasonEnum = pgEnum('season', ['winter', 'spring', 'summer', 'fall']);

/**
 * Users table schema.
 */
export const users = createTable(
  "users",
  {
    userId: integer("user_id").primaryKey().generatedByDefaultAsIdentity(),
    username: varchar("username", { length: 256 }).notNull(),
    email: varchar("email", { length: 256 }).notNull(),
    dateCreated: timestamp("date_created", { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull(),
    type: userTypeEnum("type"),
    clerk_user_id: varchar("clerk_user_id", { length: 256 }).notNull(),

    // Students only
    programId: integer("program_id").references(() => programs.programId),
    rankingSubmitted: boolean("ranking_submitted").notNull(),
    teamId: integer("team_id").references(() => teams.teamId),
    projectId: integer("project_id").references(() => projects.projectId)
  }
);

/**
 * Term table schema.
 */
export const term = createTable(
  "term",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    season: seasonEnum("season").notNull(),
    year: integer("year").notNull(),
    isPublished: boolean("is_published").notNull(),
  }
);

/**
 * Programs table schema.
 */
export const programs = createTable(
  "programs",
  {
    programId: integer("program_id").primaryKey().generatedByDefaultAsIdentity(),
    programName: varchar("program_name", { length: 256 }).notNull(),
    programDescription: text("program_description"),
    programStatus: programStatusEnum("program_status").notNull(),
    startTermId: integer("start_term_id").references(() => term.id).notNull(),
    endTermId: integer("end_term_id").references(() => term.id).notNull(),
  }
);

/**
 * Instructors table schema.
 */
export const instructors = createTable("instructors", {
  programId: integer("program_id").notNull().references(() => programs.programId),
  userId: integer("user_id").notNull().references(() => users.userId),
}, (table) => {
  return {
    pk: primaryKey({ columns: [table.programId, table.userId] })
  }
});

/**
 * Sequences table schema.
 */
export const sequences = createTable(
  "sequences",
  {
    sequenceId: integer("sequence_id").primaryKey().generatedByDefaultAsIdentity(),
    type: sequenceTypeEnum("type"),
    description: text("description"),
    showReportsToStudent: boolean("show_reports_to_student").notNull(),
  }
);

/**
 * Projects table schema.
 */
export const projects = createTable(
  "projects",
  {
    projectId: integer("project_id").primaryKey().generatedByDefaultAsIdentity(),
    programsId: integer("programs_id").references(() => programs.programId).notNull(),
    projectTitle: varchar("project_title", { length: 256 }).notNull(),
    
    // Application fields
    appImage: varchar("app_image", { length: 512 }).default(""),
    appVideo: varchar("app_video", { length: 512 }).default(""),
    appOrganization: varchar("app_organization", { length: 512 }).notNull(),
    appDescription: text("app_description").notNull(),
    appObjectives: text("app_objectives").notNull(),
    appMotivations: text("app_motivations").notNull(),
    appMinQualifications: text("app_min_qualifications").notNull(),
    appPrefQualifications: text("app_pref_qualifications").notNull(),
    
    // Showcase fields
    showcaseDescription: text("showcase_description"),
    showcaseImage: varchar("showcase_image", { length: 512 }),
    showcaseVideo: varchar("showcase_video", { length: 512 }),
    isShowcasePublished: boolean("is_showcase_published"),
    
    // Sequence info
    sequenceId: integer("sequence_id").references(() => sequences.sequenceId),
    sequenceReport: text("sequence_report"),
    projectGithubLink: varchar("project_github_link", { length: 512 }),
    projectStatus: projectStatusEnum("project_status").default("draft"),
  }
);

/**
 * Project log table schema.
 */
export const projectLog = createTable(
  "project_log",
  {
    projectLogId: integer("project_log_id").primaryKey().generatedByDefaultAsIdentity(),
    projectId: integer("project_id").references(() => projects.projectId).notNull(),
    dateCreated: timestamp("date_created", { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull(),
    content: text("content"),
    memo: text("memo"),
    userId: integer("user_id").references(() => users.userId).notNull(),
    projectLogType: projectLogTypeEnum("project_log_type").notNull(),
  }
);

/**
 * Tags table schema.
 */
export const tags = createTable(
  "tags",
  {
    tagId: integer("tag_id").primaryKey().generatedByDefaultAsIdentity(),
    tag: varchar("tag", { length: 256 }),
  }
);

/**
 * Project tags table schema.
 */
export const projectTags = createTable(
  "project_tags",
  {
    projectTagId: integer("project_tag_id").primaryKey().generatedByDefaultAsIdentity(),
    capstone: integer("capstone").references(() => projects.projectId).notNull(),
    tagId: integer("tag_id").references(() => tags.tagId).notNull(),
  }
);

/**
 * Teams table schema.
 */
export const teams = createTable(
  "teams",
  {
    teamId: integer("team_id").primaryKey().generatedByDefaultAsIdentity(),
    projectId: integer("project_id").references(() => projects.projectId).notNull(),
    capacity: integer("capacity"),
    dateCreated: timestamp("date_created", { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull(),
    dateUpdated: timestamp("date_updated", { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  }
);

/**
 * Saved projects table schema.
 */
export const savedProjects = createTable(
  "saved_projects",
  {
    saveId: integer("save_id").primaryKey().generatedByDefaultAsIdentity(),
    userId: integer("user_id").references(() => users.userId).notNull(),
    projectId: integer("project_id").references(() => projects.projectId).notNull(),
    saveIndex: integer("save_index").notNull(),
    preferenceDescription: text("preference_description"),
  }
);

/**
 * Capstone Project Portal Home Page table schema.
 */
export const homepageContent = createTable(
  "homepage_content",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    heroTitle: varchar("hero_title", { length: 256 }).notNull(),
    heroSubtitle: varchar("hero_subtitle", { length: 256 }).notNull(),
    mainContent: text("main_content").notNull(),
  }
);