import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function DetailScreen() {
  const { text } = useLocalSearchParams<{ text: string }>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📝 Note Detail</Text>
      <Text style={styles.noteText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF0F5',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FF69B4',
    marginBottom: 20,
    textAlign: 'center',
  },
  noteText: {
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
  },
});
