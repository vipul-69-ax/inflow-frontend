import  { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "/images/logo/inflow-logo.png"; // Adjust the path as needed

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const navigate = useNavigate()
  return (
    <nav className="flex items-center justify-between px-4 xs:px-6 py-4 max-w-7xl mx-auto bg-white ">
      {/* Logo */}
      <div className="flex items-center">
        <img src={Logo} alt="Inflow Logo" className="h-8 xs:h-10 w-auto" />
      </div>

      {/* Hamburger Icon (visible on mobile) */}
      <div className="md:hidden flex items-center">
        <button
          onClick={toggleMenu}
          className="text-gray-800 focus:outline-none"
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6 xs:w-7 xs:h-7"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Navigation Links (Desktop) */}
      <div className="hidden md:flex items-center space-x-6">
        <Link
          to="/"
          className="text-gray-800 hover:text-blue-600 transition-colors text-sm md:text-base"
          style={{ fontFamily: "Avenir LT Std, sans-serif" }}
        >
          Home
        </Link>
        <Link
          to="/about"
          className="text-gray-800 hover:text-blue-600 transition-colors text-sm md:text-base"
          style={{ fontFamily: "Avenir LT Std, sans-serif" }}
        >
          About us
        </Link>
        <Link
          to="/features"
          className="text-gray-800 hover:text-blue-600 transition-colors text-sm md:text-base"
          style={{ fontFamily: "Avenir LT Std, sans-serif" }}
        >
          Features
        </Link>
        <Link
          to="/pricing"
          className="text-gray-800 hover:text-blue-600 transition-colors text-sm md:text-base"
          style={{ fontFamily: "Avenir LT Std, sans-serif" }}
        >
          Pricing
        </Link>
      </div>

      {/* Login and Sign Up Buttons (Desktop) */}
      <div className="hidden md:flex items-center space-x-4">
        <button
          onClick={()=>{
            navigate("/login")

          }}
          className="text-blue-600 hover:text-blue-800 transition-colors text-sm md:text-base"
          style={{ fontFamily: "Avenir LT Std, sans-serif" }}
        >
          Log In
        </button>
        <button
          onClick={()=>{
            navigate("/login")
          }}
          className="bg-blue-600 text-white px-3 py-1.5 xs:px-4 xs:py-2 rounded-full hover:bg-blue-700 transition-colors text-sm md:text-base"
          style={{ fontFamily: "Avenir LT Std, sans-serif" }}
        >
          Sign Up
        </button>
      </div>

      {/* Mobile Menu (visible when hamburger is clicked) */}
      <div
        className={`${
          isOpen ? "flex" : "hidden"
        } md:hidden absolute top-16 left-0 right-0 bg-white shadow-lg flex-col items-center py-6 z-50`}
      >
        <div className="flex flex-col items-center space-y-4 w-full">
          <Link
            to="/"
            className="text-gray-800 hover:text-blue-600 transition-colors text-base"
            style={{ fontFamily: "Avenir LT Std, sans-serif" }}
            onClick={toggleMenu}
          >
            Home
          </Link>
          <Link
            to="/about"
            className="text-gray-800 hover:text-blue-600 transition-colors text-base"
            style={{ fontFamily: "Avenir LT Std, sans-serif" }}
            onClick={toggleMenu}
          >
            About us
          </Link>
          <Link
            to="/features"
            className="text-gray-800 hover:text-blue-600 transition-colors text-base"
            style={{ fontFamily: "Avenir LT Std, sans-serif" }}
            onClick={toggleMenu}
          >
            Features
          </Link>
          <Link
            to="/pricing"
            className="text-gray-800 hover:text-blue-600 transition-colors text-base"
            style={{ fontFamily: "Avenir LT Std, sans-serif" }}
            onClick={toggleMenu}
          >
            Pricing
          </Link>
          <button
            className="text-blue-600 hover:text-blue-800 transition-colors text-base"
            style={{ fontFamily: "Avenir LT Std, sans-serif" }}
            onClick={()=>{
              navigate("/login")
            }}
          >
            Log In
          </button>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors text-base"
            style={{ fontFamily: "Avenir LT Std, sans-serif" }}
            onClick={()=>{
              navigate("/login")
            }}
          >
            Sign Up
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
