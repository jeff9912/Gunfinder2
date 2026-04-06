import { StyleSheet, Text, View } from "react-native";

export default function HotspotCard({ hotspot }) {
  return (
    <View style={styles.card}>
      <Text style={styles.name}>{hotspot.name}</Text>
      <Text style={styles.description}>{hotspot.description}</Text>
      <View style={styles.metaRow}>
        <Text style={styles.metaText}>Plaats: {hotspot.city}</Text>
        <Text style={styles.metaText}>Sport: {hotspot.sport}</Text>
      </View>
      <Text style={styles.coords}>
        Coords: {hotspot.lat.toFixed(5)}, {hotspot.lon.toFixed(5)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#d8e0e8",
    borderRadius: 12,
    padding: 14,
    gap: 6,
  },
  name: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0f2f4d",
  },
  description: {
    color: "#30465a",
    lineHeight: 20,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  metaText: {
    color: "#526a80",
    fontWeight: "500",
  },
  coords: {
    color: "#7a8a99",
    fontSize: 12,
  },
});
