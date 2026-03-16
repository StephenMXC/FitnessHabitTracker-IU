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
