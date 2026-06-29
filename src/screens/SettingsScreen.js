import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSettings } from "../context/SettingsContext";
import { colors, layoutModeLabels, layoutModes } from "../styles/theme";

export default function SettingsScreen() {
  const { layoutMode, setLayoutMode } = useSettings();

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <View style={styles.container}>
      <Text style={styles.title}>Instellingen</Text>
      <Text style={styles.subtitle}>
        Kies een layoutmodus. De wijziging wordt direct toegepast op alle schermen en blijft bewaard na herstart.
      </Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Layoutmodus</Text>
        {Object.values(layoutModes).map((mode) => {
          const isSelected = layoutMode === mode;

          return (
            <Pressable
              key={mode}
              onPress={() => setLayoutMode(mode)}
              style={[styles.option, isSelected ? styles.optionSelected : null]}
            >
              <View style={styles.optionContent}>
                <Text style={[styles.optionTitle, isSelected ? styles.optionTitleSelected : null]}>
                  {layoutModeLabels[mode]}
                </Text>
                <Text style={styles.optionDescription}>{getModeDescription(mode)}</Text>
              </View>
              {isSelected ? <Text style={styles.checkmark}>✓</Text> : null}
            </Pressable>
          );
        })}
      </View>

      <View style={styles.previewBox}>
        <Text style={styles.previewTitle}>Voorbeeld ({layoutModeLabels[layoutMode]})</Text>
        <View style={[styles.previewCard, getPreviewCardStyle(layoutMode)]}>
          <Text style={[styles.previewName, getPreviewNameStyle(layoutMode)]}>Voorbeeld hotspot</Text>
          <Text style={styles.previewBody} numberOfLines={layoutMode === layoutModes.COMPACT ? 1 : 2}>
            Zo ziet een kaart eruit in de gekozen layoutmodus.
          </Text>
        </View>
      </View>
      </View>
    </SafeAreaView>
  );
}

function getModeDescription(mode) {
  switch (mode) {
    case layoutModes.COMPACT:
      return "Meer hotspots tegelijk zichtbaar met compacte kaarten.";
    case layoutModes.DETAILED:
      return "Ruimere kaarten met extra details en notities.";
    case layoutModes.COMFORTABLE:
    default:
      return "Gebalanceerde weergave met goede leesbaarheid.";
  }
}

function getPreviewCardStyle(mode) {
  switch (mode) {
    case layoutModes.COMPACT:
      return { padding: 10, gap: 4 };
    case layoutModes.DETAILED:
      return { padding: 18, gap: 8 };
    default:
      return { padding: 14, gap: 6 };
  }
}

function getPreviewNameStyle(mode) {
  switch (mode) {
    case layoutModes.COMPACT:
      return { fontSize: 15 };
    case layoutModes.DETAILED:
      return { fontSize: 19 };
    default:
      return { fontSize: 17 };
  }
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: colors.text,
  },
  subtitle: {
    color: colors.textSecondary,
    lineHeight: 20,
  },
  section: {
    gap: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 14,
    gap: 12,
  },
  optionSelected: {
    borderColor: colors.primary,
    backgroundColor: "#e8f2fb",
  },
  optionContent: {
    flex: 1,
    gap: 4,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
  },
  optionTitleSelected: {
    color: colors.primary,
  },
  optionDescription: {
    color: colors.textSecondary,
    lineHeight: 18,
    fontSize: 13,
  },
  checkmark: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.primary,
  },
  previewBox: {
    gap: 10,
    marginTop: 8,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
  },
  previewCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
  },
  previewName: {
    fontWeight: "700",
    color: colors.text,
  },
  previewBody: {
    color: colors.textSecondary,
    lineHeight: 18,
  },
});
