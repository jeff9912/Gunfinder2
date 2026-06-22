import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import HotspotList from "../components/HotspotList";
import { EmptyState, ErrorState, LoadingState } from "../components/ScreenState";

export default function HotspotsListScreen({
  navigation,
  hotspots,
  isLoading,
  errorMessage,
  onRetry,
  isGettingLocation,
  locationErrorMessage,
}) {
  const handleSelectHotspot = (hotspot) => {
    navigation.navigate("Kaart", {
      hotspotId: hotspot.id,
      hotspotName: hotspot.name,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <View style={styles.container}>
        <Text style={styles.title}>Shooting ranges in Nederland</Text>
        <Text style={styles.subtitle}>Selecteer een hotspot om op de kaart in te zoomen.</Text>

        {isGettingLocation ? <Text style={styles.infoText}>Huidige locatie wordt opgehaald...</Text> : null}
        {!isGettingLocation && locationErrorMessage ? (
          <Text style={styles.warningText}>{locationErrorMessage}</Text>
        ) : null}

        {!isLoading && !errorMessage && hotspots.length > 0 ? (
          <Pressable style={styles.mapButton} onPress={() => navigation.navigate("Kaart")}>
            <Text style={styles.mapButtonText}>Open kaart met alle hotspots</Text>
          </Pressable>
        ) : null}

        {isLoading ? <LoadingState /> : null}

        {!isLoading && errorMessage ? <ErrorState message={errorMessage} onRetry={onRetry} /> : null}

        {!isLoading && !errorMessage && hotspots.length === 0 ? <EmptyState /> : null}

        {!isLoading && !errorMessage && hotspots.length > 0 ? (
          <HotspotList hotspots={hotspots} onSelectHotspot={handleSelectHotspot} />
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
  mapButton: {
    alignSelf: "flex-start",
    backgroundColor: "#1f6fb2",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  mapButtonText: {
    color: "#ffffff",
    fontWeight: "700",
  },
});
