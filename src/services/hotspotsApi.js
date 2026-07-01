import hotspotsBackup from "../data/hotspotsBackup.json";
import { loadHotspotsCache, saveHotspotsCache } from "./storageService";

const GOOGLE_PLACES_API_KEY = "AIzaSyD8_TAtznizlsGGPKPi5EYR9Nm1Y1XiXbI";
const TEXT_SEARCH_ENDPOINT = "https://places.googleapis.com/v1/places:searchText";

const NL_VIEWPORT = {
  low: { latitude: 50.75, longitude: 3.36 },
  high: { latitude: 53.55, longitude: 7.23 },
};

const SEARCH_QUERIES = [
  "schietclub",
  "schietsportvereniging",
  "shooting range Nederland",
];

const HotspotsApiErrorCode = {
  NO_INTERNET: "NO_INTERNET",
  API_DISABLED: "HOTSPOTS_API_DISABLED",
  API_UNAUTHORIZED: "HOTSPOTS_API_UNAUTHORIZED",
  API_FORBIDDEN: "HOTSPOTS_API_FORBIDDEN",
  API_BAD_REQUEST: "HOTSPOTS_API_BAD_REQUEST",
  API_RATE_LIMITED: "HOTSPOTS_API_RATE_LIMITED",
  API_SERVER_ERROR: "HOTSPOTS_API_SERVER_ERROR",
  API_HTTP_ERROR: "HOTSPOTS_API_HTTP_ERROR",
  PARSE_ERROR: "HOTSPOTS_PARSE_ERROR",
  NO_RESULTS: "HOTSPOTS_NO_RESULTS",
};

class HotspotsApiError extends Error {
  constructor(code, message, details = {}) {
    super(`[${code}] ${message}`);
    this.name = "HotspotsApiError";
    this.code = code;
    this.details = details;
  }
}

function mapPlaceToHotspot(place) {
  return {
    id: place.id,
    name: place.displayName?.text ?? "Onbekende hotspot",
    description: place.formattedAddress ?? "Geen extra beschrijving beschikbaar.",
    city: place.formattedAddress ?? "Onbekende plaats",
    amenity: "shooting_range",
    sport: "shooting",
    lat: place.location?.latitude ?? null,
    lon: place.location?.longitude ?? null,
  };
}

function mapBackupElementToHotspot(element) {
  const tags = element.tags ?? {};
  const name = tags.name ?? tags.short_name ?? `Hotspot ${element.id}`;
  const descriptionParts = [tags.leisure, tags.amenity, tags.website].filter(Boolean);

  return {
    id: String(element.id),
    name,
    description:
      descriptionParts.length > 0
        ? descriptionParts.join(" • ")
        : "Lokale offline hotspot uit het backup-bestand.",
    city: tags["addr:city"] ?? tags["addr:place"] ?? "Onbekende plaats",
    amenity: tags.amenity ?? tags.leisure ?? "shooting_range",
    sport: tags.sport ?? "shooting",
    lat: element.lat ?? null,
    lon: element.lon ?? null,
  };
}

function normalizeHotspots(hotspots) {
  return hotspots.filter((hotspot) => hotspot.lat !== null && hotspot.lon !== null);
}

function getOfflineHotspots() {
  const backupElements = Array.isArray(hotspotsBackup?.elements) ? hotspotsBackup.elements : [];

  return normalizeHotspots(
    backupElements
      .filter((element) => element?.type === "node" && element?.tags?.sport === "shooting")
      .map(mapBackupElementToHotspot)
  );
}

function getGoogleErrorReason(errorBody) {
  const details = errorBody?.error?.details;
  if (!Array.isArray(details)) {
    return null;
  }

  const errorInfo = details.find(
    (detail) => detail["@type"] === "type.googleapis.com/google.rpc.ErrorInfo"
  );
  return errorInfo?.reason ?? null;
}

