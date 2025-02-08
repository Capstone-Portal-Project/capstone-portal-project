import dotenv from 'dotenv';
dotenv.config();

import { db } from "../src/server/db";
import { courses } from "../src/server/db/schema";

async function populateCourses() {
  const courseData = [
    // General Engineering
    { u_id: 1, name: "ENGR 415 - Engineering Capstone Design 1", term: "Fall", course_description: "General Engineering Capstone Design 1", is_archived: false },
    { u_id: 1, name: "ENGR 415 - Engineering Capstone Design 1", term: "Winter", course_description: "General Engineering Capstone Design 1", is_archived: false },
    { u_id: 1, name: "ENGR 416 - Engineering Capstone Design 2", term: "Winter", course_description: "General Engineering Capstone Design 2", is_archived: false },
    { u_id: 1, name: "ENGR 416 - Engineering Capstone Design 2", term: "Spring", course_description: "General Engineering Capstone Design 2", is_archived: false },
    // Architectural Engineering
    { u_id: 1, name: "ARE 419 - Architectural Engineering Design", term: "Spring", course_description: "Architectural Engineering Design", is_archived: false },
    // Civil Engineering
    { u_id: 1, name: "CE 419 - Civil Infrastructure Design", term: "Spring", course_description: "Civil Infrastructure Design", is_archived: false },
    // Mechanical, Industrial, and Manufacturing Engineering (MIME)
    { u_id: 1, name: "MIME 497 - MIME Capstone Design", term: "Fall", course_description: "MIME Capstone Design", is_archived: false },
    { u_id: 1, name: "MIME 497 - MIME Capstone Design", term: "Winter", course_description: "MIME Capstone Design", is_archived: false },
    { u_id: 1, name: "MIME 497 - MIME Capstone Design", term: "Spring", course_description: "MIME Capstone Design", is_archived: false },
    { u_id: 1, name: "MIME 498 - MIME Capstone Design", term: "Winter", course_description: "MIME Capstone Design", is_archived: false },
    { u_id: 1, name: "MIME 498 - MIME Capstone Design", term: "Spring", course_description: "MIME Capstone Design", is_archived: false },
    // Bioengineering
    { u_id: 1, name: "BIOE 496 - Bioengineering Capstone Design", term: "Winter", course_description: "Bioengineering Capstone Design", is_archived: false },
    // Electrical and Computer Engineering (ECE)
    { u_id: 1, name: "ECE 506 - Projects/AI Capstone I", term: "Fall", course_description: "Projects/AI Capstone I", is_archived: false },
    { u_id: 1, name: "ECE 506 - Projects/AI Capstone II", term: "Winter", course_description: "Projects/AI Capstone II", is_archived: false },
    { u_id: 1, name: "ECE 506 - Projects/AI Capstone III", term: "Spring", course_description: "Projects/AI Capstone III", is_archived: false },
    // Computer Science
    { u_id: 1, name: "CS 428 - Cybersecurity Capstone Project", term: "Fall", course_description: "Cybersecurity Capstone Project", is_archived: false },
    { u_id: 1, name: "CS 461 - Senior Software Engineering Project I", term: "Fall", course_description: "Senior Software Engineering Project I", is_archived: false },
    { u_id: 1, name: "CS 462 - Senior Software Engineering Project II", term: "Winter", course_description: "Senior Software Engineering Project II", is_archived: false },
    { u_id: 1, name: "CS 463 - Senior Software Engineering Project III", term: "Spring", course_description: "Senior Software Engineering Project III", is_archived: false },
    { u_id: 1, name: "CS 467 - Online Capstone Project", term: "Fall", course_description: "Online Capstone Project", is_archived: false },
    { u_id: 1, name: "CS 467 - Online Capstone Project", term: "Winter", course_description: "Online Capstone Project", is_archived: false },
    { u_id: 1, name: "CS 467 - Online Capstone Project", term: "Spring", course_description: "Online Capstone Project", is_archived: false },
    { u_id: 1, name: "CS 467 - Online Capstone Project", term: "Summer", course_description: "Online Capstone Project", is_archived: false },
    // Forest Engineering
    { u_id: 1, name: "FE 459 - Forest Management Planning and Design I", term: "Winter", course_description: "Forest Management Planning and Design I", is_archived: false },
    // General Forestry
    { u_id: 1, name: "FOR 459 - Forest Management Planning and Design I", term: "Winter", course_description: "Forest Management Planning and Design I", is_archived: false },
  ];

  try {
    for (const course of courseData) {
      await db.insert(courses).values(course).execute();
    }
    console.log("Courses populated successfully.");
  } catch (error) {
    console.error("Error populating courses:", error);
  }
}

populateCourses();