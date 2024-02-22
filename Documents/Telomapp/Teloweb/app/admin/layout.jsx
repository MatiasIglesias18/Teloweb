import React from "react";
import Sidebar from "./sidebar/Sidebar";
import Header from "./header/Header";


const DashboardLayout = ({ children }) => {
  return (
    <div className="grid grid-cols-8 gap-3 max-w-screen-lg mx-auto">
      <nav className="lg:block hidden h-full col-span-2 px-0 py-0 bg-white" >
        <Sidebar />
      </nav>
      <div className="lg:col-span-6 col-span-8">
          <Header />
          <div className="container mx-auto p-5">{children}</div>
        </div>
    </div>
  );
};

export default DashboardLayout;
