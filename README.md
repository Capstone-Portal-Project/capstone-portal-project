# UNIFIED CAPSTONE PORTAL
Welcome the unified capstone portal, a one-stop-shop capstone project portal for school programs. Oregon State University's College of Engineering have several versions of a senior capstone project in different academic programs, where groups of students develop a project submitted by an employee of a company or an instructor at OSU. However, information and project management between all of these is variable. This project is a proposed solution to the current issues of capstone project management. It aims to act as a proof of concept for a more approchable, robust, and future-proof capstone project management system.

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

​## Technical Implementation
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
![image](https://github.com/user-attachments/assets/3776d894-080f-4884-a0c9-b9e3ab2b9f0b)

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
* [Uploadthing](https://uploadthing.com/) &mdash; Placeholder Image Hosting

Description
* [Clerk](https://clerk.com/) &mdash; Authentification Provider

Description
* [Vercel](https://vercel.com/) &mdash; Placeholder Host
  
Description

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
## Usage
Different roles have different management tools through the application.

### Administrator
* Assign instructors to different programs

![image](https://github.com/user-attachments/assets/7aba8126-cd9c-4a6f-8498-c51edfd362b2)

* Invite people into the system (through their emails) as students and instructors

![image](https://github.com/user-attachments/assets/0295c61f-9da9-4c36-8196-ae3ecff993ce)

* Audit logs as they become available
  
![image](https://github.com/user-attachments/assets/4f2e8862-ba55-4bc7-b069-907f73008258)

### Instructor
* Assign students to different projects

![image](https://github.com/user-attachments/assets/aa5b6f45-c7f5-4975-9cb1-9a1047f975be)


* View and manage projects through each phase of its lifecycle
  
![image](https://github.com/user-attachments/assets/76898fae-e835-426c-9bff-b94e4df3c2d0)

### Student
* Compact view of available projects
  
![image](https://github.com/user-attachments/assets/02d73249-45d9-40f0-a040-42f56a3c216c)

* Save projects for easier access later
  
![image](https://github.com/user-attachments/assets/60e350b2-e1cd-4b92-8921-2c069c0edc82)

* Submit requests to work available projects


## Contact the Team
Dani Zahariev - Project Lead - zaharied@oregonstate.edu
Sankalp Patil - Frontend lead - patilsa@oregonstate.edu
Muhammad Faks - Backend lead - faksm@oregonstate.edu
Joel Angus - Developer - angusjo@oregonstate.edu
Hanhua Zhu - Developer - zhuhanh@oregonstate.edu
Justin Pham - Developer - phamjus@oregonstate.edu


