import Home from './Page/Home';
import Game from './Page/Components/Game/Games';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import React from 'react';
import RegisterPage from './Page/Components/RegisterPage/RegisterPage';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path="/Game" element={<Game />} />
          <Route path="/RegisterPage" element={<RegisterPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
