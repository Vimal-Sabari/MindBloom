import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import GameMenu from './components/GameMenu';
import SmartStarsAssessment from './components/SmartStarsAssessment';
import ProductDescription from './components/ProductDescription';
import GameOne from './components/games/GameOne';
import GameTwo from './components/games/GameTwo';
import GameThree from './components/games/GameThree';
import GameFour from './components/games/GameFour';
import GameFive from './components/games/GameFive';
import GameSix from './components/games/GameSix';
import GameSeven from './components/games/GameSeven';
import MoonBalanceGame from './components/games/MoonBalanceGame';
import MathWorlds from './components/MathWorlds';
import FarmGame from './components/games/FarmGame';
import TreasureGame from './components/games/TreasureGame';
import SpaceLabGame from './components/games/SpaceLabGame';
import './index.css';

function App() {
  const [activeGameId, setActiveGameId] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleReturnToMenu = () => {
    setActiveGameId(null);
    navigate('/');
  };

  const renderActiveGame = () => {
    switch (activeGameId) {
      case 1: return <GameOne onBack={handleReturnToMenu} />;
      case 2: return <GameTwo onBack={handleReturnToMenu} />;
      case 3: return <GameThree onBack={handleReturnToMenu} />;
      case 4: return <GameFour onBack={handleReturnToMenu} />;
      case 5: return <GameFive onBack={handleReturnToMenu} />;
      case 7: return <GameSeven onBack={handleReturnToMenu} />;
      default: return <GameMenu onSelectGame={setActiveGameId} />;
    }
  };

  // Only show Navbar on main pages, hide when inside a game (unless desired otherwise)
  // Also hide Navbar for Moon Balance if it's immersive, OR keep it. 
  // Let's keep navbar for consistency unless requested otherwise.
  const shouldShowNavbar = !activeGameId || location.pathname !== '/';

  return (
    <main>
      {shouldShowNavbar && <Navbar />}
      <div className="app-content">
        <Routes>
          <Route path="/" element={
            <>
              {activeGameId && (
                <div style={{ position: 'absolute', top: '80px', left: '10px', zIndex: 100 }}>
                  <button onClick={handleReturnToMenu} style={{ fontSize: '1.5rem', padding: '10px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', color: 'white' }}>
                    🏠
                  </button>
                </div>
              )}
              {renderActiveGame()}
            </>
          } />
          <Route path="/assessment" element={<SmartStarsAssessment />} />
          <Route path="/product-description" element={<ProductDescription />} />
          <Route path="/moon-balance" element={<MoonBalanceGame />} />
          <Route path="/math-worlds" element={<MathWorlds />} />
          <Route path="/math/farm" element={<FarmGame />} />
          <Route path="/math/treasure" element={<TreasureGame />} />
          <Route path="/math/spacelab" element={<SpaceLabGame />} />
        </Routes>
      </div>
    </main>
  );
}

export default App;
