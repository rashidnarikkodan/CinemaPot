import { useEffect, useState } from "react";
import MovieRow from "./MovieRow";
import { ROW_CONFIG } from "../../config/rowConfig";
import { fetchMovies } from "../../utils/fetchMovies";
import type { MovieRow as MovieRowType } from "../../types/row";

/**
 * Optimized RowContainer that handles sequential row loading 
 * to prevent network congestion and improve initial TBT.
 */
const RowContainer = () => {
  const [rowsData, setRowsData] = useState<Record<number, MovieRowType>>({});
  const [loadingStates, setLoadingStates] = useState<Record<number, boolean>>({});

  useEffect(() => {
    // Sequentially fetch rows to prioritize "above the fold" content
    const loadRows = async () => {
      for (let i = 0; i < ROW_CONFIG.length; i++) {
        const config = ROW_CONFIG[i];
        setLoadingStates(prev => ({ ...prev, [i]: true }));
        
        try {
          const data = await fetchMovies(config);
          setRowsData(prev => ({
            ...prev,
            [i]: {
              title: config.title,
              movies: data.results,
              mediaType: config.mediaType,
            }
          }));
        } catch (err) {
          console.error(`Failed to load row: ${config.title}`, err);
        } finally {
          setLoadingStates(prev => ({ ...prev, [i]: false }));
        }
      }
    };

    loadRows();
  }, []);

  return (
    <main className="flex flex-col min-h-screen">
      {ROW_CONFIG.map((config, idx) => (
        <MovieRow 
          key={config.title} 
          row={rowsData[idx] || { title: config.title, movies: [], mediaType: config.mediaType }} 
          isLoading={loadingStates[idx] ?? true} 
        />
      ))}
    </main>
  );
};

export default RowContainer;
