import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Compass from "../components/Compass";
import HotspotList from "../components/HotspotList";
import { EmptyState, ErrorState, LoadingState } from "../components/ScreenState";
import { useHotspotData } from "../context/HotspotDataContext";
import { useSettings } from "../context/SettingsContext";
import { createScreenStyles } from "../styles/theme";

export default function HotspotsListScreen({
  navigation,
  hotspots,
  isLoading,
  errorMessage,
  onRetry,
  isGettingLocation,
  locationErrorMessage,
  heading,
}) {
  const { layoutMode } = useSettings();
  const { isFavorite } = useHotspotData();
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const screenStyles = useMemo(() => createScreenStyles(layoutMode), [layoutMode]);

  const visibleHotspots = useMemo(() => {
    if (!showFavoritesOnly) {
      return hotspots;
    }
    return hotspots.filter((hotspot) => isFavorite(hotspot.id));
  }, [hotspots, showFavoritesOnly, isFavorite]);

  const handleSelectHotspot = (hotspot) => {
    navigation.navigate("Kaart", {
      hotspotId: hotspot.id,
      hotspotName: hotspot.name,
    });
  };

  return (
    <SafeAreaView style={screenStyles.safeArea} edges={["bottom"]}>
      <View style={screenStyles.container}>
        <Text style={screenStyles.title}>Shooting ranges in Nederland</Text>
        <Text style={screenStyles.subtitle}>Selecteer een hotspot om op de kaart in te zoomen.</Text>

        <Compass heading={heading} />

        {isGettingLocation ? <Text style={screenStyles.infoText}>Huidige locatie wordt opgehaald...</Text> : null}
        {!isGettingLocation && locationErrorMessage ? (
          <Text style={screenStyles.warningText}>{locationErrorMessage}</Text>
        ) : null}

        {!isLoading && !errorMessage && hotspots.length > 0 ? (
          <View style={styles.toolbar}>
            <Pressable style={screenStyles.primaryButton} onPress={() => navigation.navigate("Kaart")}>
              <Text style={screenStyles.primaryButtonText}>Open kaart met alle hotspots</Text>
            </Pressable>
            <Pressable
              style={[styles.filterButton, showFavoritesOnly ? styles.filterButtonActive : null]}
              onPress={() => setShowFavoritesOnly((current) => !current)}
            >
              <Text style={[styles.filterButtonText, showFavoritesOnly ? styles.filterButtonTextActive : null]}>
                {showFavoritesOnly ? "Toon alle" : "Alleen favorieten"}
              </Text>
            </Pressable>
          </View>
        ) : null}

        {isLoading ? <LoadingState /> : null}

        {!isLoading && errorMessage ? <ErrorState message={errorMessage} onRetry={onRetry} /> : null}

        {!isLoading && !errorMessage && hotspots.length === 0 ? <EmptyState /> : null}

        {!isLoading && !errorMessage && hotspots.length > 0 && visibleHotspots.length === 0 ? (
          <View style={styles.emptyFavorites}>
            <Text style={screenStyles.subtitle}>Je hebt nog geen favorieten. Markeer hotspots met de ster.</Text>
          </View>
        ) : null}

        {!isLoading && !errorMessage && visibleHotspots.length > 0 ? (
          <HotspotList hotspots={visibleHotspots} onSelectHotspot={handleSelectHotspot} />
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  toolbar: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    alignItems: "center",
  },
  filterButton: {
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#d8e0e8",
    backgroundColor: "#ffffff",
  },
  filterButtonActive: {
    borderColor: "#e8a317",
    backgroundColor: "#fff8e8",
  },
  filterButtonText: {
    fontWeight: "600",
    color: "#40556b",
  },
  filterButtonTextActive: {
    color: "#b07d00",
  },
  emptyFavorites: {
    padding: 16,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#d8e0e8",
  },
});
