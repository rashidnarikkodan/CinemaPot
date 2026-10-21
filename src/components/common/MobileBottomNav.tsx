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
  const [isRendered, setIsRendered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState(0);

  const location = useLocation();
  const navigate = useNavigate();

  const openMenu = () => {
    setIsRendered(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsVisible(true);
      });
    });
  };

  const closeMenu = () => {
    setIsVisible(false);
    setTimeout(() => {
      setIsRendered(false);
      setDragOffset(0);
    }, 300);
  };

  // Lock background scrolling completely while menu is open/rendered
  useEffect(() => {
    if (isRendered) {
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
  }, [isRendered]);

  // Close sheet modal automatically on route change
  useEffect(() => {
    closeMenu();
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
        className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-zinc-950/95 backdrop-blur-xl border-t border-white/10 px-2 pt-2 pb-[max(0.6rem,env(safe-area-inset-bottom))] shadow-2xl select-none"
        role="navigation"
        aria-label="Mobile Bottom Navigation"
      >
        <div className="grid grid-cols-5 items-center">
          {/* 1. Home */}
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-1 gap-1 text-[10px] font-bold tracking-tight transition-all ${
                isActive && !location.search
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
              `flex flex-col items-center justify-center py-1 gap-1 text-[10px] font-bold tracking-tight transition-all ${
                isCurrentActive("/browse", "type=movie")
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
              `flex flex-col items-center justify-center py-1 gap-1 text-[10px] font-bold tracking-tight transition-all ${
                isCurrentActive("/browse", "type=tv")
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
            className="flex flex-col items-center justify-center py-1 gap-1 text-[10px] font-bold tracking-tight text-zinc-400 hover:text-white transition-all"
            aria-label="Search"
          >
            <Search size={20} />
            <span>Search</span>
          </button>

          {/* 5. Menu Trigger (Far Right) */}
          <button
            onClick={openMenu}
            className={`flex flex-col items-center justify-center py-1 gap-1 text-[10px] font-bold tracking-tight transition-all ${
              isVisible ? "text-red-500 scale-105" : "text-zinc-400 hover:text-white"
            }`}
            aria-label="Open navigation menu"
            aria-expanded={isVisible}
          >
            <Menu size={20} />
            <span>Menu</span>
          </button>
        </div>
      </nav>

      {/* ─── Animated Draggable Bottom Sheet Modal ─── */}
      {isRendered && (
        <div className="fixed inset-0 z-50 md:hidden touch-none overscroll-none">
          {/* Backdrop with Fade Animation */}
          <div
            className={`absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity duration-300 ease-out ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
            onClick={closeMenu}
            onTouchMove={(e) => {
              if (e.cancelable) e.preventDefault();
            }}
            aria-hidden="true"
          />

          {/* Sheet Container with Slide-Up / Slide-Down Animation */}
          <div
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{
              transform: !isVisible
                ? "translateY(100%)"
                : dragOffset > 0
                ? `translateY(${dragOffset}px)`
                : "translateY(0%)",
              transition:
                dragOffset > 0
                  ? "none"
                  : "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
            className="absolute bottom-0 left-0 right-0 bg-[#121214] border-t border-white/10 rounded-t-3xl shadow-2xl px-5 pt-3 pb-[max(2rem,env(safe-area-inset-bottom))] max-h-[85vh] overflow-y-auto modal-scrollable overscroll-contain"
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

            {/* Modal Header without X or text */}
            <div className="flex items-center justify-between pb-3.5 border-b border-white/5 mb-3 px-1">
              <div
                onClick={() => {
                  navigate("/");
                  closeMenu();
                }}
                className="flex items-center gap-2.5 cursor-pointer"
              >
                <div className="h-7 w-7 rounded-lg overflow-hidden shadow-md shadow-red-950/40">
                  <img src="/favicon.png" alt="" className="w-full h-full object-cover" />
                </div>
                <span className="text-lg font-black tracking-tighter text-white uppercase italic">
                  CINEMA<span className="text-red-600">POT</span>
                </span>
              </div>
            </div>

            {/* Navlinks List */}
            <div className="space-y-1.5">
              {/* New & Popular */}
              <NavLink
                to="/browse?sort=new"
                onClick={closeMenu}
                className={({ isActive }) =>
                  `flex items-center justify-between p-3 rounded-xl transition-all ${
                    isActive && location.search.includes("sort=new")
                      ? "bg-red-600/15 text-white border border-red-500/30"
                      : "text-zinc-300 hover:bg-zinc-800/60"
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-red-600/10 text-red-500">
                    <Flame size={18} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">New & Popular</div>
                    <div className="text-[11px] text-zinc-500">Latest movie releases & updates</div>
                  </div>
                </div>
                <ChevronRight size={16} className="text-zinc-600" />
              </NavLink>

              {/* Top Rated Movies */}
              <NavLink
                to="/browse?sort=top&type=movie"
                onClick={closeMenu}
                className="flex items-center justify-between p-3 rounded-xl text-zinc-300 hover:bg-zinc-800/60 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-500">
                    <Star size={18} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">Top Rated Movies</div>
                    <div className="text-[11px] text-zinc-500">Highest rated blockbusters</div>
                  </div>
                </div>
                <ChevronRight size={16} className="text-zinc-600" />
              </NavLink>

              {/* Top Rated Series */}
              <NavLink
                to="/browse?sort=top&type=tv"
                onClick={closeMenu}
                className="flex items-center justify-between p-3 rounded-xl text-zinc-300 hover:bg-zinc-800/60 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">Top TV Series</div>
                    <div className="text-[11px] text-zinc-500">Critically acclaimed shows</div>
                  </div>
                </div>
                <ChevronRight size={16} className="text-zinc-600" />
              </NavLink>

              {/* Browse Catalog & Genres */}
              <NavLink
                to="/browse"
                onClick={closeMenu}
                className="flex items-center justify-between p-3 rounded-xl text-zinc-300 hover:bg-zinc-800/60 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                    <Compass size={18} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">Browse All Categories</div>
                    <div className="text-[11px] text-zinc-500">Filter by genre, year, and studio</div>
                  </div>
                </div>
                <ChevronRight size={16} className="text-zinc-600" />
              </NavLink>
            </div>

            {/* Quick Actions & PWA Tag */}
            <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] text-zinc-500">
              <span className="font-semibold text-zinc-400 uppercase tracking-widest text-[10px]">
                CinemaPot PWA
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Search Modal */}
      {isSearchOpen && <SearchModal onClose={() => setIsSearchOpen(false)} />}
    </>
  );
};

export default MobileBottomNav;
