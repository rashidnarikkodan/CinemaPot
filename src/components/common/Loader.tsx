import { Zap } from "lucide-react";

const Loader = () => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black z-[9999]">
      <div className="relative">
        {/* Outer Ring */}
        <div className="w-24 h-24 rounded-full border-4 border-zinc-800 border-t-red-600 animate-spin" />
        
        {/* Glow */}
        <div className="absolute inset-0 bg-red-600/20 blur-3xl rounded-full animate-pulse" />
      </div>
      
      <div className="mt-10 flex flex-col items-center gap-2">
        <h2 className="text-2xl font-black italic tracking-tighter text-white uppercase">
          Cinema<span className="text-red-600">Pot</span>
        </h2>
        <div className="flex gap-1">
          <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
          <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
          <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-bounce" />
        </div>
      </div>
    </div>
  );
};

export default Loader;
