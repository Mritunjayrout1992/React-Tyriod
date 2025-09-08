import { Outlet } from "react-router-dom";
import Header from "../component/header";
import Sidebar from "../component/Sidebar";

const Layout = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 bg-white-100 p-6 overflow-auto">
          <Outlet /> {/* or children */}
        </main>
      </div>
    </div>
  );
};

export default Layout;