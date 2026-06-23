import { HashRouter, Routes, Route } from 'react-router-dom';
import { AdminPage } from './admin';
import MainPage from './MainPage';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
