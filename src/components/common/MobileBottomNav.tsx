import { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Film,
  Tv,
  Search,
  Menu,
  Flame,
  Star,
  Compass,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import SearchModal from "./Search";

const MobileBottomNav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState(0);

  const location = useLocation();
  const navigate = useNavigate();

  const openMenu = () => {
    setIsMenuOpen(true);
    setDragOffset(0);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setDragOffset(0);
  };

  const handleNavigate = (path: string) => {
    closeMenu();
    navigate(path);
  };

  // Lock background scrolling completely while menu is open
  useEffect(() => {
    if (isMenuOpen) {
      const originalBodyOverflow = document.body.style.overflow;
      const originalHtmlOverflow = document.documentElement.style.overflow;

      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";

      const preventTouchMove = (e: TouchEvent) => {
        const target = e.target as HTMLElement;
        const scrollable = target.closest(".modal-scrollable");
        if (!scrollable && e.cancelable) {
          e.preventDefault();
        }
      };

      document.addEventListener("touchmove", preventTouchMove, { passive: false });

      return () => {
        document.body.style.overflow = originalBodyOverflow;
        document.documentElement.style.overflow = originalHtmlOverflow;
        document.removeEventListener("touchmove", preventTouchMove);
      };
    }
  }, [isMenuOpen]);

  // Close sheet modal automatically on route change
  useEffect(() => {
    setIsMenuOpen(false);
    setDragOffset(0);
  }, [location.pathname, location.search]);

  // Touch gesture handlers for dragging the bottom sheet down to close
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const currentY = e.targetTouches[0].clientY;
    const diff = currentY - touchStart;
    if (diff > 0) {
      setDragOffset(diff);
      if (e.cancelable) {
        e.preventDefault();
      }
    }
  };

  const handleTouchEnd = () => {
    if (dragOffset > 50) {
      closeMenu();
    } else {
      setDragOffset(0);
    }
    setTouchStart(null);
  };

  const isCurrentActive = (path: string, searchParam?: string) => {
    if (searchParam) {
      return location.pathname === "/browse" && location.search.includes(searchParam);
    }
    return location.pathname === path && !location.search;
  };

  return (
    <>
      {/* ─── Bottom Navigation Bar (Mobile PWA) ─── */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-zinc-950/85 backdrop-blur-2xl border-t border-white/10 px-2 pt-2 pb-[max(0.6rem,env(safe-area-inset-bottom))] shadow-[0_-8px_30px_rgba(0,0,0,0.6)] select-none"
        role="navigation"
        aria-label="Mobile Bottom Navigation"
      >
        <div className="grid grid-cols-5 items-center">
          {/* 1. Home */}
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-1 gap-1 text-[10px] font-bold tracking-tight active:scale-90 transition-all ${isActive && !location.search
                ? "text-red-500 scale-105"
                : "text-zinc-400 hover:text-white"
              }`
            }
          >
            <Home size={20} />
            <span>Home</span>
          </NavLink>

          {/* 2. Movies */}
          <NavLink
            to="/browse?type=movie"
            className={() =>
              `flex flex-col items-center justify-center py-1 gap-1 text-[10px] font-bold tracking-tight active:scale-90 transition-all ${isCurrentActive("/browse", "type=movie")
                ? "text-red-500 scale-105"
                : "text-zinc-400 hover:text-white"
              }`
            }
          >
            <Film size={20} />
            <span>Movies</span>
          </NavLink>

          {/* 3. Series */}
          <NavLink
            to="/browse?type=tv"
            className={() =>
              `flex flex-col items-center justify-center py-1 gap-1 text-[10px] font-bold tracking-tight active:scale-90 transition-all ${isCurrentActive("/browse", "type=tv")
                ? "text-red-500 scale-105"
                : "text-zinc-400 hover:text-white"
              }`
            }
          >
            <Tv size={20} />
            <span>Series</span>
          </NavLink>

          {/* 4. Search */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex flex-col items-center justify-center py-1 gap-1 text-[10px] font-bold tracking-tight text-zinc-400 hover:text-white active:scale-90 transition-all"
            aria-label="Search"
          >
            <Search size={20} />
            <span>Search</span>
          </button>

          {/* 5. Menu Trigger (Far Right) */}
          <button
            onClick={openMenu}
            className={`flex flex-col items-center justify-center py-1 gap-1 text-[10px] font-bold tracking-tight active:scale-90 transition-all ${isMenuOpen ? "text-red-500 scale-105" : "text-zinc-400 hover:text-white"
              }`}
            aria-label="Open navigation menu"
            aria-expanded={isMenuOpen}
          >
            <Menu size={20} />
            <span>Menu</span>
          </button>
        </div>
      </nav>

      {/* ─── Animated Draggable Bottom Sheet Modal ─── */}
      <div
        className={`fixed inset-0 z-50 md:hidden touch-none overscroll-none transition-visibility duration-200 ${isMenuOpen ? "pointer-events-auto" : "pointer-events-none"
          }`}
      >
        {/* Backdrop with Fade Animation */}
        <div
          className={`absolute inset-0 bg-black/75 backdrop-blur-md transition-opacity duration-200 ease-out ${isMenuOpen ? "opacity-100" : "opacity-0"
            }`}
          onClick={closeMenu}
          onTouchMove={(e) => {
            if (e.cancelable) e.preventDefault();
          }}
          aria-hidden="true"
        />

        {/* Sheet Container with Hardware-Accelerated Slide-Up Animation */}
        <div
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{
            transform: !isMenuOpen
              ? "translateY(100%)"
              : dragOffset > 0
                ? `translateY(${dragOffset}px)`
                : "translateY(0%)",
            transition:
              dragOffset > 0
                ? "none"
                : "transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
          className="absolute bottom-0 left-0 right-0 bg-[#121214]/95 backdrop-blur-2xl border-t border-white/10 rounded-t-3xl shadow-2xl px-5 pt-3 pb-[max(2rem,env(safe-area-inset-bottom))] max-h-[85vh] overflow-y-auto modal-scrollable overscroll-contain select-none will-change-transform"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation Menu"
        >
          {/* Dedicated Draggable Handle Area */}
          <div
            onClick={closeMenu}
            className="w-full pt-1 pb-3 flex flex-col items-center justify-center cursor-pointer active:opacity-75 touch-none"
            aria-label="Drag or tap to close menu"
          >
            <div className="w-14 h-1.5 rounded-full bg-zinc-600 hover:bg-zinc-500 transition-colors" />
          </div>

          {/* Modal Header */}
          <div className="flex items-center justify-between pb-3.5 border-b border-white/5 mb-3 px-1">
            <div
              onClick={() => handleNavigate("/")}
              className="flex items-center gap-2.5 cursor-pointer active:scale-95 transition-transform"
            >
              <div className="h-7 w-7 rounded-lg overflow-hidden shadow-md shadow-red-950/40">
                <img src="/favicon.png" alt="" className="w-full h-full object-cover" />
              </div>
              <span className="text-lg font-black tracking-tighter text-white uppercase italic">
                CINEMA<span className="text-red-600">POT</span>
              </span>
            </div>
          </div>

          {/* Navlinks List with Glassmorphic styling */}
          <div className="space-y-2">
            {/* New & Popular */}
            <div
              onClick={() => handleNavigate("/browse?sort=new")}
              role="button"
              tabIndex={0}
              className={`flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer active:scale-98 ${location.pathname === "/browse" && location.search.includes("sort=new")
                  ? "bg-red-600/15 text-white border-red-500/30"
                  : "bg-white/[0.03] border-white/5 text-zinc-300 hover:bg-white/[0.08]"
                }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-red-600/15 text-red-500">
                  <Flame size={18} />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">New & Popular</div>
                  <div className="text-[11px] text-zinc-500">Latest movie releases & updates</div>
                </div>
              </div>
              <ChevronRight size={16} className="text-zinc-600" />
            </div>

            {/* Top Rated Movies */}
            <div
              onClick={() => handleNavigate("/browse?sort=top&type=movie")}
              role="button"
              tabIndex={0}
              className={`flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer active:scale-98 ${location.pathname === "/browse" && location.search.includes("sort=top") && location.search.includes("type=movie")
                  ? "bg-yellow-500/15 text-white border-yellow-500/30"
                  : "bg-white/[0.03] border-white/5 text-zinc-300 hover:bg-white/[0.08]"
                }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-yellow-500/15 text-yellow-500">
                  <Star size={18} />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">Top Rated Movies</div>
                  <div className="text-[11px] text-zinc-500">Highest rated blockbusters</div>
                </div>
              </div>
              <ChevronRight size={16} className="text-zinc-600" />
            </div>

            {/* Top Rated Series */}
            <div
              onClick={() => handleNavigate("/browse?sort=top&type=tv")}
              role="button"
              tabIndex={0}
              className={`flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer active:scale-98 ${location.pathname === "/browse" && location.search.includes("sort=top") && location.search.includes("type=tv")
                  ? "bg-emerald-500/15 text-white border-emerald-500/30"
                  : "bg-white/[0.03] border-white/5 text-zinc-300 hover:bg-white/[0.08]"
                }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-400">
                  <Sparkles size={18} />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">Top Series</div>
                  <div className="text-[11px] text-zinc-500">Critically acclaimed shows</div>
                </div>
              </div>
              <ChevronRight size={16} className="text-zinc-600" />
            </div>

            {/* Trending Now */}
            <div
              onClick={() => handleNavigate("/browse?sort=trending")}
              role="button"
              tabIndex={0}
              className={`flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer active:scale-98 ${location.pathname === "/browse" && location.search.includes("sort=trending")
                  ? "bg-blue-500/15 text-white border-blue-500/30"
                  : "bg-white/[0.03] border-white/5 text-zinc-300 hover:bg-white/[0.08]"
                }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-500/15 text-blue-400">
                  <Compass size={18} />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">Trending Now</div>
                  <div className="text-[11px] text-zinc-500">Most watched movies & shows today</div>
                </div>
              </div>
              <ChevronRight size={16} className="text-zinc-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search Modal */}
      {isSearchOpen && <SearchModal onClose={() => setIsSearchOpen(false)} />}
    </>
  );
};

export default MobileBottomNav;
