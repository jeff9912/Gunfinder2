import { useMemo } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import HotspotsMap from "../components/HotspotsMap";
import { EmptyState, ErrorState, LoadingState } from "../components/ScreenState";
import { useSettings } from "../context/SettingsContext";
import { createScreenStyles } from "../styles/theme";

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
  const { layoutMode } = useSettings();
  const screenStyles = useMemo(() => createScreenStyles(layoutMode), [layoutMode]);
  const selectedHotspotId = route.params?.hotspotId ?? null;
  const selectedHotspotName = route.params?.hotspotName ?? "";

  return (
    <SafeAreaView style={screenStyles.safeArea} edges={["bottom"]}>
      <View style={screenStyles.container}>
        <Text style={screenStyles.title}>Hotspot kaart</Text>

        {selectedHotspotId ? (
          <Text style={screenStyles.subtitle}>Ingezoomd op: {selectedHotspotName || "geselecteerde hotspot"}</Text>
        ) : (
          <Text style={screenStyles.subtitle}>Alle hotspots en jouw huidige locatie</Text>
        )}

        {isGettingLocation ? <Text style={screenStyles.infoText}>Huidige locatie wordt opgehaald...</Text> : null}
        {!isGettingLocation && locationErrorMessage ? (
          <Text style={screenStyles.warningText}>{locationErrorMessage}</Text>
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