function createHttpError(status, errorBody, textQuery) {
  const googleStatus = errorBody?.error?.status ?? null;
  const googleReason = getGoogleErrorReason(errorBody);
  const googleMessage = errorBody?.error?.message ?? null;
  const baseDetails = { httpStatus: status, googleStatus, googleReason, textQuery };

  if (status === 400) {
    return new HotspotsApiError(
      HotspotsApiErrorCode.API_BAD_REQUEST,
      googleMessage ?? "Ongeldige zoekopdracht naar Google Places.",
      baseDetails
    );
  }

  if (status === 401 || googleReason === "API_KEY_INVALID") {
    return new HotspotsApiError(
      HotspotsApiErrorCode.API_UNAUTHORIZED,
      "Google Places API-sleutel is ongeldig of ontbreekt.",
      baseDetails
    );
  }

  if (googleReason === "SERVICE_DISABLED") {
    return new HotspotsApiError(
      HotspotsApiErrorCode.API_DISABLED,
      "Places API (New) is niet ingeschakeld in het Google Cloud-project. Schakel de API in en wacht een paar minuten.",
      baseDetails
    );
  }

  if (status === 403) {
    return new HotspotsApiError(
      HotspotsApiErrorCode.API_FORBIDDEN,
      googleMessage ?? "Geen toegang tot Google Places API.",
      baseDetails
    );
  }

  if (status === 429) {
    return new HotspotsApiError(
      HotspotsApiErrorCode.API_RATE_LIMITED,
      "Te veel verzoeken aan Google Places. Probeer het later opnieuw.",
      baseDetails
    );
  }

  if (status >= 500) {
    return new HotspotsApiError(
      HotspotsApiErrorCode.API_SERVER_ERROR,
      "Google Places API is tijdelijk niet bereikbaar.",
      baseDetails
    );
  }

  return new HotspotsApiError(
    HotspotsApiErrorCode.API_HTTP_ERROR,
    googleMessage ?? `Google Places API gaf HTTP ${status}.`,
    baseDetails
  );
}

async function parseErrorResponse(response, textQuery) {
  const rawBody = await response.text();

  try {
    return createHttpError(response.status, JSON.parse(rawBody), textQuery);
  } catch {
    return createHttpError(response.status, null, textQuery);
  }
}

async function searchOneQuery(textQuery) {
  let response;

  try {
    response = await fetch(TEXT_SEARCH_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": GOOGLE_PLACES_API_KEY,
        "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress,places.location",
      },
      body: JSON.stringify({
        textQuery,
        locationRestriction: { rectangle: NL_VIEWPORT },
        pageSize: 20,
      }),
    });
  } catch (error) {
    throw new HotspotsApiError(
      HotspotsApiErrorCode.NO_INTERNET,
      "Geen internetverbinding.",
      { cause: error?.message, textQuery }
    );
  }

  if (!response.ok) {
    throw await parseErrorResponse(response, textQuery);
  }

  let json;

  try {
    json = await response.json();
  } catch (error) {
    throw new HotspotsApiError(
      HotspotsApiErrorCode.PARSE_ERROR,
      "Antwoord van Google Places kon niet worden gelezen.",
      { cause: error?.message, textQuery }
    );
  }

  return Array.isArray(json.places) ? json.places : [];
}

export async function fetchHotspots() {
  try {
    const allPlacesArrays = await Promise.all(SEARCH_QUERIES.map(searchOneQuery));
    const merged = allPlacesArrays.flat();

    const uniqueById = Array.from(
      new Map(merged.map((place) => [place.id, place])).values()
    );

    const hotspots = normalizeHotspots(uniqueById.map(mapPlaceToHotspot));

    if (hotspots.length === 0) {
      throw new HotspotsApiError(
        HotspotsApiErrorCode.NO_RESULTS,
        "Geen hotspots gevonden via Google Places.",
        { queries: SEARCH_QUERIES }
      );
    }

    await saveHotspotsCache(hotspots);
    return hotspots;
  } catch (error) {
    const cachedHotspots = await loadHotspotsCache();
    if (Array.isArray(cachedHotspots) && cachedHotspots.length > 0) {
      return normalizeHotspots(cachedHotspots);
    }

    if (error?.code !== HotspotsApiErrorCode.NO_INTERNET) {
      throw error;
    }

    const offlineHotspots = getOfflineHotspots();
    if (offlineHotspots.length > 0) {
      return offlineHotspots;
    }

    throw new HotspotsApiError(
      HotspotsApiErrorCode.NO_INTERNET,
      "Geen internet en geen cache.",
      { fallbackSources: ["cache", "backup-json"] }
    );
  }
}
