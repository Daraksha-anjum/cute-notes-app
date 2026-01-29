import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { addNoteApi, deleteNoteApi, getNotes, Note } from '../api';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 60) / 2;

export default function HomeScreen() {
  const [noteText, setNoteText] = useState('');
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);

  // 🌸 subtle animation
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadNotes();

    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -6,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const loadNotes = async () => {
    const data = await getNotes();
    setNotes(data);
    setLoading(false);
  };

  const addOrEditNote = async () => {
    if (noteText.trim() === '') return;

    if (editingId !== null) {
      setNotes(
        notes.map((n) =>
          n.id === editingId ? { ...n, text: noteText } : n
        )
      );
      setEditingId(null);
      setNoteText('');
    } else {
      const newNote = await addNoteApi(noteText);
      setNotes([newNote, ...notes]);
      setNoteText('');
    }
  };

  const startEdit = (note: Note) => {
    setEditingId(note.id);
    setNoteText(note.text);
  };

  const deleteNote = async (id: number) => {
    await deleteNoteApi(id);
    setNotes(notes.filter((n) => n.id !== id));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🌸 Cute Notes 🌸</Text>

      <TextInput
        style={styles.input}
        placeholder="Write a cute note..."
        value={noteText}
        onChangeText={setNoteText}
      />

      <TouchableOpacity style={styles.button} onPress={addOrEditNote}>
        <Text style={styles.buttonText}>
          {editingId ? 'Update Note ✨' : 'Add Note'}
        </Text>
      </TouchableOpacity>

      {loading ? (
        <Text style={styles.infoText}>Loading notes...</Text>
      ) : (
        <FlatList
          key="grid"
          data={notes}
          numColumns={2}
          keyExtractor={(item) => item.id.toString()}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          renderItem={({ item }) => (
            <View style={styles.noteCard}>
              {/* 🌸 floating flower */}
              <Animated.Text
                style={[
                  styles.flower,
                  { transform: [{ translateY: floatAnim }] },
                ]}
              >
                🌸
              </Animated.Text>

              {/* note text */}
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: '/detail',
                    params: { text: item.text },
                  })
                }
              >
                <Text style={styles.noteText}>{item.text}</Text>
              </TouchableOpacity>

              {/* actions */}
              <View style={styles.actions}>
                <TouchableOpacity onPress={() => startEdit(item)}>
                  <Text style={styles.actionIcon}>✏️</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteNote(item.id)}>
                  <Text style={styles.actionIcon}>🗑️</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5FA',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FF4F9A',
    textAlign: 'center',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#ffffff',
    padding: 14,
    borderRadius: 14,
    borderColor: '#FFD1E8',
    borderWidth: 1.5,
    marginBottom: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#FF4F9A',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 16,
  },
  infoText: {
    textAlign: 'center',
    color: '#777',
    marginTop: 20,
  },

  // 💖 GRID CARD (dynamic height)
  noteCard: {
    width: CARD_WIDTH,
    backgroundColor: '#ffffff',
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#FFD1E8',
    padding: 14,
    marginBottom: 16,
    shadowColor: '#FF4F9A',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  noteText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 10,
  },

  flower: {
    position: 'absolute',
    top: -10,
    right: -8,
    fontSize: 18,
  },

  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  actionIcon: {
    fontSize: 18,
  },
});
