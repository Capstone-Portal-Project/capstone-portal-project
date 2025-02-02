"use client";

import { useState } from 'react';
import ProjectEditSidebarPopout from '~/app/_components/editprojectpage';

interface BrowseProjectsParams {
  params: Promise<{ project_id: string }>;
}

const placeholderDescription = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin vehicula id leo vitae ornare. In vitae sem luctus ex mollis placerat sed ac leo. Nam efficitur iaculis urna, a sagittis tortor sodales at. Aenean orci tortor, ullamcorper eu elit vel, efficitur euismod ex. Phasellus feugiat et lacus a pharetra. Nullam viverra nunc vitae turpis eleifend, vel euismod dui tincidunt. Fusce ligula metus, lacinia vel eleifend nec, dictum accumsan sapien. Duis laoreet varius tincidunt. Quisque dictum tempor hendrerit. Mauris mauris dolor, condimentum in consectetur a, dapibus eu erat. Praesent sodales egestas leo, sed accumsan mi malesuada id. Duis in est vitae est faucibus lobortis. Vivamus eu sollicitudin velit, in aliquet velit. Nunc dui sapien, mollis at euismod nec, lobortis eu orci. Praesent eu magna efficitur, egestas lorem id, gravida metus. Maecenas ullamcorper ligula sit amet tempus sagittis."

export default function ProjectPage({ params }: BrowseProjectsParams) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex flex-row h-screen overflow-hidden">
      {/* Main Content Container */}
      <div className="flex-1 relative">
        {/* Scrollable content */}
        <div className="p-4 overflow-auto h-full">
          {/* Your main content goes here */}
          <p>PROJECT PAGE DETAILS</p>
          {/* ... */}
        </div>

        {/* Toggle button positioned absolutely at the bottom-right */}
        <button
          onClick={toggleSidebar}
          className="absolute bottom-4 right-4 px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600"
        >
          {isSidebarOpen ? "Hide Sidebar" : "Show Sidebar"}
        </button>
      </div>

      {/* Sidebar */}
      {isSidebarOpen && <ProjectEditSidebarPopout cp_id={0} course_id={0} cp_title={'Placeholder Title'} cp_description={placeholderDescription} cp_objectives={placeholderDescription} cp_date_created={'01/01/2025'} cp_date_updated={'01/01/2025'} cp_archived={false} />}
    </div>
  );
}