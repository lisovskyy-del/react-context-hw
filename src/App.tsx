import { useReducer, useState, type ChangeEvent, type FormEvent } from 'react'
import {ThemeProvider, useTheme} from './ThemeContext'
import { libraryReducer, initialBooks } from './libraryReducer'
import type {Book, BookFormData, SearchQuery} from './types'

const emptyFormData: Record<keyof BookFormData, string> = {
  title: '',
  author: '',
  genre: '',
  year: '',
  pages: '',
}

function App() {
  const [books, dispatch] = useReducer(libraryReducer, initialBooks)
  const { isDarkMode, toggleTheme } = useTheme()

  const [formData, setFormData] = useState<Record<keyof BookFormData, string>>(emptyFormData)
  const [editingId, setEditingId] = useState<number | null>(null)

  const [searchQuery, setSearchQuery] = useState<SearchQuery>({
    title: '',
    author: '',
    genre: '',
    pages: '',
  })

  const handleFormChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!formData.title || !formData.author || !formData.genre || !formData.year || !formData.pages) {
      alert("Заповніть усі поля")
      return
    }

    const parsedData: BookFormData = {
      title: formData.title,
      author: formData.author,
      genre: formData.genre,
      year: Number(formData.year),
      pages: Number(formData.pages),
    }

    if (editingId !== null) {
      dispatch({
        type: "UPDATE_BOOK",
        payload: { ...parsedData, id: editingId, isIssued: false},
      })
      setEditingId(null)
    } else {
      dispatch({ type: "ADD_BOOK", payload: parsedData })
    }

    setFormData(emptyFormData)
  }

  const handleEditClick = (book: Book) => {
    setEditingId(book.id)

    setFormData({
      title: book.title,
      author: book.author,
      genre: book.genre,
      year: String(book.year),
      pages: String(book.pages),
    })
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setFormData(emptyFormData)
  }

  const availableBooks = books.filter((book) => {
    if (book.isIssued) return false

    const matchesTitle = book.title.toLowerCase().includes(searchQuery.title.toLowerCase())
    const matchesAuthor = book.author.toLowerCase().includes(searchQuery.author.toLowerCase())
    const matchesGenre = book.genre.toLowerCase().includes(searchQuery.genre.toLowerCase())
    const matchesPages = searchQuery.pages ? book.pages <= Number(searchQuery.pages) : true

    return matchesTitle && matchesAuthor && matchesGenre && matchesPages
  })

  const issuedBooks = books.filter((book) => book.isIssued)

  return (
    <div>
      <header>
        <h1>Бібліотека</h1>
        <button onClick={toggleTheme}>
          Тема: {isDarkMode ? "Темна" : "Світла"}
        </button>
      </header>

      <hr />

      <section>
        <h2>{editingId !== null ? "Редагувати книгу" : "Додати книгу"}</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>
              Назва:{" "}
              <input name="title" value={formData.title} onChange={handleFormChange}/>
            </label>
          </div>
          <div>
            <label>
              Автор:{' '}
              <input name="author" value={formData.author} onChange={handleFormChange} />
            </label>
          </div>
          <div>
            <label>
              Жанр:{' '}
              <input name="genre" value={formData.genre} onChange={handleFormChange} />
            </label>
          </div>
          <div>
            <label>
              Рік:{' '}
              <input type="number" name="year" value={formData.year} onChange={handleFormChange} />
            </label>
          </div>
          <div>
            <label>
              Сторінок:{' '}
              <input type="number" name="pages" value={formData.pages} onChange={handleFormChange} />
            </label>
          </div>
          <br />
          <button type="submit">
            {editingId !== null ? "Зберегти" : "Додати"}
          </button>
          {editingId !== null && (
            <button type="button" onClick={handleCancelEdit}>
              Скасувати
            </button>
          )}
        </form>
      </section>

      <hr />

      <section>
        <h2>Пошук книг</h2>
        <fieldset>
          <legend>Параметри пошуку</legend>
          <div>
            <label>
              За назвою:{" "}
              <input
                value={searchQuery.title}
                onChange={(e) => setSearchQuery({ ...searchQuery, title: e.target.value})}
              />
            </label>
          </div>
          <div>
            <label>
              За автором:{" "}
              <input
                value={searchQuery.author}
                onChange={(e) => setSearchQuery({ ...searchQuery, author: e.target.value})}
              />
            </label>
          </div>
          <div>
            <label>
              За жанром:{' '}
              <input
                value={searchQuery.genre}
                onChange={(e) => setSearchQuery({ ...searchQuery, genre: e.target.value })}
              />
            </label>
          </div>
          <div>
            <label>
              Макс. сторінок:{' '}
              <input
                type="number"
                value={searchQuery.pages}
                onChange={(e) => setSearchQuery({ ...searchQuery, pages: e.target.value })}
              />
            </label>
          </div>
        </fieldset>
      </section>

      <hr />

      <section>
        <h2>Книги в наявності ({availableBooks.length})</h2>
        {availableBooks.length === 0 ? (
          <p>Немає доступних книг.</p>
        ) : (
          <ul>
            {availableBooks.map((book) => (
              <li key={book.id}>
                <strong>{book.title}</strong> — {book.author} (Жанр: {book.genre}, Рік: {book.year}, Сторінок: {book.pages})
                <br />
                <button onClick={() => dispatch({ type: 'TOGGLE_ISSUE_STATUS', payload: book.id })}>
                  Видати
                </button>
                <button onClick={() => handleEditClick(book)}>Редагувати</button>
                <button onClick={() => dispatch({ type: 'DELETE_BOOK', payload: book.id })}>
                  Видалити
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2>Видані книги ({issuedBooks.length})</h2>
        {issuedBooks.length === 0 ? (
          <p>Виданих книг немає.</p>
        ) : (
          <ul>
            {issuedBooks.map((book) => (
              <li key={book.id}>
                <del>
                  <strong>{book.title}</strong> — {book.author}
                </del>{' '}
                (Жанр: {book.genre}, Рік: {book.year}, Сторінок: {book.pages})
                <br />
                <button onClick={() => dispatch({ type: 'TOGGLE_ISSUE_STATUS', payload: book.id })}>
                  Повернути
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

export default function Root() {
  return (
    <ThemeProvider>
      <App />
    </ThemeProvider>
  )
}