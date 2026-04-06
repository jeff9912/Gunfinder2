import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import HotspotList from "./src/components/HotspotList";
import { EmptyState, ErrorState, LoadingState } from "./src/components/ScreenState";
import { fetchHotspots } from "./src/services/hotspotsApi";

export default function App() {
  const [hotspots, setHotspots] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const loadHotspots = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const data = await fetchHotspots();
      setHotspots(data);
    } catch (error) {
      setErrorMessage(error.message ?? "Onbekende fout bij het ophalen van hotspots.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHotspots();
  }, [loadHotspots]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.container}>
        <Text style={styles.title}>Hotspots in Nederland</Text>
        <Text style={styles.subtitle}>Shooting locaties uit een online JSON-bron (Overpass API)</Text>

        {isLoading ? <LoadingState /> : null}

        {!isLoading && errorMessage ? (
          <ErrorState message={errorMessage} onRetry={loadHotspots} />
        ) : null}

        {!isLoading && !errorMessage && hotspots.length === 0 ? <EmptyState /> : null}

        {!isLoading && !errorMessage && hotspots.length > 0 ? (
          <HotspotList hotspots={hotspots} />
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
    fontSize: 14,
    color: "#40556b",
  },
});
