// ============================================
// DEFAULT LAYOUT COMPONENT
// ============================================
// PURPOSE: Provide consistent layout with sidebar for all authenticated pages.
// STRUCTURE:
// - Sidebar (left): Navigation links and logout button
// - Main content (right): Page content (Dashboard/Habits)
// USAGE: <DefaultLayout><SomePage /></DefaultLayout>
// ============================================

import Sidebar from "../components/Sidebar/Sidebar";
import './default-layout.css';

function DefaultLayout({ children }) {
  return (
    <div className="layout-container">
      <Sidebar />
      <main className="layout-main">
        {children}
      </main>
    </div>
  );
}

export default DefaultLayout;
