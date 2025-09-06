import React, { ReactNode } from "react";
import Sidebar from "./SideBar";

type MainPageProps = {
  children: ReactNode;
};

const MainPage: React.FC<MainPageProps> = ({ children }) => {

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-100">{children}</main>
    </div>
  );
};

export default MainPage;
