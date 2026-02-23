import Sidebar from "../components/Sidebar/Sidebar";

function DefaultLayout({ children }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '1rem' }}>
        {children}
      </main>
    </div>
  );
}

export default DefaultLayout;
