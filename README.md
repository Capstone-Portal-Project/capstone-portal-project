# UNIFIED CAPSTONE PORTAL

Welcome the unified capstone portal, a one-stop-shop capstone project portal for school programs. Oregon State University's College of Engineering have several versions of a senior capstone project in different academic programs, where groups of students develop a project submitted by an employee of a company or an instructor at OSU. However, information and project management between all of these is variable. This project is a proposed solution to the current issues of capstone project management. It aims to act as a proof of concept for a more approchable, robust, and future-proof capstone project management system.

## Table of Contents
- [About](#about)
  - [The Issues We Aim to Address](#the-issues-we-aim-to-address)
  - [Key Features](#key-features)
  - [Benefits and Target Audeince](#benefits-and-target-audeince)
  - [Key Technologies Used](#key-technologies-used)
  - [Architecture Overview](#architecture-overview)
  - [Development Challenges](#development-challenges)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Services](#services)
  - [Installation](#installation)
  - [Deployment](#deployment)
- [Usage](#usage)
  - [User Roles](#user-roles)
    - [Administrator](#administrator)
    - [Instructor](#instructor)
    - [Student](#student)
- [Maintenance](#maintenance)
  - [Style](#style)
  - [Contribution](#contribution)
  - [List of features or use cases implemented](#list-of-features-or-use-cases-implemented-wrt-requirements)
  - [Known Issues and Future Enhancements list](#known-issues-and-future-enhancements)
- [Contact the Team](#contact-the-team)

## About 
### The Issues We Aim to Address
* The College of Engineering has a variety of capstone programs, across its diverse fields of study. However, the web presence for all of these is spread out between several websites and portals.​
* Potential project partners struggle to understand all of the options available to them. User interface design is inconsistent between these programs, leading to challenges in submitting projects, and potentially preventing greater participation.​
* There is no way for marketing officials for the College of Engineering to message a unified brand identity around its capstone projects. This has cascading effects, like introducing difficulty for program managers in ​
* Capstone program instructors are forced to coordinate externally, leading to inefficiency in managing hundreds of students and a greater chance of management mistakes.​
* Students have to navigate a mix of information and often unintuitive UI's for selecting their project.​

### Key Features
- Enhanced Student-Project Matching – Students can rank the projects available to them. Through our student-matching tools, instructors can create project groups with ease.​
- Project Submission Management – Instructors have easy-to-use project approval features, including seamless communication with project partners. Our project management log feature allow for multiple instructors to track communication and approval of projects.​
- Program Collaboration – Projects can be transferred between any capstone programs, allowing instructors from around the college to share projects.

### Benefits and Target Audeince
Our design centers approachability for project partners, potential OSU students, and other members of the public. Our UI is easy to navigate and includes hints for those without a technical background.​ Interested members of the public can now browse past capstone projects in the project showcase. This allows for potential project partners to see past projects similar to theirs and for recruiters to see the great work of potential employees from OSU.​

### Key Technologies Used
Having the freedom to start from scratch gave us the flexibility to choose a tech stack that balanced performance, developer productivity, and ease of deployment. We chose to base our stack on the T3 Stack, a modern full-stack framework known for rapid prototyping, strong type safety, and first-class developer experience. Our implementation included:

- Next.js (Frontend Framework)
- React (Component Library)
- Drizzle ORM (Type-safe SQL ORM)
- Clerk (Authentication and User Management)
- NeonDB (PostgreSQL-compatible serverless database)
- ShadCN UI (Accessible UI components)
- TailwindCSS (Utility-first styling)
- Vercel (Hosting and deployment)
  
At the core of our application, we used Next.js, which served as both our frontend framework and backend API layer. Its static generation and server-side rendering made it ideal for building a performant, SEO-friendly web application. We used React to construct a componentized front end, which simplified development and improved consistency across pages. We also opted to use Typescript for its strong typing which helped reduce bugs.

To manage data persistence, we used Drizzle ORM alongside NeonDB hosted on Vercel, a serverless PostgreSQL-compatible database. Drizzle stood out for its type-safe approach to querying and schema management, giving us full control over our SQL. We chose NeonDB for its relational structure which aligned with the schema we adapted from the original capstone website. This combination enabled a smooth and reliable data layer that integrated well with our api.

We used Clerk for out of the box authentication, user management, and building a multi-tenant application. Clerk’s integration with Next.js middleware and API routes allowed us to specify protected resources with minimal boilerplate. We also specified admin, instructor, and student roles, each with their own permissions across different courses.
Finally, we deployed our application using Vercel, which was a huge part of 
our testing and CI/CD. It seamlessly integrates with Next.js, enabling us to ship code when pushing to main, and preview environments before merging it into production. This greatly improved collaboration and gave us continuous delivery capabilities with minimal setup.

### Architecture Overview
![Capstone](https://github.com/user-attachments/assets/4bc34a9f-f40a-4426-a5e5-41a5f19b16a8)

### Development Challenges 
One of our early challenges was onboarding team members who were new to React and Next.js. Getting everyone comfortable with the codebase and modern development patterns within a short timeframe required communication and a willingness for everyone to learn. To aid this process, we shared documentation, posted helpful resources, and pair programmed to accelerate learning. We also used Jira to manage tasks and track progress, which helped keep development focused and aligned even during our busiest weeks of the term.

Another major challenge was adapting the existing database schema to support the new features we were building. Deciding what to keep, refactor, or remove led to several mid-project revisions that occasionally caused disruptions. Implementing multi-tenant authentication with Clerk was also new territory for everyone. We spent significant time reviewing Clerk's documentation—particularly around user management and organizations—and worked closely with our project lead to clarify role-based access and permissions.

## Getting Started
### Prerequisites
* [Node.js](https://nodejs.org/en)
* npm
    ```sh
    npm install -g npm
    ```
### Services
Our project utilizes several third-party providers and services, each will require their own separate accounts. 

#### [Uploadthing](https://uploadthing.com/) &mdash; Placeholder Image Hosting
  
  Used for uploading and hosting images and files within the portal, such as project images or user-uploaded documents. Simplifies file management and integration with the frontend.

#### [Clerk](https://clerk.com/) &mdash; Authentication Provider

  Provides authentication, user management, and multi-tenant organization support. Enables secure sign-in, role-based access, and user invitations for students, instructors, and admins. 

  [🔗 Official Documentation](https://clerk.com/docs/)

#### [Vercel](https://vercel.com/) &mdash; Hosting Platform
  
  Hosts and deploys the web application and serverless backend. Offers seamless integration with Next.js for continuous deployment, preview environments, and production hosting.

  [🔗 Official Documentation](https://vercel.com/docs)

### Installation
1. Clone the repo
    ```sh
    git clone https://github.com/Capstone-Portal-Project/capstone-portal-project.git
    ```
2. Install NPM packages
    ```sh
    npm install
    ```
3. Create a `.env` with your configuration
    ```dotenv
    DATABASE_URL='postgres://<username>:<password>@localhost:3000/'
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY='y0ur_s3cr3t_k3y'
    CLERK_SECRET_KEY='y0ur_s3cr3t_k3y'
    UPLOADTHING_TOKEN='yOuRtOkEn'
    ```
4. Migrate the database
    ```sh
    npm run db:push
    ```
5. Start the server
    ```sh
    # development
    npm run dev

    # production
    npm run build
    npm start
    ```

### Deployment

[Vercel](#vercel--hosting-platform) automatically builds and deploys the project on every push to the main branch or pull request. Each update triggers a new build and live deployment, with preview links for pull requests and instant production updates after merging. No manual setup is needed as Vercel manages the process for you.

See the [🔗 Official Documentation](https://vercel.com/docs/deployments) to manage and troubleshoot deployments.

## Usage
Different roles have different management tools through the application.

### User Roles

- [Administrator](#administrator)
- [Instructor](#instructor)
- [Student](#student)

### Administrator

#### Assign instructors to manage specific capstone programs.
1. **Navigate to:** Admin Dashboard > Program Management
2. **Step 1:** Select the edit icon 📝 with the desired account
3. **Step 2:** Select desired program in "Organization" drop down menu
4. **Step 3:** Click "Save Changes" to save the assignment.
5. **Result:** The instructor is now assigned to the program.

![image](https://github.com/user-attachments/assets/7aba8126-cd9c-4a6f-8498-c51edfd362b2)

#### Alternatively: Drag and Drop instructor assignments
1. **Navigate to:** Admin Dashboard > Instructor Assignments
2. **Step 1:** Find the desired instructor to assign to a program.
3. **Step 2:** Drag and drop over the course you want the instructor to be assgined to.
5. **Result:** The instructor is now assigned to the program.

![image](https://github.com/user-attachments/assets/867e5824-19d7-4772-9fc1-237f8e7ca6a9)

#### Program Management: Add New Program

1. **Navigate to:** Admin Dashboard > Program Management    
2. **Step 1:** Press Create New Program Button.
3. **Step 2:** Fill in information like program name, description, term dates, instructors, etc.
4. **Step 3:** Press Create New Program.
5. **Result:** A new program has been created!

![image](https://github.com/user-attachments/assets/fcd67dca-bab2-434a-858a-22c9a908fb46)

#### Program Management: Edit Program

1. **Navigate to:** Admin Dashboard > Program Management    
2. **Step 1:** Find Program you want to edit in the Table.
3. **Step 2:** Click Edit Button for the corresponding program.
4. **Step 3:** Edit any details provided by the form
5. **Step 4:** Press Save Changes.
5. **Result:** A new program has been edited!

![image](https://github.com/user-attachments/assets/8771bc67-2cd1-4acf-bf77-9f2442d8c9ac)

#### Program Management: Delete Program

1. **Navigate to:** Admin Dashboard > Program Management    
2. **Step 1:** Find Program you want to delete in the Table.
3. **Step 2:** Click Delete Button for the corresponding program.
4. **Step 3:** Confirm deletion of program by pressing Delete Program.
5. **Result:** A new program has been deleted!

![image](https://github.com/user-attachments/assets/97bcb891-51d8-4db2-9fcf-e0e0af0c03a0)

#### Program Management: Admin Manage Program

1. **Navigate to:** Admin Dashboard > Program Management    
2. **Step 1:** Find Program you want to manage in the Table.
3. **Step 2:** Click Manage Button for the corresponding program.
5. **Result:** You are now routed to an admin portal with instructor tools for a specific program! See instructor section for more in-depth guides on how to use tools.

![image](https://github.com/user-attachments/assets/da943635-f649-477d-901f-170880e852de)

![image](https://github.com/user-attachments/assets/8c263465-7d90-490e-8ddf-4d69dc7e8019)

#### Update Home Page

1. **Navigate to:** Admin Dashboard > Update Home 
2. **Step 1:** Fill in Title, Subtitle, and Description.
3. **Step 2:** Click Update Content.
5. **Result:** The home page is now updated with new details!

![image](https://github.com/user-attachments/assets/553f5dd4-b7b7-4e86-b980-7b0bc00bd078)

### Instructor

#### Assign students to different projects

1. **Navigate to:** Instructor Dashboard > Project Assignments
2. **Step 1:** Drag desired student to assign to a project.
3. **Step 2:** Drop student 
3. **Repeat Steps 1 and 2 until satisfied**
4. **Step 3:** Select Apply Changes to Save changes. 
5. **Result:** Students will now have been assigned to projects!

![image](https://github.com/user-attachments/assets/aa5b6f45-c7f5-4975-9cb1-9a1047f975be)

#### View Project Details

1. **Navigate to:** Instructor Dashboard > Course Projects
2. **Step 1:** Click on Details button in corresponding project card.
5. **Result:** Project Page will now be displayed for the instructor!
  
![image](https://github.com/user-attachments/assets/76898fae-e835-426c-9bff-b94e4df3c2d0)


#### Transfer Projects to Another Program

1. **Navigate to:** Instructor Dashboard > Course Projects
2. **Step 1:** Click on the change program menu.
3. **Step 2:** Select desired program to change to.
4. **Step 3:** Press Refresh Button in Top Right to view changes. 
5. **Result:** Project will now be transferred to a new course!
  
![image](https://github.com/user-attachments/assets/76898fae-e835-426c-9bff-b94e4df3c2d0)

#### View Project/Program Logs

1. **Navigate to:** Instructor Dashboard > Project Logs
2. **Result:** Logs detailing various events in a program will be displayed for the instructor. Various sorting options are avaliable like project submission and communication logs.

![image](https://github.com/user-attachments/assets/b9ef7f74-34f2-4a02-80cd-7b9a5871f708)

#### View Program Students and Instructors

1. **Navigate to:** Instructor Dashboard > Manage Course
2. **Step 1:** Select Members tab in Organization menu.
3. **Result:** Students and Instructors are now visible to see and manage in this menu.

![image](https://github.com/user-attachments/assets/62e286df-103d-484f-bb95-7c4fc5ff9655)


#### Invite Student to Join Course

1. **Navigate to:** Instructor Dashboard > Manage Course
2. **Step 1:** Select Members tab in Organization menu.
3. **Step 2:** Press Invite Button to make a input appear.
4. **Step 3:** Paste in email addresses to send an invite link.
5. **Step 4:** Click Send Invitations.
3. **Result:** Students are now invited to sign up as students in a program.

![image](https://github.com/user-attachments/assets/e612d905-87d1-45a9-ac27-2e0ca4368255)

### Student

#### Compact view of available projects

1. **Navigate to:** Browse Current Projects
3. **Result:** Students can scroll through and search for specific projects that fit their interests.
  
![image](https://github.com/user-attachments/assets/02d73249-45d9-40f0-a040-42f56a3c216c)

#### Save projects for easier access later
  
1. **Navigate to:** Browse Current Projects
2. **Step 1:** Click on 📌 to save a project
3. **Step 2:** Go to "📌 Saved" Page to see all saved projects
3. **Result:** Students can now view their saved projects that they are interested in.

![image](https://github.com/user-attachments/assets/60e350b2-e1cd-4b92-8921-2c069c0edc82)

## Maintenance
### Style
 In order to ensure our project is stylistically coherent for ease of development between everyone 
 on the team, we recommend these guides.

* [Commits](https://www.conventionalcommits.org/en/v1.0.0/)
* [React Frontend](https://airbnb.io/javascript/react/)

### Contribution
Our project follows the [Github Flow](https://docs.github.com/en/get-started/using-github/github-flow) workflow, where the main branch is longstanding and protected, and development occurs on individual feature branches. These features are then then "pulled" 
into the main branch after being reviewed by at least one person. While anyone can make a pull request, to approve them and manage
other aspects of the project, you must be [added](#contacts) to the repository with the necessary permissions. 

Otherwise, to quickly get started with contributing to the project, simply clone down the repository locally and create a pull request.

1. Fork/Clone the Project
2. Create a Feature Branch `git checkout -b feature/my-feature`
3. Commit your Changes `git commit -m "feat: add my new feature"`
4. Push to the Branch `git push origin feature/my-feature`
5. Open a new Pull Request 

### List of features or use cases implemented (wrt requirements)
#### Admin Features
* Assign instructors to programs
* Add a new program
* Edit program
* Delete program
* Manage program
* Update Home Page
#### Instructor Features
* Assign students to projects
* View project details
* Transfer projects to a different program
* View project/program logs
* View Program Students and Instructors
* Invite Students to join a course
#### Project Partner Features 
* Submit a project
#### Student Features
* Save projects
* Rank saved projects
* View assigned project
#### User Features
* View Active Projects
* View Archived Projects
* Project Showcase
### Known Issues and Future Enhancements
#### Issues
* General bugs with CRUD, including updating and creating projects.
* Browse project page UI
* Project partner portal doesn't display projects correctly
* Program stage inconsisency
* Project archive has inconsistency
#### Future Enhancements
* More Marketing features - This includes creating new elements, and allowing for more advanced control of the projectd showcase
* Multi-program projects - This was a feature we had to remove from our requirements due to time constraints — add a system where multiple projects can be a part of the same "track," both for repeated projects as well as projects
* More student/ta features - This would include tracking for certain capstone milestones and coordination featurse for TAs. The course timeline would be editable by course instructors
* Integrate course documentation - An example of this for the eecs would [be this handbook](https://capstone.alexulbrich.com/), made by Alex Ulbrich, a capstone instructor 

### Database Schema and Data Directory
![image](https://github.com/user-attachments/assets/1e87586a-a37f-48b8-b12e-866d866f1da6)


## Contact the Team
Dani Zahariev - Project Lead - zaharied@oregonstate.edu
Sankalp Patil - Frontend lead - patilsa@oregonstate.edu
Muhammad Faks - Backend lead - faksm@oregonstate.edu
Joel Angus - Developer - angusjo@oregonstate.edu
Hanhua Zhu - Developer - zhuhanh@oregonstate.edu
Justin Pham - Developer - phamjus@oregonstate.edu


