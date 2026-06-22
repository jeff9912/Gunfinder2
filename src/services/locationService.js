import * as Location from "expo-location";

export async function getCurrentUserLocation() {
  const { status } = await Location.requestForegroundPermissionsAsync();

  if (status !== "granted") {
    throw new Error("Locatie-toestemming is niet gegeven.");
  }

  const currentPosition = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });

  return {
    lat: currentPosition.coords.latitude,
    lon: currentPosition.coords.longitude,
  };
}
