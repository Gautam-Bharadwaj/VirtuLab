import React from 'react';

interface Props {
  score: number;
  mistakeCount: number;
  duration: number;
  failureTriggered: boolean;
  onClose: () => void;
}

export const SkillRadar: React.FC<Props> = ({ onClose }) => {
  return (
    <div>
      {/* SkillRadar stub */}
    </div>
  );
};
