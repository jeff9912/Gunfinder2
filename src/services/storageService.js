import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEYS = {
  LAYOUT_MODE: "@hotspots/layoutMode",
  FAVORITES: "@hotspots/favorites",
  NOTES: "@hotspots/notes",
  HOTSPOTS_CACHE: "@hotspots/cache",
};

export async function loadJson(key, fallback) {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (raw === null) {
      return fallback;
    }
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export async function saveJson(key, value) {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export async function loadLayoutMode() {
  return loadJson(STORAGE_KEYS.LAYOUT_MODE, "comfortable");
}

export async function saveLayoutMode(mode) {
  await saveJson(STORAGE_KEYS.LAYOUT_MODE, mode);
}

export async function loadFavorites() {
  return loadJson(STORAGE_KEYS.FAVORITES, []);
}

export async function saveFavorites(favorites) {
  await saveJson(STORAGE_KEYS.FAVORITES, favorites);
}

export async function loadNotes() {
  return loadJson(STORAGE_KEYS.NOTES, {});
}

export async function saveNotes(notes) {
  await saveJson(STORAGE_KEYS.NOTES, notes);
}

export async function loadHotspotsCache() {
  return loadJson(STORAGE_KEYS.HOTSPOTS_CACHE, []);
}

export async function saveHotspotsCache(hotspots) {
  await saveJson(STORAGE_KEYS.HOTSPOTS_CACHE, hotspots);
}
