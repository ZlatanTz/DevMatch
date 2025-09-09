import { NavLink } from "react-router-dom";
import logo from "../assets/logo.jpg";
import profileImage from "../assets/profileIcon.jpg";
import { useState, useRef, useEffect } from "react";

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
        <NavLink to="/" className="text-base">
          Home
        </NavLink>
        <NavLink to="/jobs" className="text-base">
          Jobs
        </NavLink>
        <NavLink to="/about" className="text-base">
          About Us
        </NavLink>
        <NavLink to="/contact" className="text-base">
          Contact
        </NavLink>
      </div>

      <div className="flex items-center space-x-4 basis-1/2 justify-end">
        {!isLogged ? (
          <>
            <NavLink to="/login" className="text-base">
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
              className="h-12 w-12 rounded-full object-cover cursor-pointer mr-19"
              onClick={() => setDropdownVisible((prev) => !prev)}
            />
            {dropdownVisible && (
              <div className="absolute h-40 w-[200px] right-0 bg-federal-blue p-5 pt-10 flex flex-col items-center justify-center gap-6">
                <NavLink className="text-base">My Applications</NavLink>
                <NavLink className="text-base" to="/profile">
                  Customize Profile
                </NavLink>
                <button
                  className="text-base"
                  onClick={() => {
                    setDropdownVisible(false);
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
