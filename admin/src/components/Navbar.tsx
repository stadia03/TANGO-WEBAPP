import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserStore } from "../store";

export default function Navbar() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    useUserStore.getState().setAuth(false);
    navigate("/login");
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !(menuRef.current as HTMLElement).contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navLinks = [
    { to: "/dailyreport", text: "Daily Report" },
    { to: "/edit-report", text: "Edit Report" },
  ];

  return (
    <div className="w-full border-b border-gray-300 bg-white">
      {/* Single Navigation Bar */}
      <div className="flex justify-between items-center px-6 md:px-10 md:py-4 py-1">
        {/* Logo */}
        <img
          src="/assets/tango_logo.png"
          alt="Tango Logo"
          className="h-8 md:h-10"
        />

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {/* Navigation Links */}
          <div className="flex gap-6 text-base font-medium text-black">
            {navLinks.map((link) => (
              <Link to={link.to} key={link.to}>
                <div
                  className="text-gray-700 px-4 py-2 rounded-full font-semibold
                            hover:bg-blue-100 hover:text-blue-700
                            transition-colors duration-200 ease-in-out
                            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                  {link.text}
                </div>
              </Link>
            ))}
          </div>

          {/* User Details and Logout - Desktop */}
          <div className="flex items-center gap-4 ml-4">
            <div className="text-right leading-tight text-base">
              <div className="font-medium">
                {localStorage.getItem("userName")}
              </div>
              <div className="text-xs text-gray-600">
                {localStorage.getItem("userDesignation")}
              </div>
            </div>
            <img src="/assets/admin_icon.png" alt="User" className="w-8" />
            <button onClick={handleLogout} className="hover:opacity-80 transition-opacity">
              <img
                src="/assets/logout_icon.png"
                alt="Logout"
                className="w-8"
              />
            </button>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden p-2 focus:outline-none"
          aria-label="Menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        ref={menuRef}
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out z-50 md:hidden`}
      >
        <div className="p-4 flex justify-between items-center border-b">
          <img
            src="/assets/tango_logo.png"
            alt="Tango Logo"
            className="h-8"
          />
          <button
            onClick={toggleMenu}
            className="p-2 focus:outline-none"
            aria-label="Close menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* User Details - Mobile */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <img src="/assets/admin_icon.png" alt="User" className="w-10" />
            <div className="text-left leading-tight">
              <div className="font-medium text-base">
                {localStorage.getItem("userName")}
              </div>
              <div className="text-sm text-gray-600">
                {localStorage.getItem("userDesignation")}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Links - Mobile */}
        <div className="flex flex-col p-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              to={link.to}
              key={link.to}
              onClick={() => setIsMenuOpen(false)}
            >
              <div
                className="text-gray-700 px-4 py-3 rounded-lg font-semibold
                          hover:bg-blue-100 hover:text-blue-700
                          transition-colors duration-200 ease-in-out"
              >
                {link.text}
              </div>
            </Link>
          ))}
        </div>

        {/* Logout Button - Mobile */}
        <div className="absolute bottom-4 left-4 right-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-700 rounded-lg font-semibold
                      hover:bg-red-100 transition-colors duration-200 ease-in-out"
          >
            <img
              src="/assets/logout_icon.png"
              alt="Logout"
              className="w-5"
            />
            Logout
          </button>
        </div>
      </div>

      {/* Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"></div>
      )}
    </div>
  );
}