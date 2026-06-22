import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import HotspotsMap from "../components/HotspotsMap";
import { EmptyState, ErrorState, LoadingState } from "../components/ScreenState";

export default function MapScreen({
  route,
  hotspots,
  userLocation,
  isLoading,
  errorMessage,
  onRetry,
  isGettingLocation,
  locationErrorMessage,
}) {
  const selectedHotspotId = route.params?.hotspotId ?? null;
  const selectedHotspotName = route.params?.hotspotName ?? "";

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <View style={styles.container}>
        <Text style={styles.title}>Hotspot kaart</Text>

        {selectedHotspotId ? (
          <Text style={styles.subtitle}>Ingezoomd op: {selectedHotspotName || "geselecteerde hotspot"}</Text>
        ) : (
          <Text style={styles.subtitle}>Alle hotspots en jouw huidige locatie</Text>
        )}

        {isGettingLocation ? <Text style={styles.infoText}>Huidige locatie wordt opgehaald...</Text> : null}
        {!isGettingLocation && locationErrorMessage ? (
          <Text style={styles.warningText}>{locationErrorMessage}</Text>
        ) : null}

        {isLoading ? <LoadingState /> : null}
        {!isLoading && errorMessage ? <ErrorState message={errorMessage} onRetry={onRetry} /> : null}
        {!isLoading && !errorMessage && hotspots.length === 0 ? <EmptyState /> : null}

        {!isLoading && !errorMessage && hotspots.length > 0 ? (
          <HotspotsMap
            hotspots={hotspots}
            userLocation={userLocation}
            selectedHotspotId={selectedHotspotId}
            fullHeight
          />
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#eef4f9",
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    gap: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#0f2f4d",
  },
  subtitle: {
    color: "#40556b",
    lineHeight: 20,
  },
  infoText: {
    color: "#40556b",
    fontWeight: "500",
  },
  warningText: {
    color: "#b24335",
    fontWeight: "600",
  },
});
