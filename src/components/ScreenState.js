import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../styles/theme";

export function LoadingState() {
  return (
    <View style={styles.box}>
      <Text style={styles.title}>Hotspots laden...</Text>
      <Text style={styles.subtitle}>Even geduld, data wordt opgehaald uit de online bron.</Text>
    </View>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <View style={styles.box}>
      <Text style={styles.title}>Ophalen mislukt</Text>
      <Text style={styles.subtitle}>{message}</Text>
      <Pressable style={styles.retryButton} onPress={onRetry}>
        <Text style={styles.retryButtonText}>Probeer opnieuw</Text>
      </Pressable>
    </View>
  );
}

export function EmptyState() {
  return (
    <View style={styles.box}>
      <Text style={styles.title}>Geen hotspots gevonden</Text>
      <Text style={styles.subtitle}>De API gaf op dit moment geen resultaten terug.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    width: "100%",
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
  },
  subtitle: {
    color: colors.textSecondary,
    lineHeight: 20,
  },
  retryButton: {
    marginTop: 8,
    alignSelf: "flex-start",
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  retryButtonText: {
    color: colors.surface,
    fontWeight: "600",
  },
});
