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
    <header
      className="fixed top-0 left-0 z-50 w-full glass transition-all duration-300"
      role="banner"
    >
      <div className="mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-12">
        {/* Left */}
        <div className="flex items-center gap-4 md:gap-12">
          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white hover:text-red-500 transition-colors p-2"
            onClick={() => setIsMenuOpen(true)}
            aria-label="Open mobile menu"
            aria-expanded={isMenuOpen}
          >
            <Menu size={26} aria-hidden="true" />
          </button>

          <div
            onClick={() => navigate('/')}
            className="flex items-center gap-3 cursor-pointer group"
            role="link"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && navigate('/')}
            aria-label="CinemaPot Home"
          >
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-red-600 group-hover:bg-red-700 transition-all duration-300 group-hover:rotate-12 shadow-lg shadow-red-900/40 overflow-hidden">
              <img src={Icon} alt="" className="w-6 h-6 object-contain" aria-hidden="true" />
              <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent pointer-events-none" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-white uppercase italic">
              CINEMA<span className="text-red-600">POT</span>
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 text-[13px] font-bold uppercase tracking-widest text-zinc-400" role="navigation">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `hover:text-white transition-all duration-300 relative py-2 group/nav ${isActive ? "text-white" : ""}`
                }
              >
                {item.name}
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover/nav:w-full" />
                {item.path.includes('type=movie') && (
                  <span className="absolute -top-3 -right-6 px-1.5 py-0.5 bg-red-600 text-[8px] rounded-full text-white animate-pulse">PRO</span>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4 sm:gap-6 text-zinc-400">
          <button
            onClick={() => setSearchOpen(true)}
            className="hover:text-white transition-all duration-300 hover:scale-110 p-2 rounded-full hover:bg-white/5"
            aria-label="Search movies and series"
          >
            <Search size={22} aria-hidden="true" />
          </button>
          <div
            className="h-8 w-8 rounded-full bg-zinc-800 border border-zinc-700 overflow-hidden cursor-pointer hover:border-red-600 transition-all"
            role="button"
            aria-label="User profile"
          >
            <img src="https://ui-avatars.com/api/?name=User&background=18181b&color=71717a" alt="User profile" />
          </div>
        </div>
      </div>

      {/* Mobile Slide Menu */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-black/98 text-zinc-300 transform transition-transform duration-300 ease-in-out md:hidden ${isMenuOpen ? "translate-x-0" : "-translate-x-full"
          } shadow-2xl z-[60]`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
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
          <button
            onClick={() => setIsMenuOpen(false)}
            aria-label="Close mobile menu"
          >
            <X size={24} aria-hidden="true" />
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
          className="fixed inset-0 bg-black/50 md:hidden z-50"
          onClick={() => setIsMenuOpen(false)}
          aria-hidden="true"
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
