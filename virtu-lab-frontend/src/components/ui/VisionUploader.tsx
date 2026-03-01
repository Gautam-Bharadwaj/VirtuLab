import React from 'react';

interface Props {
  onClose: () => void;
}

export const VisionUploader: React.FC<Props> = ({ onClose }) => {
  return (
    <div onClick={onClose} role="dialog">
    </div>
  );
};
