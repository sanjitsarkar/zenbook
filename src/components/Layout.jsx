import React from "react";
import Footer from "./Footer";
import Header from "./Header";
import SideBar from "./SideBar";

const Layout = ({ children }) => {
  return (
    <div className="relative">
      <Header />
      <SideBar />
      <section className="bg-slate-100  min-h-screen top-16 mt-3 relative md:pl-60  p-2 sm:p-4 md:mb-0 mb-36">
        {children}
      </section>
      <Footer />
    </div>
  );
};

export default Layout;
