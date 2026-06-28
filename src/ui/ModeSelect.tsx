import { useState } from 'react';
import './ModeSelect.css';

type Difficulty = 'easy' | 'medium' | 'hard';

interface ModeSelectProps {
  onPlayLocal: () => void;
}

const DIFFICULTIES: { value: Difficulty; label: string }[] = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
];

// Bot opponent isn't built yet (Step 8 of ROADMAP.md) - the card stays
// visible so the eventual feature has a home, but is disabled until
// there's an engine behind it.
export function ModeSelect({ onPlayLocal }: ModeSelectProps) {
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');

  return (
    <div className="mode-select">
      <button className="mode-card mode-card-local" onClick={onPlayLocal}>
        <span className="mode-icon" aria-hidden="true">♟</span>
        <span className="mode-title">Play Locally</span>
        <span className="mode-desc">Two players, one board.</span>
      </button>

      <div className="mode-card mode-card-bot" aria-disabled="true">
        <span className="mode-icon" aria-hidden="true">🤖</span>
        <span className="mode-title">Play vs Bot</span>
        <span className="mode-badge">Coming soon</span>
        <span className="mode-desc">AI opponent - not built yet.</span>

        <select
          className="difficulty-select"
          value={difficulty}
          disabled
          onChange={(e) => setDifficulty(e.target.value as Difficulty)}
          aria-label="Bot difficulty"
        >
          {DIFFICULTIES.map((d) => (
            <option key={d.value} value={d.value}>{d.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
