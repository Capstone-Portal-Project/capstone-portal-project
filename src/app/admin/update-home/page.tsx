import { auth } from '@clerk/nextjs/server';
import { getHomepageContent, updateHomepageContent } from '~/server/api/routers/home';
import UpdateHomeForm from './components/updateHomeForm';

async function handleUpdateHomepage(formData: FormData) {

  "use server";
  
  const data = {
    heroTitle: formData.get('heroTitle') as string,
    heroSubtitle: formData.get('heroSubtitle') as string,
    mainContent: formData.get('mainContent') as string
  };
  
  return updateHomepageContent(data);
}

export default async function AdminUpdateHome() {
  auth.protect({ role: "org:admin" });
  
  const content = await getHomepageContent();
  
  return <UpdateHomeForm content={content} updateAction={handleUpdateHomepage} />;
}