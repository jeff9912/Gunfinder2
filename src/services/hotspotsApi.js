import hotspotsBackup from "../data/hotspotsBackup.json";

const OVERPASS_API_URL =
  "https://overpass-api.de/api/interpreter?data=%5Bout%3Ajson%5D%5Btimeout%3A60%5D%3B%0Aarea%5B%22name%22%3D%22Nederland%22%5D-%3E.searchArea%3B%0A%0A%28%0A%20%20nwr%5B%22sport%22%3D%22shooting%22%5D%28area.searchArea%29%3B%0A%20%20nwr%5B%22amenity%22%3D%22shooting_range%22%5D%28area.searchArea%29%3B%0A%29%3B%0A%0Aout%20center%3B";
const MAX_RETRY_ATTEMPTS = 5;
const RETRY_DELAY_MS = 1200;
const RETRYABLE_STATUS_CODES = new Set([429, 500, 502, 503, 504]);

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function mapElementToHotspot(element) {
  const lat = element.lat ?? element.center?.lat ?? null;
  const lon = element.lon ?? element.center?.lon ?? null;
  const tags = element.tags ?? {};

  return {
    id: `${element.type}-${element.id}`,
    name: tags.name ?? "Onbekende hotspot",
    description: tags.description ?? tags.note ?? "Geen extra beschrijving beschikbaar.",
    city: tags["addr:city"] ?? "Onbekende plaats",
    amenity: tags.amenity ?? "onbekend",
    sport: tags.sport ?? "onbekend",
    lat,
    lon,
    sourceType: element.type,
  };
}

function normalizeElements(elements) {
  return elements
    .map(mapElementToHotspot)
    .filter((hotspot) => hotspot.lat !== null && hotspot.lon !== null);
}

async function fetchHotspotsFromRemote() {
  let lastErrorMessage = "";

  for (let attempt = 1; attempt <= MAX_RETRY_ATTEMPTS; attempt += 1) {
    let response;

    try {
      response = await fetch(OVERPASS_API_URL, {
        headers: {
          Accept: "application/json",
        },
      });
    } catch (networkError) {
      lastErrorMessage = networkError.message ?? "Netwerkfout bij ophalen van hotspots.";

      if (attempt < MAX_RETRY_ATTEMPTS) {
        await wait(RETRY_DELAY_MS * attempt);
        continue;
      }

      throw new Error(lastErrorMessage);
    }

    if (response.ok) {
      const json = await response.json();
      const elements = Array.isArray(json.elements) ? json.elements : [];
      return normalizeElements(elements);
    }

    lastErrorMessage = `Hotspot API fout (${response.status}).`;

    if (RETRYABLE_STATUS_CODES.has(response.status) && attempt < MAX_RETRY_ATTEMPTS) {
      await wait(RETRY_DELAY_MS * attempt);
      continue;
    }

    throw new Error(lastErrorMessage);
  }

  throw new Error(lastErrorMessage || "Kon hotspots niet ophalen van de server.");
}

export async function fetchHotspots() {
  try {
    return await fetchHotspotsFromRemote();
  } catch (error) {
    const backupElements = Array.isArray(hotspotsBackup.elements) ? hotspotsBackup.elements : [];

    if (backupElements.length > 0) {
      console.warn("Hotspots API tijdelijk onbereikbaar, fallback naar lokale backupdata.", error.message);
      return normalizeElements(backupElements);
    }

    throw new Error(error.message ?? "Kon hotspots niet ophalen van de server.");
  }
}
