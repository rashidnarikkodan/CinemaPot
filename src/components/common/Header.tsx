import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Menu, X, Search } from "lucide-react";
import SearchModal from "./Search";
import Icon from '../../assets/icons/favicon.png'
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate()

  const navItems = [
    { name: "Home", path: "/home" },
    { name: "TV Shows", path: "/browse?type=tv" },
    { name: "Movies", path: "/browse?type=movie" },
    { name: "New & Popular", path: "/browse?sort=new" },
  ];


  return (
    <header className="fixed top-0 left-0 z-50 w-full bg-linear-to-b from-black/90 to-transparent">
      <div className="mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-10">
        {/* Left */}
        <div className="flex items-center gap-4 md:gap-10">
          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(true)}
          >
            <Menu size={24} />
          </button>

          <div
            onClick={() => navigate('/')}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-600 group-hover:bg-red-700 transition-colors">
              <span className="text-white text-xs font-black">
                <img src={Icon} alt="" />
              </span>
            </div>
            <span className="text-xl font-black tracking-tighter text-white">
              CINEMA<span className="text-red-600">POT</span>
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-5 text-sm text-zinc-300">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `hover:text-white transition ${isActive ? "text-white font-semibold" : ""}`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3 sm:gap-5 text-zinc-300">
          <button onClick={() => setSearchOpen(true)} className="hover:text-white transition">
            <Search size={20} />
          </button>
        </div>
      </div>

      {/* Mobile Slide Menu */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-black/98 text-zinc-300 transform transition-transform duration-300 ease-in-out md:hidden ${isMenuOpen ? "translate-x-0" : "-translate-x-full"
          } shadow-2xl z-50`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-red-600">
              <span className="text-white text-[10px] font-black">▶</span>
            </div>
            <span className="text-lg font-black tracking-tighter text-white">
              CINEMA<span className="text-red-600">POT</span>
            </span>
          </div>
          <button onClick={() => setIsMenuOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <nav className="px-6 py-4">
          <ul className="flex flex-col gap-4 text-sm font-medium">
            {navItems.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `block hover:text-white transition ${isActive ? "text-white font-bold" : ""}`
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>


      {/* Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
      {
        isSearchOpen && (
          <SearchModal onClose={() => setSearchOpen(false)} />
        )
      }
    </header>
  );
};

export default Header;
