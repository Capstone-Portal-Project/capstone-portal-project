import 'dotenv/config';
import { db } from "~/server/db";
import { term, programs, programStatusEnum } from "~/server/db/schema";

async function main() {
  try {
    console.log('Starting database seeding...');

    // 1. Create Terms
    console.log('Creating terms...');
    const [fall2023, winter2024, spring2024, summer2024] = await db.insert(term)
      .values([
        { season: 'fall', year: 2023, isPublished: true },
        { season: 'winter', year: 2024, isPublished: true },
        { season: 'spring', year: 2024, isPublished: true },
        { season: 'summer', year: 2024, isPublished: true }
      ])
      .returning({ id: term.id })
      .execute();

    if (!fall2023?.id || !winter2024?.id || !spring2024?.id || !summer2024?.id) {
      throw new Error('Failed to create terms');
    }

    // 2. Create Programs from Courses
    console.log('Creating programs from courses...');
    const programsData = [
      {
        programName: 'ENGR 415/416 - Engineering Capstone',
        programDescription: 'General Engineering Capstone Design sequence',
        programStatus: 'active' as const,
        startTermId: fall2023.id,
        endTermId: fall2023.id
      },
      {
        programName: 'CS 461/462/463 - Senior Software Engineering Project',
        programDescription: 'Senior Software Engineering Project sequence',
        programStatus: 'active' as const,
        startTermId: fall2023.id,
        endTermId: spring2024.id
      },
      {
        programName: 'CS 467 - Online Capstone Project',
        programDescription: 'Online Capstone Project (year-round)',
        programStatus: 'active' as const,
        startTermId: fall2023.id,
        endTermId: summer2024.id
      },
      // Forest Engineering and General Forestry
      {
        programName: 'FE/FOR 459 - Forest Management Planning and Design',
        programDescription: 'Forest Management Planning and Design',
        programStatus: 'active' as const,
        startTermId: winter2024.id,
        endTermId: winter2024.id
      }
    ];

    const createdPrograms = await db.insert(programs)
      .values(programsData)
      .returning({ programId: programs.programId, programName: programs.programName })
      .execute();

    if (createdPrograms.length !== programsData.length) {
      throw new Error('Failed to create all programs');
    }

    console.log('Created programs:', createdPrograms.map(p => p.programName).join('\n'));
    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

main();