import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />
      <main className="pt-16">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
