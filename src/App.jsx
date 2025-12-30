import Dashboard from "./pages/dashboard/Dashboard"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Fitness from "./pages/fitness/Fitness";




function App() {
  return (
    <Router>
      <Routes>
        
        <Route path="/" element={<Dashboard/>} />
        <Route path="/fitness" element={<Fitness />} />
        
        <Route path="/*" element={<h1>404 Page</h1>} />
      </Routes>
    </Router>
  );
}


export default App
