interface Props {
  score: number;
  mistakeCount: number;
  duration: number;
  failureTriggered: boolean;
  onClose: () => void;
}

export const SkillRadar: React.FC<Props> = ({ score: _score, mistakeCount: _mc, duration: _d, failureTriggered: _ft, onClose: _onClose }) => {
  return (
    <div>
      {/* SkillRadar stub */}
    </div>
  );
};
