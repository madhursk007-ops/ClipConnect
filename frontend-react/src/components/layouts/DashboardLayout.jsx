import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />
      <Sidebar />
      <main className="pt-16 pl-64">
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
