export const colors = {
  background: "#eef4f9",
  surface: "#ffffff",
  primary: "#1f6fb2",
  text: "#0f2f4d",
  textSecondary: "#40556b",
  textMuted: "#7a8a99",
  border: "#d8e0e8",
  danger: "#b24335",
  hotspot: "#c23a2b",
  selected: "#f29d38",
  favorite: "#e8a317",
  like: "#d6456a",
};

export const layoutModes = {
  COMPACT: "compact",
  COMFORTABLE: "comfortable",
  DETAILED: "detailed",
};

export const layoutModeLabels = {
  [layoutModes.COMPACT]: "Compact",
  [layoutModes.COMFORTABLE]: "Comfortabel",
  [layoutModes.DETAILED]: "Gedetailleerd",
};

export function getLayoutStyles(layoutMode) {
  switch (layoutMode) {
    case layoutModes.COMPACT:
      return {
        screenPadding: 12,
        cardPadding: 10,
        titleSize: 22,
        cardTitleSize: 15,
        bodySize: 13,
        cardGap: 4,
        listSeparator: 8,
        showCoords: false,
        showFullDescription: false,
      };
    case layoutModes.DETAILED:
      return {
        screenPadding: 20,
        cardPadding: 18,
        titleSize: 28,
        cardTitleSize: 19,
        bodySize: 15,
        cardGap: 8,
        listSeparator: 16,
        showCoords: true,
        showFullDescription: true,
      };
    case layoutModes.COMFORTABLE:
    default:
      return {
        screenPadding: 16,
        cardPadding: 14,
        titleSize: 26,
        cardTitleSize: 17,
        bodySize: 14,
        cardGap: 6,
        listSeparator: 12,
        showCoords: true,
        showFullDescription: true,
      };
  }
}

export function createScreenStyles(layoutMode) {
  const layout = getLayoutStyles(layoutMode);

  return {
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    container: {
      flex: 1,
      paddingHorizontal: layout.screenPadding,
      paddingTop: 12,
      gap: 12,
    },
    title: {
      fontSize: layout.titleSize,
      fontWeight: "800",
      color: colors.text,
    },
    subtitle: {
      color: colors.textSecondary,
      lineHeight: 20,
      fontSize: layout.bodySize,
    },
    infoText: {
      color: colors.textSecondary,
      fontWeight: "500",
      fontSize: layout.bodySize,
    },
    warningText: {
      color: colors.danger,
      fontWeight: "600",
      fontSize: layout.bodySize,
    },
    primaryButton: {
      alignSelf: "flex-start",
      backgroundColor: colors.primary,
      borderRadius: 10,
      paddingVertical: 10,
      paddingHorizontal: 14,
    },
    primaryButtonText: {
      color: colors.surface,
      fontWeight: "700",
      fontSize: layout.bodySize,
    },
  };
}
