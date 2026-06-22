import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import HotspotsListScreen from "./src/screens/HotspotsListScreen";
import MapScreen from "./src/screens/MapScreen";
import { fetchHotspots } from "./src/services/hotspotsApi";
import { getCurrentUserLocation } from "./src/services/locationService";

const Stack = createStackNavigator();

export default function App() {
  const [hotspots, setHotspots] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [userLocation, setUserLocation] = useState(null);
  const [isGettingLocation, setIsGettingLocation] = useState(true);
  const [locationErrorMessage, setLocationErrorMessage] = useState("");

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

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Lijst"
          screenOptions={{
            headerStyle: {
              backgroundColor: "#eef4f9",
            },
            headerTintColor: "#0f2f4d",
            headerTitleStyle: {
              fontWeight: "700",
            },
            cardStyle: {
              backgroundColor: "#eef4f9",
            },
          }}
        >
          <Stack.Screen name="Lijst" options={{ title: "Hotspots" }}>
            {(screenProps) => (
              <HotspotsListScreen
                {...screenProps}
                hotspots={hotspots}
                isLoading={isLoading}
                errorMessage={errorMessage}
                onRetry={loadHotspots}
                isGettingLocation={isGettingLocation}
                locationErrorMessage={locationErrorMessage}
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
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
