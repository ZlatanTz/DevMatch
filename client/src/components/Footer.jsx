import { NavLink } from "react-router-dom";

const Footer = () => {
  const navItems = [
    { to: "/", label: "Home" },
    { to: "/jobs", label: "Jobs" },
    { to: "/about", label: "About Us" },
    { to: "/contact", label: "Contact" },
  ];

  const linkBase = "px-3 py-2 rounded-xl text-sm md:text-base transition-colors";
  const linkActive = "text-emerald bg-white/5 ring-1 ring-inset ring-emerald/30";
  const linkInactive =
    "text-white/85 hover:text-emerald focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald";
  return (
    <footer className="bg-federal-blue text-white pt-2 pb-2">
      <div className="flex flex-col md:flex-row md:gap-10 justify-center items-center">
        {navItems.map((item) => (
          <NavLink
            target="_blank"
            key={item.to}
            to={item.to}
            className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkInactive}`}
          >
            {item.label}
          </NavLink>
        ))}
      </div>
      <div className="h-10 flex justify-center items-center font-roboto">DevMatch © 2025</div>
    </footer>
  );
};

export default Footer;
