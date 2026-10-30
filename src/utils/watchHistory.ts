import { useState, useEffect } from "react";
import type { WatchHistoryItem } from "../types/movie";

const WATCH_HISTORY_KEY = "cinemapot_watch_history";
const MAX_HISTORY_ITEMS = 10;
const WATCH_HISTORY_EVENT = "cinemapot_watch_history_updated";

const SERIES_PROGRESS_KEY = "cinemapot_series_progress";
const MAX_PROGRESS_ITEMS = 100;

export interface SeriesProgress {
  season: number;
  episode: number;
  updatedAt?: number;
}

/**
 * Retrieves the last watched season and episode for a TV series.
 */
export const getSeriesProgress = (seriesId: number | string): SeriesProgress | null => {
  try {
    const raw = localStorage.getItem(SERIES_PROGRESS_KEY);
    if (!raw) return null;
    const progressMap = JSON.parse(raw);
    const item = progressMap[String(seriesId)];
    if (item && typeof item.season === "number" && typeof item.episode === "number") {
      return { season: item.season, episode: item.episode, updatedAt: item.updatedAt };
    }
  } catch {
    // Ignore storage restriction / parsing errors
  }
  return null;
};

/**
 * Saves the last watched season and episode for a TV series.
 */
export const saveSeriesProgress = (
  seriesId: number | string,
  season: number,
  episode: number
): void => {
  try {
    if (!seriesId || season < 1 || episode < 1) return;
    const raw = localStorage.getItem(SERIES_PROGRESS_KEY);
    const progressMap: Record<string, SeriesProgress> = raw ? JSON.parse(raw) : {};

    progressMap[String(seriesId)] = {
      season,
      episode,
      updatedAt: Date.now(),
    };

    // Keep map size bounded to avoid localStorage bloat
    const keys = Object.keys(progressMap);
    if (keys.length > MAX_PROGRESS_ITEMS) {
      const sortedKeys = keys.sort(
        (a, b) => (progressMap[b]?.updatedAt || 0) - (progressMap[a]?.updatedAt || 0)
      );
      const pruned: Record<string, SeriesProgress> = {};
      sortedKeys.slice(0, MAX_PROGRESS_ITEMS).forEach((k) => {
        pruned[k] = progressMap[k];
      });
      localStorage.setItem(SERIES_PROGRESS_KEY, JSON.stringify(pruned));
    } else {
      localStorage.setItem(SERIES_PROGRESS_KEY, JSON.stringify(progressMap));
    }

    // Also update any existing TV item in recent watch history to stay in sync
    const currentHistory = getWatchHistory();
    let historyChanged = false;
    const updatedHistory = currentHistory.map((item) => {
      if (item.media_type === "tv" && String(item.id) === String(seriesId)) {
        historyChanged = true;
        return { ...item, season, episode };
      }
      return item;
    });

    if (historyChanged) {
      localStorage.setItem(WATCH_HISTORY_KEY, JSON.stringify(updatedHistory));
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event(WATCH_HISTORY_EVENT));
      }
    }
  } catch {
    // Ignore storage restriction errors
  }
};

/**
 * Generates the watch URL for a TV show, automatically routing to the user's
 * most recently watched season & episode if available.
 */
export const getSeriesWatchUrl = (
  seriesId: number | string,
  defaultSeason: number = 1,
  defaultEpisode: number = 1
): string => {
  const saved = getSeriesProgress(seriesId);
  const s = saved ? saved.season : defaultSeason;
  const e = saved ? saved.episode : defaultEpisode;
  return `/watch/tv/${seriesId}?season=${s}&episode=${e}`;
};

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

    // If it's a TV show, resolve season/episode either from item or saved progress
    let tvSeason = item.season;
    let tvEpisode = item.episode;
    if (item.media_type === "tv") {
      if (typeof tvSeason === "number" && typeof tvEpisode === "number") {
        saveSeriesProgress(item.id, tvSeason, tvEpisode);
      } else {
        const savedProgress = getSeriesProgress(item.id);
        if (savedProgress) {
          tvSeason = savedProgress.season;
          tvEpisode = savedProgress.episode;
        }
      }
    }

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
      ...(item.media_type === "tv" && typeof tvSeason === "number" ? { season: tvSeason } : {}),
      ...(item.media_type === "tv" && typeof tvEpisode === "number" ? { episode: tvEpisode } : {}),
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
