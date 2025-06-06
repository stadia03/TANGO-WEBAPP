import React from "react";
import Navbar from "../components/Navbar";
import Dashboard from "../components/Dashboard";

function Home(){
  return (
    <div className="bg-white min-h-screen">
     <Navbar/>
    <Dashboard/>
    </div>
  );
};

export default Home;
