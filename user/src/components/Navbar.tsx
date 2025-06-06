import React from "react";
import { useUserStore } from "../store";
export default function Navbar() {
  const handleLogout = ()=>{
    localStorage.removeItem('token');
    useUserStore.getState().setAuth(false);
  }
  return (
    <div className="py-3 px-4 md:py-5 md:px-10 border-b border-gray-800 flex items-center justify-between">
      <div>
        <img src="/assets/tango_logo.png " className="h-12 md:h-16"></img>
      </div>
      <div className="flex items-center gap-2 md:gap-5 text-black">
        <div className="   text-right font-semibold ">
          <div className="text-lg md:text-2xl ">{useUserStore.getState().name}</div>
          <div className="text-sm md:text-xl ">{useUserStore.getState().designation}</div>
        </div>
        <div>
          <img src="assets/user_icon.png" className="h-10 md:h-16"></img>
        </div>{" "}
        <button onClick={handleLogout}>
          <img
            src="/assets/logout_icon.png"
            className="h-10 
            md:h-16
            filter brightness-100   
            hover:brightness-75    
            transition-all       
            duration-300           
            ease-in-out "
          ></img>
        </button>
      </div>
    </div>
  );
}
