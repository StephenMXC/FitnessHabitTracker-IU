import Dashboard from "./pages/Dashboard/Dashboard";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Fitness from "./pages/Fitness/Fitness";
import Habits from "./pages/Habits/Habits";
import Sidebar from "./components/Sidebar/Sidebar";

function App() {
  return (
    <Router>
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/fitness" element={<Fitness />} />
          <Route path="/habits" element={<Habits />} />
          <Route path="/*" element={<h1>404 Page</h1>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
