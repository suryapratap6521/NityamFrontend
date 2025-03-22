// src/layout/Layout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "./Footer/Footer";
import Navbar from "../Components/Common/Navbar";
import { useLocation } from "react-router-dom";
import Sidebar from "../Components/Core/Dashboard/Sidebar";
import { useSelector } from "react-redux";


const Layout = () => {
  const location = useLocation();
  const { token } = useSelector((state) => state.auth);
  const isHomePage = location.pathname === '/';
  const isCreatePost=location.pathname !=='/dashboard/createpost'
  return (
    <>
      <Navbar />
      { isCreatePost && <Sidebar /> }
      {/* <div className="flex h-screen"> {token && <Sidebar />}</div> */}
      <Outlet />
      {isHomePage && <Footer />}
    </>
  );
};

export default Layout;
