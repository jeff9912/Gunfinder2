import { Pressable, StyleSheet, Text, View } from "react-native";
import { useHotspotData } from "../context/HotspotDataContext";
import { useSettings } from "../context/SettingsContext";
import { colors, getLayoutStyles, layoutModes } from "../styles/theme";
import FavoriteButton from "./FavoriteButton";
import LikeButton from "./LikeButton";
import NoteEditor from "./NoteEditor";

export default function HotspotCard({ hotspot, onPress }) {
  const { layoutMode } = useSettings();
  const { isFavorite, isLiked, getNote, toggleFavorite, toggleLike, setNote } = useHotspotData();
  const layout = getLayoutStyles(layoutMode);
  const isInteractive = typeof onPress === "function";
  const isCompact = layoutMode === layoutModes.COMPACT;
  const isDetailed = layoutMode === layoutModes.DETAILED;

  const favorite = isFavorite(hotspot.id);
  const liked = isLiked(hotspot.id);
  const note = getNote(hotspot.id);

  return (
    <Pressable
      onPress={onPress}
      disabled={!isInteractive}
      style={({ pressed }) => [
        styles.card,
        { padding: layout.cardPadding, gap: layout.cardGap },
        isInteractive ? styles.cardInteractive : null,
        pressed && isInteractive ? styles.cardPressed : null,
        favorite ? styles.cardFavorite : null,
      ]}
    >
      <View style={styles.headerRow}>
        <Text style={[styles.name, { fontSize: layout.cardTitleSize }]} numberOfLines={isCompact ? 1 : 2}>
          {hotspot.name}
        </Text>
        <View style={styles.actionRow}>
          <FavoriteButton
            isActive={favorite}
            onPress={() => toggleFavorite(hotspot.id)}
            compact={isCompact}
          />
          <LikeButton isActive={liked} onPress={() => toggleLike(hotspot.id)} compact={isCompact} />
        </View>
      </View>

      {layout.showFullDescription ? (
        <Text style={[styles.description, { fontSize: layout.bodySize }]} numberOfLines={isCompact ? 2 : undefined}>
          {hotspot.description}
        </Text>
      ) : (
        <Text style={[styles.description, { fontSize: layout.bodySize }]} numberOfLines={1}>
          {hotspot.description}
        </Text>
      )}

      <View style={styles.metaRow}>
        <Text style={[styles.metaText, { fontSize: layout.bodySize - 1 }]}>Plaats: {hotspot.city}</Text>
        <Text style={[styles.metaText, { fontSize: layout.bodySize - 1 }]}>Sport: {hotspot.sport}</Text>
      </View>

      {isDetailed || note ? (
        <NoteEditor note={note} onSave={(text) => setNote(hotspot.id, text)} compact={isCompact} />
      ) : null}

      {isInteractive ? <Text style={styles.tapHint}>Tik om op kaart te tonen</Text> : null}

      {layout.showCoords ? (
        <Text style={styles.coords}>
          Coords: {hotspot.lat.toFixed(5)}, {hotspot.lon.toFixed(5)}
        </Text>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
  },
  cardInteractive: {
    shadowColor: "#4f657a",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 2,
  },
  cardPressed: {
    transform: [{ scale: 0.99 }],
    opacity: 0.95,
  },
  cardFavorite: {
    borderColor: colors.favorite,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 8,
  },
  name: {
    flex: 1,
    fontWeight: "700",
    color: colors.text,
  },
  actionRow: {
    flexDirection: "row",
    gap: 6,
  },
  description: {
    color: colors.textSecondary,
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
  tapHint: {
    color: colors.primary,
    fontWeight: "600",
    fontSize: 13,
  },
  coords: {
    color: colors.textMuted,
    fontSize: 12,
  },
});
