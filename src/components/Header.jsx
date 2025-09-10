import { NavLink } from "react-router-dom";
import logo from "../assets/logo.jpg";
import profileImage from "../assets/profileIcon.jpg";
import { useState, useRef, useEffect } from "react";
import "./Header.css";

const Header = () => {
  const [isLogged, setIsLogged] = useState(true);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setDropdownVisible(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="flex items-center justify-between bg-federal-blue text-white px-4 pr-0 py-3 h-15 relative">
      <div className="flex items-center space-x-6">
        <NavLink to="/">
          <img src={logo} alt="Logo" className="h-12 w-12 rounded-full object-cover" />
        </NavLink>
        <NavLink to="/" className="text-base linksInNav">
          Home
        </NavLink>
        <NavLink to="/jobs" className="text-base linksInNav">
          Jobs
        </NavLink>
        <NavLink to="/about" className="text-base linksInNav">
          About Us
        </NavLink>
        <NavLink to="/contact" className="text-base linksInNav">
          Contact
        </NavLink>
      </div>

      <div className="flex items-center space-x-4 basis-1/2 justify-end">
        {!isLogged ? (
          <>
            <NavLink
              to="/login"
              className="text-base"
              onClick={() => {
                setIsLogged(true);
              }}
            >
              Login
            </NavLink>
            <NavLink to="/register" className="text-base mr-5">
              Register
            </NavLink>
          </>
        ) : (
          <div ref={containerRef} className="relative">
            <img
              src={profileImage}
              alt="Profile"
              className="h-12 w-12 rounded-full object-cover cursor-pointer mr-19 profilaImage"
              onClick={() => setDropdownVisible((prev) => !prev)}
            />
            {dropdownVisible && (
              <div className="absolute h-40 w-[200px] right-0 bg-federal-blue p-5 pt-10 flex flex-col items-center justify-center gap-6 dropdownDiv">
                <NavLink
                  to="/jobs"
                  className="text-base linkInDiv"
                  onClick={() => {
                    setDropdownVisible(false);
                  }}
                >
                  Jobs
                </NavLink>
                <NavLink
                  to="/about"
                  className="text-base linkInDiv"
                  onClick={() => {
                    setDropdownVisible(false);
                  }}
                >
                  About Us
                </NavLink>
                <NavLink
                  to="/contact"
                  className="text-base linkInDiv"
                  onClick={() => {
                    setDropdownVisible(false);
                  }}
                >
                  Contact
                </NavLink>
                <NavLink
                  to="/my-submits"
                  className="text-base"
                  onClick={() => {
                    setDropdownVisible(false);
                  }}
                >
                  My Applications
                </NavLink>
                <NavLink
                  to="/profile"
                  className="text-base"
                  onClick={() => {
                    setDropdownVisible(false);
                  }}
                >
                  Profile
                </NavLink>
                <button
                  className="text-base cursor-pointer"
                  onClick={() => {
                    setDropdownVisible(false);
                    setIsLogged(false);
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
