'use client';

import { ChevronUp, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { updateRankAndGetProjects } from '~/server/api/routers/savedProjects'; // Import the new server function

type UpdateRankButtonProps = {
  saveId: number;
  saveIndex: number;
  onUpdateRank: (updatedProjects: any[]) => void; // Callback function to update the UI state
  userId: number;
};

const UpdateRankButton = ({ saveId, saveIndex, onUpdateRank, userId }: UpdateRankButtonProps) => {
  const [loading, setLoading] = useState(false);

  const handleUpdateRank = async (direction: 'up' | 'down', event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent the parent component from reacting to the click

    setLoading(true);

    try {
      // Trigger the API call to update the rank and get the updated list of projects
      const response = await updateRankAndGetProjects(saveId, userId, direction);

      if (response.error) {
        console.error(response.message);
      } else {
        // If the update was successful, pass the updated list of saved projects to the onUpdateRank callback
        onUpdateRank(response.savedProjects);
      }
    } catch (error) {
      console.error("Error updating rank:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      {/* Up button */}
      <button
        onClick={(e) => handleUpdateRank('up', e)} // Pass the event to stop propagation
        disabled={saveIndex === 1 || loading} // Disable the button if the index is already the first or it's loading
        className="p-2 rounded hover:bg-gray-200"
      >
        <ChevronUp size={16} />
      </button>

      {/* Down button */}
      <button
        onClick={(e) => handleUpdateRank('down', e)} // Pass the event to stop propagation
        disabled={loading} // Disable the button while loading
        className="p-2 rounded hover:bg-gray-200"
      >
        <ChevronDown size={16} />
      </button>
    </div>
  );
};

export default UpdateRankButton;
