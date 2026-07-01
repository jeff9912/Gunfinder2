import { StatusBar } from "expo-status-bar";
import * as Location from "expo-location";
import { useCallback, useEffect, useState } from "react";
import { Pressable, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { HotspotDataProvider } from "./src/context/HotspotDataContext";
import { SettingsProvider } from "./src/context/SettingsContext";
import HotspotsListScreen from "./src/screens/HotspotsListScreen";
import MapScreen from "./src/screens/MapScreen";
import SettingsScreen from "./src/screens/SettingsScreen";
import { fetchHotspots } from "./src/services/hotspotsApi";
import { loadHotspotsCache } from "./src/services/storageService";
import { getCurrentUserLocation } from "./src/services/locationService";
import { colors } from "./src/styles/theme";

const Stack = createStackNavigator();

function AppNavigator() {
  const [hotspots, setHotspots] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [userLocation, setUserLocation] = useState(null);
  const [heading, setHeading] = useState(0);
  const [isGettingLocation, setIsGettingLocation] = useState(true);
  const [locationErrorMessage, setLocationErrorMessage] = useState("");

  const loadHotspots = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");

    const cachedHotspots = await loadHotspotsCache();
    const hasCachedHotspots = Array.isArray(cachedHotspots) && cachedHotspots.length > 0;

    if (hasCachedHotspots) {
      setHotspots(cachedHotspots);
      setIsLoading(false);
    }

    try {
      const data = await fetchHotspots();
      setHotspots(data);
    } catch (error) {
      if (hasCachedHotspots) {
        return;
      }

      setErrorMessage(error.message ?? "Onbekende fout bij het ophalen van hotspots.");
    } finally {
      if (!hasCachedHotspots) {
        setIsLoading(false);
      }
    }
  }, []);

  const loadUserLocation = useCallback(async () => {
    setIsGettingLocation(true);
    setLocationErrorMessage("");

    try {
      const currentLocation = await getCurrentUserLocation();
      setUserLocation(currentLocation);
    } catch (error) {
      setLocationErrorMessage(error.message ?? "Kon huidige locatie niet ophalen.");
    } finally {
      setIsGettingLocation(false);
    }
  }, []);

  useEffect(() => {
    loadHotspots();
  }, [loadHotspots]);

  useEffect(() => {
    loadUserLocation();
  }, [loadUserLocation]);

  useEffect(() => {
    let subscription = null;

    async function startHeadingUpdates() {
      try {
        subscription = await Location.watchHeadingAsync((value) => {
          const nextHeading = value.trueHeading >= 0 ? value.trueHeading : value.magHeading ?? 0;
          setHeading(Math.round(nextHeading));
        });
      } catch {
        setHeading(0);
      }
    }

    startHeadingUpdates();

    return () => {
      subscription?.remove?.();
    };
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Lijst"
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
          headerTitleStyle: {
            fontWeight: "700",
          },
          cardStyle: {
            backgroundColor: colors.background,
          },
        }}
      >
        <Stack.Screen
          name="Lijst"
          options={({ navigation }) => ({
            title: "Hotspots",
            headerRight: () => (
              <Pressable onPress={() => navigation.navigate("Instellingen")} style={{ marginRight: 16 }}>
                <Text style={{ color: colors.primary, fontWeight: "700" }}>Instellingen</Text>
              </Pressable>
            ),
          })}
        >
          {(screenProps) => (
            <HotspotsListScreen
              {...screenProps}
              hotspots={hotspots}
              isLoading={isLoading}
              errorMessage={errorMessage}
              onRetry={loadHotspots}
              isGettingLocation={isGettingLocation}
              locationErrorMessage={locationErrorMessage}
              heading={heading}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="Kaart" options={{ title: "Kaart" }}>
          {(screenProps) => (
            <MapScreen
              {...screenProps}
              hotspots={hotspots}
              userLocation={userLocation}
              isLoading={isLoading}
              errorMessage={errorMessage}
              onRetry={loadHotspots}
              isGettingLocation={isGettingLocation}
              locationErrorMessage={locationErrorMessage}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="Instellingen" options={{ title: "Instellingen" }}>
          {() => <SettingsScreen />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <SettingsProvider>
        <HotspotDataProvider>
          <StatusBar style="dark" />
          <AppNavigator />
        </HotspotDataProvider>
      </SettingsProvider>
    </SafeAreaProvider>
  );
}
