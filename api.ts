export type Note = {
  id: number;
  text: string;
};

let notesData: Note[] = [
  { id: 1, text: 'Welcome to Cute Notes 🌸' },
  { id: 2, text: 'This note came from API ✨' },
];

// GET NOTES
export function getNotes(): Promise<Note[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Ensure intro note always exists
      const hasIntro = notesData.some(
        (n) => n.id === 3
      );

      if (!hasIntro) {
        notesData.unshift({
          id: 3,
          text: '🌱 This project reflects my enthusiasm for learning and building real products. While keeping the app simple and clean, I focused on understanding concepts like UI design, state management, API-based data flow, and navigation. I see this as a strong starting point, and I am highly motivated to grow further and build more complex features when given the opportunity.',
        });
      }

      resolve(notesData);
    }, 300);
  });
}


// ADD NOTE
export function addNoteApi(text: string): Promise<Note> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newNote: Note = {
        id: Date.now(),
        text,
      };
      notesData = [newNote, ...notesData];
      resolve(newNote);
    }, 300);
  });
}

// DELETE NOTE
export function deleteNoteApi(id: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      notesData = notesData.filter((note) => note.id !== id);
      resolve();
    }, 300);
  });
}
