import { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSettings } from "../context/SettingsContext";
import { colors, createScreenStyles, getLayoutStyles, layoutModeLabels, layoutModes } from "../styles/theme";

export default function SettingsScreen() {
  const { layoutMode, setLayoutMode } = useSettings();
  const screenStyles = useMemo(() => createScreenStyles(layoutMode), [layoutMode]);
  const layout = getLayoutStyles(layoutMode);

  return (
    <SafeAreaView style={screenStyles.safeArea} edges={["bottom"]}>
      <View style={screenStyles.container}>
        <Text style={screenStyles.title}>Instellingen</Text>
        <Text style={screenStyles.subtitle}>
          Kies een layoutmodus. De wijziging wordt direct toegepast op alle schermen en blijft bewaard na herstart.
        </Text>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { fontSize: layout.bodySize + 4 }]}>Layoutmodus</Text>
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

const styles = StyleSheet.create({
  section: {
    gap: 10,
  },
  sectionTitle: {
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
});
