import { useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { getBook } from '../api/books';
import { addCopy, changeCopyStatus, getCopies } from '../api/copies';
import { borrowCopy } from '../api/loans';
import { useAuth } from '../auth/AuthContext';
import Badge from '../components/Badge';
import BookCover from '../components/BookCover';
import ErrorMessage from '../components/ErrorMessage';
import Loading from '../components/Loading';
import { useApi } from '../hooks/useApi';
import { formatDate } from '../utils/format';
import { ROLES } from '../utils/roles';

const COPY_STATUS = {
  Available: { label: 'פנוי', tone: 'success' },
  Loaned: { label: 'מושאל', tone: 'warning' },
  Lost: { label: 'לא זמין', tone: 'muted' },
};

export default function BookDetailsPage() {
  const { id } = useParams();
  const location = useLocation();
  const { hasRole } = useAuth();
  const isReader = hasRole(ROLES.Reader);
  const isStaff = hasRole(ROLES.Librarian, ROLES.Admin);

  const book = useApi(() => getBook(id), [id]);
  const copies = useApi(() => getCopies(id), [id]);

  const [busyCopyId, setBusyCopyId] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(location.state?.message ?? null);

  const refresh = () => {
    book.reload();
    copies.reload();
  };

  /**
   * פעולה על עותק (השאלה או שינוי סטטוס). 409 (העותק נתפס, מכסה, מושאל) מוצג עם ההודעה מהשרת,
   * ובכל מקרה הרשימה מתרעננת אוטומטית, כדי שהמסך יראה את המצב האמיתי של העותקים.
   */
  const runCopyAction = async (copyId, action) => {
    setBusyCopyId(copyId);
    setActionError(null);
    setSuccessMessage(null);
    try {
      setSuccessMessage(await action());
    } catch (error) {
      setActionError(error);
    } finally {
      setBusyCopyId(null);
      refresh();
    }
  };

  const handleBorrow = (copyId) =>
    runCopyAction(copyId, async () => {
      const loan = await borrowCopy(copyId);
      return `ההשאלה בוצעה! יש להחזיר את הספר עד ${formatDate(loan.dueAtUtc)}.`;
    });

  const handleStatusChange = (copyId, status) =>
    runCopyAction(copyId, async () => {
      await changeCopyStatus(copyId, status);
      return status === 'Lost' ? 'העותק סומן כלא זמין.' : 'העותק זמין שוב להשאלה.';
    });

  if (book.error) return <ErrorMessage error={book.error} />;
  if (!book.data) return <Loading />;

  return (
    <>
      <Link to="/" className="back-link">
        → חזרה לרשימת הספרים
      </Link>

      <section className="book-details">
        <BookCover title={book.data.title} size="large" />
        <div className="book-details-info">
          <h1>{book.data.title}</h1>
          <p className="book-author">{book.data.author}</p>
          <dl className="facts">
            <div>
              <dt>שנת הוצאה</dt>
              <dd>{book.data.publishedYear}</dd>
            </div>
            <div>
              <dt>ISBN</dt>
              <dd dir="ltr">{book.data.isbn}</dd>
            </div>
            <div>
              <dt>עותקים פנויים</dt>
              <dd>
                {book.data.availableCopies} מתוך {book.data.totalCopies}
              </dd>
            </div>
          </dl>
          <div className="chips">
            {book.data.categories.map((category) => (
              <span key={category.id} className="chip">
                {category.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="card">
        <div className="section-title">
          <h2>עותקים</h2>
          <button type="button" className="button-secondary" onClick={refresh}>
            רענון
          </button>
        </div>

        {successMessage && <p className="success">{successMessage}</p>}
        <ErrorMessage error={actionError} />
        <ErrorMessage error={copies.error} />

        {copies.data?.length === 0 && <p className="muted">לספר הזה עדיין אין עותקים.</p>}

        <ul className="copy-list">
          {copies.data?.map((copy) => {
            const status = COPY_STATUS[copy.status];
            return (
              <li key={copy.id} className="copy-row">
                <span className="barcode" dir="ltr">
                  {copy.barcode}
                </span>
                <Badge tone={status.tone}>{status.label}</Badge>
                {isReader && copy.status === 'Available' && (
                  <button type="button" onClick={() => handleBorrow(copy.id)} disabled={busyCopyId !== null}>
                    {busyCopyId === copy.id ? 'משאילה...' : 'השאילי'}
                  </button>
                )}
                {isStaff && copy.status !== 'Loaned' && (
                  <button
                    type="button"
                    className="button-secondary"
                    onClick={() => handleStatusChange(copy.id, copy.status === 'Lost' ? 'Available' : 'Lost')}
                    disabled={busyCopyId !== null}
                  >
                    {copy.status === 'Lost' ? 'החזירי לזמינות' : 'סמני כלא זמין'}
                  </button>
                )}
              </li>
            );
          })}
        </ul>

        {isStaff && <AddCopyForm bookId={id} onAdded={refresh} />}
      </section>
    </>
  );
}

/** לספרנית ולמנהלת: הוספת עותק לספר */
function AddCopyForm({ bookId, onAdded }) {
  const [barcode, setBarcode] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await addCopy(bookId, barcode.trim());
      setBarcode('');
      onAdded();
    } catch (err) {
      setError(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="inline-form" onSubmit={handleSubmit}>
      <h3>הוספת עותק</h3>
      <div className="inline-form-row">
        <input
          value={barcode}
          onChange={(e) => setBarcode(e.target.value)}
          placeholder="ברקוד, למשל LIB-0100"
          required
          maxLength={50}
          dir="ltr"
          aria-label="ברקוד"
        />
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'מוסיפה...' : 'הוספה'}
        </button>
      </div>
      <ErrorMessage error={error} />
    </form>
  );
}
