import Dashboard from "./pages/Dashboard/Dashboard";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Fitness from "./pages/Fitness/Fitness";
import Habits from "./pages/Habits/Habits";
import DefaultLayout from "./layout/DefaultLayout";

function App() {
  return (
    <Router>
      <DefaultLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/fitness" element={<Fitness />} />
          <Route path="/habits" element={<Habits />} />
          <Route path="/*" element={<h1>404 Page</h1>} />
        </Routes>
      </DefaultLayout>
    </Router>
  );
}

export default App;
