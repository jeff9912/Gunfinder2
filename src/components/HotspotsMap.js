import { useEffect, useMemo, useRef } from "react";
import { StyleSheet, View } from "react-native";
import MapView, { Marker } from "react-native-maps";

const DEFAULT_NL_REGION = {
  latitude: 52.1326,
  longitude: 5.2913,
  latitudeDelta: 2.2,
  longitudeDelta: 2.2,
};

function buildInitialRegion(hotspots, userLocation, selectedHotspot) {
  if (selectedHotspot) {
    return {
      latitude: selectedHotspot.lat,
      longitude: selectedHotspot.lon,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    };
  }

  if (userLocation) {
    return {
      latitude: userLocation.lat,
      longitude: userLocation.lon,
      latitudeDelta: 0.25,
      longitudeDelta: 0.25,
    };
  }

  if (hotspots.length > 0) {
    return {
      latitude: hotspots[0].lat,
      longitude: hotspots[0].lon,
      latitudeDelta: 0.4,
      longitudeDelta: 0.4,
    };
  }

  return DEFAULT_NL_REGION;
}

export default function HotspotsMap({ hotspots, userLocation, selectedHotspotId = null, fullHeight = false }) {
  const mapRef = useRef(null);

  const selectedHotspot = useMemo(
    () => hotspots.find((hotspot) => hotspot.id === selectedHotspotId) ?? null,
    [hotspots, selectedHotspotId],
  );

  const initialRegion = useMemo(
    () => buildInitialRegion(hotspots, userLocation, selectedHotspot),
    [hotspots, userLocation, selectedHotspot],
  );

  useEffect(() => {
    if (!selectedHotspot || !mapRef.current) {
      return;
    }

    mapRef.current.animateToRegion(
      {
        latitude: selectedHotspot.lat,
        longitude: selectedHotspot.lon,
        latitudeDelta: 0.035,
        longitudeDelta: 0.035,
      },
      700,
    );
  }, [selectedHotspot]);

  return (
    <View style={[styles.wrapper, fullHeight ? styles.wrapperFullHeight : null]}>
      <MapView ref={mapRef} style={styles.map} initialRegion={initialRegion}>
        {userLocation ? (
          <Marker
            coordinate={{ latitude: userLocation.lat, longitude: userLocation.lon }}
            title="Jij bent hier"
            pinColor="#1f6fb2"
          />
        ) : null}

        {hotspots.map((hotspot) => (
          <Marker
            key={hotspot.id}
            coordinate={{ latitude: hotspot.lat, longitude: hotspot.lon }}
            title={hotspot.name}
            description={hotspot.description}
            pinColor={hotspot.id === selectedHotspotId ? "#f29d38" : "#c23a2b"}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    height: 280,
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#d8e0e8",
    backgroundColor: "#ffffff",
  },
  wrapperFullHeight: {
    flex: 1,
    height: "100%",
  },
  map: {
    width: "100%",
    height: "100%",
  },
});
