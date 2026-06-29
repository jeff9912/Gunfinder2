import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { layoutModes } from "../styles/theme";
import { loadLayoutMode, saveLayoutMode } from "../services/storageService";

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [layoutMode, setLayoutModeState] = useState(layoutModes.COMFORTABLE);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function hydrate() {
      const savedMode = await loadLayoutMode();
      if (isMounted && Object.values(layoutModes).includes(savedMode)) {
        setLayoutModeState(savedMode);
      }
      if (isMounted) {
        setIsReady(true);
      }
    }

    hydrate();

    return () => {
      isMounted = false;
    };
  }, []);

  const setLayoutMode = useCallback(async (mode) => {
    setLayoutModeState(mode);
    await saveLayoutMode(mode);
  }, []);

  const value = useMemo(
    () => ({
      layoutMode,
      setLayoutMode,
      isReady,
    }),
    [layoutMode, setLayoutMode, isReady],
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings moet binnen SettingsProvider gebruikt worden.");
  }
  return context;
}
