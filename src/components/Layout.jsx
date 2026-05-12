import Navbar from './Navbar';
const Layout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Navbar />
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default Layout;