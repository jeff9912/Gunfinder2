import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  loadFavorites,
  loadLikes,
  loadNotes,
  saveFavorites,
  saveLikes,
  saveNotes,
} from "../services/storageService";

const HotspotDataContext = createContext(null);

export function HotspotDataProvider({ children }) {
  const [favorites, setFavorites] = useState([]);
  const [likes, setLikes] = useState([]);
  const [notes, setNotes] = useState({});
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function hydrate() {
      const [savedFavorites, savedLikes, savedNotes] = await Promise.all([
        loadFavorites(),
        loadLikes(),
        loadNotes(),
      ]);

      if (!isMounted) {
        return;
      }

      setFavorites(Array.isArray(savedFavorites) ? savedFavorites : []);
      setLikes(Array.isArray(savedLikes) ? savedLikes : []);
      setNotes(savedNotes && typeof savedNotes === "object" ? savedNotes : {});
      setIsReady(true);
    }

    hydrate();

    return () => {
      isMounted = false;
    };
  }, []);

  const toggleFavorite = useCallback(async (hotspotId) => {
    setFavorites((current) => {
      const next = current.includes(hotspotId)
        ? current.filter((id) => id !== hotspotId)
        : [...current, hotspotId];
      saveFavorites(next);
      return next;
    });
  }, []);

  const toggleLike = useCallback(async (hotspotId) => {
    setLikes((current) => {
      const next = current.includes(hotspotId)
        ? current.filter((id) => id !== hotspotId)
        : [...current, hotspotId];
      saveLikes(next);
      return next;
    });
  }, []);

  const setNote = useCallback(async (hotspotId, text) => {
    setNotes((current) => {
      const trimmed = text.trim();
      const next = { ...current };

      if (trimmed.length === 0) {
        delete next[hotspotId];
      } else {
        next[hotspotId] = trimmed;
      }

      saveNotes(next);
      return next;
    });
  }, []);

  const isFavorite = useCallback((hotspotId) => favorites.includes(hotspotId), [favorites]);
  const isLiked = useCallback((hotspotId) => likes.includes(hotspotId), [likes]);
  const getNote = useCallback((hotspotId) => notes[hotspotId] ?? "", [notes]);

  const value = useMemo(
    () => ({
      favorites,
      likes,
      notes,
      isReady,
      toggleFavorite,
      toggleLike,
      setNote,
      isFavorite,
      isLiked,
      getNote,
    }),
    [favorites, likes, notes, isReady, toggleFavorite, toggleLike, setNote, isFavorite, isLiked, getNote],
  );

  return <HotspotDataContext.Provider value={value}>{children}</HotspotDataContext.Provider>;
}

export function useHotspotData() {
  const context = useContext(HotspotDataContext);
  if (!context) {
    throw new Error("useHotspotData moet binnen HotspotDataProvider gebruikt worden.");
  }
  return context;
}
