import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { loadFavorites, loadNotes, saveFavorites, saveNotes } from "../services/storageService";

const HotspotDataContext = createContext(null);

export function HotspotDataProvider({ children }) {
  const [favorites, setFavorites] = useState([]);
  const [notes, setNotes] = useState({});

  useEffect(() => {
    let isMounted = true;

    async function hydrate() {
      const [savedFavorites, savedNotes] = await Promise.all([loadFavorites(), loadNotes()]);

      if (!isMounted) {
        return;
      }

      setFavorites(Array.isArray(savedFavorites) ? savedFavorites : []);
      setNotes(savedNotes && typeof savedNotes === "object" ? savedNotes : {});
    }

    hydrate();

    return () => {
      isMounted = false;
    };
  }, []);

  const toggleFavorite = useCallback((hotspotId) => {
    setFavorites((current) => {
      const next = current.includes(hotspotId)
        ? current.filter((id) => id !== hotspotId)
        : [...current, hotspotId];
      saveFavorites(next);
      return next;
    });
  }, []);

  const setNote = useCallback((hotspotId, text) => {
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
  const getNote = useCallback((hotspotId) => notes[hotspotId] ?? "", [notes]);

  const value = useMemo(
    () => ({
      favorites,
      notes,
      toggleFavorite,
      setNote,
      isFavorite,
      getNote,
    }),
    [favorites, notes, toggleFavorite, setNote, isFavorite, getNote],
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
