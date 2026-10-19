import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getBooks } from '../api/books';
import { getCategories } from '../api/categories';
import BookCard from '../components/BookCard';
import ErrorMessage from '../components/ErrorMessage';
import Loading from '../components/Loading';
import Pagination from '../components/Pagination';
import { useApi } from '../hooks/useApi';

const PAGE_SIZE = 12;

// כל אפשרות מיון = sortBy + כיוון, כפי שהשרת מצפה (BookQuery)
const SORT_OPTIONS = {
  title: { label: 'לפי שם', sortBy: 'Title', desc: false },
  author: { label: 'לפי מחבר', sortBy: 'Author', desc: false },
  newest: { label: 'החדשים קודם', sortBy: 'PublishedYear', desc: true },
};

export default function BooksPage() {
  // החיפוש, הסינון והעמוד נשמרים בכתובת: כפתור "אחורה" בדפדפן מחזיר לאותה רשימה
  const [params, setParams] = useSearchParams();
  const page = Number(params.get('page') ?? 1);
  const search = params.get('search') ?? '';
  const categoryId = params.get('categoryId') ?? '';
  const sortKey = params.get('sort') ?? 'title';
  const [searchInput, setSearchInput] = useState(search);

  const categories = useApi(getCategories, []);
  const books = useApi(() => {
    const sort = SORT_OPTIONS[sortKey] ?? SORT_OPTIONS.title;
    return getBooks({ page, pageSize: PAGE_SIZE, search, categoryId, sortBy: sort.sortBy, desc: sort.desc });
  }, [params.toString()]);

  /** שינוי בסינון מחזיר לעמוד 1. ערך ריק מסיר את הפרמטר מהכתובת. */
  const updateParams = (changes) => {
    const next = new URLSearchParams(params);
    Object.entries({ page: '', ...changes }).forEach(([key, value]) => (value ? next.set(key, value) : next.delete(key)));
    setParams(next);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    updateParams({ search: searchInput.trim() });
  };

  return (
    <>
      <section className="hero">
        <h1>מה נקרא היום?</h1>
        <p>ספרי קריאה וספרי ילדים להשאלה. בחרי ספר, ובדקי אם יש עותק פנוי.</p>

        <form className="filters" onSubmit={handleSearch}>
          <input
            type="search"
            placeholder="חיפוש לפי שם ספר או מחבר"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            aria-label="חיפוש"
          />
          <select value={categoryId} onChange={(e) => updateParams({ categoryId: e.target.value })} aria-label="קטגוריה">
            <option value="">כל הקטגוריות</option>
            {categories.data?.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <select value={sortKey} onChange={(e) => updateParams({ sort: e.target.value })} aria-label="מיון">
            {Object.entries(SORT_OPTIONS).map(([key, option]) => (
              <option key={key} value={key}>
                {option.label}
              </option>
            ))}
          </select>
          <button type="submit">חיפוש</button>
        </form>
      </section>

      <ErrorMessage error={books.error} />
      {books.isLoading && !books.data && <Loading />}

      {books.data && (
        <>
          <p className="results-count">
            {books.data.totalCount === 0 ? 'לא נמצאו ספרים. נסי חיפוש אחר.' : `נמצאו ${books.data.totalCount} ספרים`}
          </p>

          <div className="book-grid">
            {books.data.items.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>

          <Pagination
            page={books.data.page}
            totalPages={books.data.totalPages}
            onChange={(newPage) => updateParams({ page: String(newPage) })}
          />
        </>
      )}
    </>
  );
}
