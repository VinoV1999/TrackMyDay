import React, { ReactNode } from "react";
import Sidebar from "./SideBar";

type MainPageProps = {
  children: ReactNode;
};

const MainPage: React.FC<MainPageProps> = ({ children }) => {

  return (
    <div className="flex flex-col-reverse h-screen overflow-hidden md:flex-row">
      <Sidebar />
      {/* Main Content */}
      <main className="flex-1 p-2 md:p-6 bg-gray-100 overflow-y-auto md:overflow-hidden">{children}</main>
    </div>
  );
};

export default MainPage;
