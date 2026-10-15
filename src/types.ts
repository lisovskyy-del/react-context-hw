export interface Book {
  id: number;
  title: string;
  author: string;
  genre: string;
  year: number;
  pages: number;
  isIssued: boolean;
}

// id, isIssued = keys to remove
export type BookFormData = Omit<Book, 'id' | 'isIssued'>;

export interface SearchQuery {
  title: string;
  author: string;
  genre: string;
  pages: string;
}

export type LibraryAction =
  | { type: 'ADD_BOOK'; payload: BookFormData }
  | { type: 'DELETE_BOOK'; payload: number }
  | { type: 'UPDATE_BOOK'; payload: Book }
  | { type: 'TOGGLE_ISSUE_STATUS'; payload: number };

export interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
}