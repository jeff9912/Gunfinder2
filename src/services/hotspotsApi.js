const OVERPASS_API_URL =
  "https://overpass-api.de/api/interpreter?data=%5Bout%3Ajson%5D%5Btimeout%3A60%5D%3B%0Aarea%5B%22name%22%3D%22Nederland%22%5D-%3E.searchArea%3B%0A%0A%28%0A%20%20nwr%5B%22sport%22%3D%22shooting%22%5D%28area.searchArea%29%3B%0A%20%20nwr%5B%22amenity%22%3D%22shooting_range%22%5D%28area.searchArea%29%3B%0A%29%3B%0A%0Aout%20center%3B";

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

export async function fetchHotspots() {
  const response = await fetch(OVERPASS_API_URL, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Kon hotspots niet ophalen van de server.");
  }

  const json = await response.json();
  const elements = Array.isArray(json.elements) ? json.elements : [];

  return elements
    .map(mapElementToHotspot)
    .filter((hotspot) => hotspot.lat !== null && hotspot.lon !== null);
}
