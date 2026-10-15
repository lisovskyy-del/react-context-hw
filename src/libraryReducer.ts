import type {Book, LibraryAction} from './types'

export const initialBooks: Book[] = [
  { id: 1, title: 'Кобзар', author: 'Тарас Шевченко', genre: 'Поезія', year: 1840, pages: 228, isIssued: false },
  { id: 2, title: 'Тигролови', author: 'Іван Багряний', genre: 'Роман', year: 1944, pages: 320, isIssued: false },
  { id: 3, title: 'Місто', author: 'Валер\'ян Підмогильний', genre: 'Роман', year: 1928, pages: 290, isIssued: true },
]

export function libraryReducer(state: Book[], action: LibraryAction): Book[] {
  switch (action.type) {
    case "ADD_BOOK":
      return [
        ...state,
        {
          ...action.payload,
          id: Date.now(),
          isIssued: false,
        },
      ]

    case "DELETE_BOOK":
      return state.filter((book) => book.id !== action.payload)

    case "UPDATE_BOOK":
      return state.map((book) => (book.id === action.payload.id ? action.payload : book))

    case "TOGGLE_ISSUE_STATUS":
      return state.map((book) =>
        book.id === action.payload ? { ...book, isIssued: !book.isIssued } : book
      )

    default:
      return state
  }
}