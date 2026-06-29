import { FlatList, StyleSheet, View } from "react-native";
import { useSettings } from "../context/SettingsContext";
import { getLayoutStyles } from "../styles/theme";
import HotspotCard from "./HotspotCard";

export default function HotspotList({ hotspots, onSelectHotspot }) {
  const { layoutMode } = useSettings();
  const layout = getLayoutStyles(layoutMode);

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
      ItemSeparatorComponent={() => <View style={{ height: layout.listSeparator }} />}
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
});
