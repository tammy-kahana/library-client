import { Link } from 'react-router-dom';
import { formatDate } from '../utils/format';
import Badge from './Badge';
import BookCover from './BookCover';

function loanStatus(loan) {
  if (loan.returnedAtUtc) return { label: 'הוחזר', tone: 'muted' };
  if (loan.isOverdue) return { label: 'באיחור', tone: 'danger' };
  return { label: 'פעילה', tone: 'info' };
}

/**
 * רשימת השאלות, משותפת ל"ההשאלות שלי" ול"כל ההשאלות".
 * showReader: להציג את שם הקוראת (במסך של הספרנית).
 */
export default function LoanList({ loans, showReader = false, returningId, onReturn }) {
  return (
    <ul className="loan-list">
      {loans.map((loan) => {
        const status = loanStatus(loan);
        return (
          <li key={loan.id} className={`loan-row ${loan.isOverdue ? 'loan-row-overdue' : ''}`}>
            <BookCover title={loan.bookTitle} size="small" />
            <div className="loan-info">
              <Link to={`/books/${loan.bookId}`} className="loan-title">
                {loan.bookTitle}
              </Link>
              <p className="muted">
                {showReader && <>{loan.userFullName} · </>}
                הושאל ב-{formatDate(loan.loanedAtUtc)} ·{' '}
                {loan.returnedAtUtc
                  ? `הוחזר ב-${formatDate(loan.returnedAtUtc)}`
                  : `להחזיר עד ${formatDate(loan.dueAtUtc)}`}
              </p>
            </div>
            <Badge tone={status.tone}>{status.label}</Badge>
            {!loan.returnedAtUtc && (
              <button type="button" onClick={() => onReturn(loan.id)} disabled={returningId !== null}>
                {returningId === loan.id ? 'מחזירה...' : 'החזירי'}
              </button>
            )}
          </li>
        );
      })}
    </ul>
  );
}
