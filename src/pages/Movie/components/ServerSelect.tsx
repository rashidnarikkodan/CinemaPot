import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, Server as ServerIcon } from "lucide-react";
import type { StreamServer } from "./servers";

interface ServerSelectProps {
  servers: StreamServer[];
  selectedServer: number;
  onSelectServer: (index: number) => void;
}

const ServerSelect = ({
  servers,
  selectedServer,
  onSelectServer,
}: ServerSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const current = servers[selectedServer] || servers[0];

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative inline-block text-left w-full sm:w-auto" ref={containerRef}>
      <div className="flex items-center gap-3">
        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-500 shrink-0">
          Stream Server
        </span>

        {/* Custom Select Trigger Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          className={`flex items-center justify-between gap-3 px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 border min-w-[170px] ${
            isOpen
              ? "bg-zinc-800 border-white/20 text-white shadow-lg"
              : "bg-zinc-900/80 hover:bg-zinc-800/90 border-white/10 text-zinc-200 hover:text-white"
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse shrink-0" />
            <span className="truncate">{current.name}</span>
          </div>
          <ChevronDown
            size={15}
            className={`text-zinc-400 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {/* Custom Options Dropdown */}
      {isOpen && (
        <div
          role="listbox"
          className="absolute left-0 sm:left-auto right-0 sm:right-auto mt-2 w-full sm:w-56 z-50 bg-[#161618] border border-white/10 rounded-xl shadow-2xl p-1.5 backdrop-blur-xl animate-in fade-in duration-150"
        >
          <div className="px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider text-zinc-500 border-b border-white/5 mb-1 flex items-center justify-between">
            <span>Select Video Server</span>
            <ServerIcon size={11} className="text-zinc-500" />
          </div>

          <div className="space-y-1">
            {servers.map((s, idx) => {
              const isSelected = selectedServer === idx;
              return (
                <button
                  key={s.name}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onSelectServer(idx);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all text-left ${
                    isSelected
                      ? "bg-red-600 text-white font-bold shadow-md shadow-red-950/50"
                      : "text-zinc-300 hover:text-white hover:bg-zinc-800/70"
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isSelected ? "bg-white" : "bg-zinc-600"
                      }`}
                    />
                    <span className="truncate">{s.name}</span>
                  </div>
                  {isSelected && <Check size={14} className="text-white shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ServerSelect;
