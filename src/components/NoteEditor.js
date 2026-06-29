import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { colors } from "../styles/theme";

export default function NoteEditor({ note, onSave, compact = false }) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(note);

  const handleOpen = () => {
    setDraft(note);
    setIsEditing(true);
  };

  const handleSave = () => {
    onSave(draft);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setDraft(note);
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <View style={styles.container}>
        {note ? (
          <Text style={[styles.noteText, compact ? styles.noteTextCompact : null]} numberOfLines={compact ? 2 : undefined}>
            Notitie: {note}
          </Text>
        ) : (
          <Text style={styles.placeholder}>Geen persoonlijke notitie</Text>
        )}
        <Pressable style={styles.editButton} onPress={handleOpen}>
          <Text style={styles.editButtonText}>{note ? "Bewerk notitie" : "Notitie toevoegen"}</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={draft}
        onChangeText={setDraft}
        placeholder="Schrijf een persoonlijke notitie..."
        placeholderTextColor={colors.textMuted}
        multiline
        autoFocus
      />
      <View style={styles.actions}>
        <Pressable style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.cancelButtonText}>Annuleer</Text>
        </Pressable>
        <Pressable style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Opslaan</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  noteText: {
    color: colors.text,
    lineHeight: 20,
    fontStyle: "italic",
    backgroundColor: "#f4f8fc",
    padding: 8,
    borderRadius: 8,
  },
  noteTextCompact: {
    fontSize: 12,
  },
  placeholder: {
    color: colors.textMuted,
    fontSize: 13,
  },
  editButton: {
    alignSelf: "flex-start",
  },
  editButtonText: {
    color: colors.primary,
    fontWeight: "600",
    fontSize: 13,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 10,
    minHeight: 72,
    textAlignVertical: "top",
    color: colors.text,
    backgroundColor: colors.surface,
  },
  actions: {
    flexDirection: "row",
    gap: 8,
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cancelButtonText: {
    color: colors.textSecondary,
    fontWeight: "600",
  },
  saveButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: colors.primary,
  },
  saveButtonText: {
    color: colors.surface,
    fontWeight: "600",
  },
});
