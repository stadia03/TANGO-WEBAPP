import React from "react";
import Navbar from "../components/Navbar";
import DailyReportForm from "../components/DailyReportForm";


function Home(){
  return (
    <div className="bg-white min-h-screen">
     <Navbar/>
     <DailyReportForm/>
    </div>
  );
};

export default Home;
