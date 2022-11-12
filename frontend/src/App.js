import { BrowserRouter, Route, Routes } from '../node_modules/react-router-dom/dist/index';
import './App.css';
import LeftNav from './components/LeftNav';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LeftNav />} /><Route/>
        <Route path="/buildingPermit" element={<LeftNav />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
