import { auth } from '@clerk/nextjs/server';



export default async function AdminUpdateHome() {
  auth.protect({ role: "org:admin" });
  
  return (
    <div>
      <h1>Admin Update Home</h1>
    </div>
  )
}