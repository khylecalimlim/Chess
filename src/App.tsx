import { useState } from 'react';
import './App.css';
import { ChessBoard } from './ui/ChessBoard';
import { ModeSelect } from './ui/ModeSelect';

type View = 'menu' | 'local';

function App() {
  const [view, setView] = useState<View>('menu');

  return (
    <div className="app">
      <h1>Chess</h1>
      {view === 'menu' && <ModeSelect onPlayLocal={() => setView('local')} />}
      {view === 'local' && (
        <>
          <ChessBoard />
          <button className="back-btn" onClick={() => setView('menu')}>← Back to Menu</button>
        </>
      )}
    </div>
  );
}

export default App;
