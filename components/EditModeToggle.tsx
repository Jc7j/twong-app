import React from 'react';

interface EditModeToggleProps {
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  handleSave: () => void;
}

const EditModeToggle: React.FC<EditModeToggleProps> = ({
  isEditing,
  setIsEditing,
  handleSave
}) => {
  return (
      isEditing ? (
        <button
          onClick={handleSave}
          className="mt-4 px-3 py-1 bg-accent text-background rounded text-sm"
        >
          Save changes
        </button>
      ) : (
        <button
          onClick={() => setIsEditing(true)}
          className="text-accent underline underline-offset-2 text-sm"
        >
          Edit
        </button>
      )
  );
};

export default EditModeToggle;
