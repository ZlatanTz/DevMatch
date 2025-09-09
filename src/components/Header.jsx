import { NavLink } from "react-router-dom";
import logo from "../assets/logo.jpg";
import profileImage from "../assets/profileIcon.jpg";
import { useState } from "react";

const Header = () => {
  const [isLogged, setIsLogged] = useState(true);

  return (
    <header className="flex items-center justify-between bg-federal-blue text-white px-4 py-3 h-30">
      <div className="flex items-center space-x-6">
        <NavLink to="/">
          <img src={logo} alt="Logo" className="h-16 w-16 rounded-full object-cover" />
        </NavLink>
        <NavLink to="/" className=" text-xl">
          Home
        </NavLink>
        <NavLink to="/jobs" className=" text-xl">
          Jobs
        </NavLink>
        <NavLink to="/about" className=" text-xl">
          About Us
        </NavLink>
        <NavLink to="/contact" className=" text-xl">
          Contact
        </NavLink>
      </div>

      <div className="flex items-center space-x-4 basis-1/2 justify-end">
        {!isLogged ? (
          <>
            <NavLink to="/login" className="text-xl">
              Login
            </NavLink>
            <NavLink to="/register" className="text-xl">
              Register
            </NavLink>
          </>
        ) : (
          <div>
            <img
              src={profileImage}
              alt="Profile"
              className="h-16 w-16 rounded-full object-cover 
            mr-25 cursor-pointer"
            />
            <div class="absolute h-52 w-[294px] right-0 bg-federal-blue p-5 pt-10 flex flex-col items-center justift-center gap-5">
              <NavLink className="text-xl">My Applications</NavLink>
              <NavLink className="text-xl">Customize Profile</NavLink>
              <button className="text-xl">Logout</button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
