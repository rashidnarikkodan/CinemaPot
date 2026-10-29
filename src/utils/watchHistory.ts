import { useState, useEffect } from "react";
import type { WatchHistoryItem } from "../types/movie";

const WATCH_HISTORY_KEY = "cinemapot_watch_history";
const MAX_HISTORY_ITEMS = 10;
const WATCH_HISTORY_EVENT = "cinemapot_watch_history_updated";

/**
 * Retrieves the user's recent watch history from localStorage (max 10 items).
 */
export const getWatchHistory = (): WatchHistoryItem[] => {
  try {
    const raw = localStorage.getItem(WATCH_HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.slice(0, MAX_HISTORY_ITEMS);
    }
  } catch {
    // Ignore storage restriction / parsing errors
  }
  return [];
};

/**
 * Adds or bumps a movie/series to the front of recent watch history,
 * strictly keeping at most 10 items and storing only essential fields.
 */
export const addToWatchHistory = (item: WatchHistoryItem): void => {
  try {
    if (!item || !item.id) return;
    const current = getWatchHistory();
    // Remove if already exists to bump it to front
    const filtered = current.filter(
      (m) => !(m.id === item.id && m.media_type === item.media_type)
    );

    // Save only essential fields to minimize storage footprint (<1 KB)
    const normalizedItem: WatchHistoryItem = {
      id: item.id,
      title: item.title || "Untitled",
      poster_path: item.poster_path ?? null,
      release_date: item.release_date,
      first_air_date: item.first_air_date,
      vote_average: Number(item.vote_average) || 0,
      vote_count: item.vote_count,
      popularity: item.popularity,
      media_type: item.media_type || "movie",
    };

    const updated = [normalizedItem, ...filtered].slice(0, MAX_HISTORY_ITEMS);
    localStorage.setItem(WATCH_HISTORY_KEY, JSON.stringify(updated));

    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event(WATCH_HISTORY_EVENT));
    }
  } catch {
    // Ignore storage restriction errors
  }
};

/**
 * Clears the watch history from storage.
 */
export const clearWatchHistory = (): void => {
  try {
    localStorage.removeItem(WATCH_HISTORY_KEY);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event(WATCH_HISTORY_EVENT));
    }
  } catch {
    // Ignore storage restriction errors
  }
};

/**
 * React hook to access and subscribe to watch history changes across components/tabs.
 */
export const useWatchHistory = () => {
  const [history, setHistory] = useState<WatchHistoryItem[]>(getWatchHistory);

  useEffect(() => {
    const sync = () => {
      setHistory(getWatchHistory());
    };

    window.addEventListener(WATCH_HISTORY_EVENT, sync);
    window.addEventListener("storage", sync);

    return () => {
      window.removeEventListener(WATCH_HISTORY_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return { history, clearHistory: clearWatchHistory };
};
