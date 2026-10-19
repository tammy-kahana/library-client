import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createBook } from '../api/books';
import { getCategories } from '../api/categories';
import ErrorMessage from '../components/ErrorMessage';
import { useApi } from '../hooks/useApi';

const EMPTY_FORM = { title: '', author: '', isbn: '', publishedYear: '' };

/** לספרנית ולמנהלת. אחרי היצירה עוברים לדף הספר, ושם מוסיפים עותקים. */
export default function AddBookPage() {
  const navigate = useNavigate();
  const categories = useApi(getCategories, []);
  const [form, setForm] = useState(EMPTY_FORM);
  const [categoryIds, setCategoryIds] = useState([]);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field) => (event) => setForm({ ...form, [field]: event.target.value });

  const toggleCategory = (id) =>
    setCategoryIds((current) => (current.includes(id) ? current.filter((c) => c !== id) : [...current, id]));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const book = await createBook({ ...form, publishedYear: Number(form.publishedYear), categoryIds });
      navigate(`/books/${book.id}`, { state: { message: 'הספר נוסף. עכשיו אפשר להוסיף לו עותקים.' } });
    } catch (err) {
      setError(err);
      setIsSubmitting(false);
    }
  };

  return (
    <section className="card form-card">
      <h1>הוספת ספר</h1>

      {/* אותם כללים כמו ב-BookRequest בשרת. השרת בודק שוב בכל מקרה */}
      <form onSubmit={handleSubmit} className="form">
        <label>
          שם הספר
          <input value={form.title} onChange={updateField('title')} required maxLength={200} />
        </label>
        <label>
          מחבר
          <input value={form.author} onChange={updateField('author')} required maxLength={150} />
        </label>
        <div className="form-row">
          <label>
            ISBN
            <input value={form.isbn} onChange={updateField('isbn')} required maxLength={20} dir="ltr" />
          </label>
          <label>
            שנת הוצאה
            <input type="number" value={form.publishedYear} onChange={updateField('publishedYear')} required min={1000} max={2100} />
          </label>
        </div>

        <fieldset className="category-picker">
          <legend>קטגוריות</legend>
          {categories.data?.map((category) => (
            <label key={category.id} className={`chip-option ${categoryIds.includes(category.id) ? 'selected' : ''}`}>
              <input
                type="checkbox"
                checked={categoryIds.includes(category.id)}
                onChange={() => toggleCategory(category.id)}
              />
              {category.name}
            </label>
          ))}
        </fieldset>

        <ErrorMessage error={error} />

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'שומרת...' : 'הוספת הספר'}
        </button>
      </form>
    </section>
  );
}
