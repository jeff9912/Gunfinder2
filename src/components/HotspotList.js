import { FlatList, StyleSheet, View } from "react-native";
import HotspotCard from "./HotspotCard";

export default function HotspotList({ hotspots }) {
  return (
    <FlatList
      data={hotspots}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <HotspotCard hotspot={item} />}
      contentContainerStyle={styles.content}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 24,
  },
  separator: {
    height: 12,
  },
});
