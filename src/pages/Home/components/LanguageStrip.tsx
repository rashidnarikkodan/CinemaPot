import { useNavigate } from "react-router-dom";
import { Globe2, ArrowRight } from "lucide-react";
import { POPULAR_LANGUAGES } from "../../../config/languages";

const LanguageStrip = () => {
  const navigate = useNavigate();

  return (
    <div className="px-4 md:px-12 py-6 select-none">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-red-600/15 text-red-500 border border-red-500/20">
            <Globe2 size={18} />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-black text-white tracking-tight flex items-center gap-2">
              Explore by Language
            </h2>
            <p className="text-xs text-zinc-400">
              Discover top cinema in your preferred language
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate("/languages")}
          className="group flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-white transition-colors cursor-pointer"
        >
          <span>See all</span>
          <ArrowRight
            size={14}
            className="group-hover:translate-x-1 transition-transform text-red-500"
          />
        </button>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 pt-1 scrollbar-hide -mx-4 px-4 md:-mx-12 md:px-12">
        {POPULAR_LANGUAGES.map((lang) => (
          <div
            key={lang.code}
            onClick={() => navigate(`/languages?lang=${lang.code}`)}
            className="group relative flex flex-col justify-between shrink-0 w-36 sm:w-44 p-3.5 sm:p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/8 hover:border-red-500/40 transition-all duration-300 cursor-pointer active:scale-95 shadow-lg overflow-hidden"
          >
            {/* Subtle Gradient Backlight */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${
                lang.gradient || "from-red-600/20 to-purple-600/20"
              } opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}
            />

            <div className="relative z-10 flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 group-hover:text-red-400 transition-colors">
                {lang.code.toUpperCase()}
              </span>
              <ArrowRight
                size={13}
                className="text-zinc-600 group-hover:text-white group-hover:translate-x-0.5 transition-all"
              />
            </div>

            <div className="relative z-10 mt-3">
              <h3 className="font-bold text-white text-sm sm:text-base group-hover:text-white transition-colors leading-tight">
                {lang.name}
              </h3>
              <p className="text-xs text-zinc-400 group-hover:text-zinc-300 transition-colors mt-0.5">
                {lang.nativeName}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LanguageStrip;
