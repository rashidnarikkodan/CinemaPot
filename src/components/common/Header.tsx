import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import SearchModal from "./Search";

const Header = () => {
  const [isSearchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Languages", path: "/languages" },
    { name: "Movies", path: "/browse?type=movie" },
    { name: "Series", path: "/browse?type=tv" },
  ];

  return (
    <>
      <header
        className="fixed top-0 left-0 z-40 w-full backdrop-blur-xl bg-black/60 border-none transition-all duration-300 select-none"
        role="banner"
      >
        {/* ─── Mobile Top Bar (Enlarged size, Brand Only) ─── */}
        <div className="flex md:hidden h-15 items-center px-5">
          {/* Left: Brand */}
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-2.5 cursor-pointer active:scale-95 transition-transform"
            role="link"
            tabIndex={0}
            aria-label="CinemaPot Home"
          >
            <div className="h-7 w-7 rounded-lg overflow-hidden shadow-md shadow-red-950/40 shrink-0">
              <img
                src="/favicon.png"
                alt=""
                className="w-full h-full object-cover"
                aria-hidden="true"
              />
            </div>
            <span className="text-base font-black tracking-tighter text-white uppercase italic">
              CINEMA<span className="text-red-600">POT</span>
            </span>
          </div>
        </div>

        {/* ─── Desktop Header ─── */}
        <div className="hidden md:flex h-14 items-center justify-between px-6 lg:px-12">
          {/* Left: Brand & Desktop Navigation */}
          <div className="flex items-center gap-10">
            <div
              onClick={() => navigate("/")}
              className="flex items-center gap-2 cursor-pointer group"
              role="link"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && navigate("/")}
              aria-label="CinemaPot Home"
            >
              <div className="relative flex h-8 w-8 items-center justify-center rounded-sm overflow-hidden">
                <img
                  src="/favicon.png"
                  alt=""
                  className="h-full w-full object-cover"
                  aria-hidden="true"
                />
              </div>
              <span className="text-xl font-black tracking-tighter text-white uppercase italic">
                CINEMA<span className="text-red-600">POT</span>
              </span>
            </div>

          </div>
            {/* Desktop Nav */}
            <nav
              className="flex items-center gap-10 text-[13px] font-bold uppercase tracking-widest text-zinc-400"
              role="navigation"
            >
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `hover:text-white transition-all duration-300 relative py-2 group/nav ${isActive ? "text-white" : ""
                    }`
                  }
                >
                  {item.name}
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover/nav:w-full" />
                </NavLink>
              ))}
            </nav>

          {/* Right: Search (Desktop only) */}
          <div className="hidden md:flex items-center text-zinc-400 px-6">
            <button
              onClick={() => setSearchOpen(true)}
              className="hover:text-white transition-all duration-300 hover:scale-110 p-2.5 rounded-full hover:bg-white/5 flex items-center gap-2 text-xs font-bold uppercase tracking-wider"
              aria-label="Search movies and series"
            >
              <Search size={20} aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {isSearchOpen && <SearchModal onClose={() => setSearchOpen(false)} />}
    </>
  );
};

export default Header;
