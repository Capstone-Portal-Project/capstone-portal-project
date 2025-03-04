import { auth } from '@clerk/nextjs/server';
import { getHomepageContent } from '~/server/api/routers/home';

export default async function HomePage() {
  const contentResult = await getHomepageContent();
  
  const contentData = contentResult?.content || null;
  
  const heroTitle = contentData?.heroTitle || "Where Education Meets Application";
  const heroSubtitle = contentData?.heroSubtitle || "Show employers you have what it takes.";
  const mainContent = contentData?.mainContent || "The Oregon State University EECS Project Showcase assists students in obtaining internships and full-time employment by providing the opportunity to build a portfolio of projects they have completed.";
  
  return (
    <main>
      <div className="flex flex-col">
        <div className="h-[40vh] bg-gray-800">
          <div className="flex flex-col text-white p-32 gap-4">
            <h1 className="text-6xl text-center">{heroTitle}</h1>
            <h2 className="text-2xl text-center">{heroSubtitle}</h2>
          </div>
        </div>
        <div className="h-[40vh] ">
          <div className="flex flex-col p-16">
            <p className="text-center">{mainContent}</p>
          </div>
        </div>
      </div>
    </main>
  );
}