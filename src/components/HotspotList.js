import { FlatList, StyleSheet, View } from "react-native";
import HotspotCard from "./HotspotCard";

export default function HotspotList({ hotspots, onSelectHotspot }) {
  return (
    <FlatList
      style={styles.list}
      data={hotspots}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <HotspotCard
          hotspot={item}
          onPress={onSelectHotspot ? () => onSelectHotspot(item) : undefined}
        />
      )}
      contentContainerStyle={styles.content}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  content: {
    paddingBottom: 24,
  },
  separator: {
    height: 12,
  },
});
