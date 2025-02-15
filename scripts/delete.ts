import 'dotenv/config';
import { db } from "~/server/db";
import { 
  savedProjects,
  projectTags,
  projectLog,
  teams,
  projects,
  instructors,
  users,
  programs,
  sequences,
  tags,
  term
} from "~/server/db/schema";

async function clearDatabase() {
  try {
    console.log('Starting database cleanup...');

    // Delete in order of dependencies (child tables first)
    console.log('Deleting saved projects...');
    await db.delete(savedProjects).execute();

    console.log('Deleting project tags...');
    await db.delete(projectTags).execute();

    console.log('Deleting project logs...');
    await db.delete(projectLog).execute();

    console.log('Deleting teams...');
    await db.delete(teams).execute();

    console.log('Deleting projects...');
    await db.delete(projects).execute();

    console.log('Deleting instructors...');
    await db.delete(instructors).execute();

    console.log('Deleting users...');
    await db.delete(users).execute();

    console.log('Deleting programs...');
    await db.delete(programs).execute();

    console.log('Deleting sequences...');
    await db.delete(sequences).execute();

    console.log('Deleting tags...');
    await db.delete(tags).execute();

    console.log('Deleting terms...');
    await db.delete(term).execute();

    console.log('Database cleared successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error clearing database:', error);
    process.exit(1);
  }
}

clearDatabase();