import './App.css';
import LeftNav from './components/LeftNav';
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"  element={<LeftNav />} /><Route/>
        <Route path="/buildingPermit" element={<LeftNav />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
