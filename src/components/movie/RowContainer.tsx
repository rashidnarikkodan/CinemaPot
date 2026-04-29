import { useEffect, useState } from "react";
import MovieRow from "./MovieRow";
import { fetchRows } from "../../utils/fetchRow";
import type { MovieRow as MovieRowType } from "../../types/row";

const RowContainer = () => {
  const [rows, setRows] = useState<MovieRowType[]>(Array(7).fill(0));
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRows()
      .then(setRows)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  if (error) {
    return (
      <p className="px-6 py-10 text-sm text-red-500">Failed to load movies</p>
    );
  }

  return (
    <main className="flex flex-col">
      {rows.map((row, idx) => (
        <MovieRow key={row.title || `skeleton-row-${idx}`} row={row} isLoading={loading?loading:false} />
      ))}
    </main>
  );
};

export default RowContainer;
