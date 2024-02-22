import React from "react";
import Sidebar from "./sidebar/Sidebar";
import Header from "./header/Header";
import { TeloContextProvider } from "@/app/context/TeloDocProvider";

const DashboardLayout = ({ children }) => {
  return (
    <TeloContextProvider>
      <div className="grid grid-cols-8 gap-3 mx-auto">
        <nav className="lg:block hidden h-full col-span-2 px-0 py-0 bg-white">
          <Sidebar />
        </nav>
        <div className="lg:col-span-6 col-span-8">
          <Header />
          <div className="container mx-auto p-5">{children}</div>
        </div>
      </div>
    </TeloContextProvider>
  );
};

export default DashboardLayout;
