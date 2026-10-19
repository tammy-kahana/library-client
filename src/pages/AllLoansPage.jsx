import { useState } from 'react';
import { getAllLoans } from '../api/loans';
import ErrorMessage from '../components/ErrorMessage';
import LoanList from '../components/LoanList';
import Loading from '../components/Loading';
import Pagination from '../components/Pagination';
import { useApi } from '../hooks/useApi';
import { useReturnLoan } from '../hooks/useReturnLoan';

const PAGE_SIZE = 10;

/** ספרנית ומנהלת: כל ההשאלות, סינון באיחור, והחזרה בשם קוראת */
export default function AllLoansPage() {
  const [page, setPage] = useState(1);
  const [overdue, setOverdue] = useState(false);

  const loans = useApi(() => getAllLoans({ page, pageSize: PAGE_SIZE, overdue }), [page, overdue]);
  const returning = useReturnLoan(loans.reload);

  return (
    <>
      <div className="section-title">
        <h1>כל ההשאלות</h1>
        <label className="toggle">
          <input
            type="checkbox"
            checked={overdue}
            onChange={(e) => {
              setOverdue(e.target.checked);
              setPage(1);
            }}
          />
          רק השאלות באיחור
        </label>
      </div>

      {returning.successMessage && <p className="success">{returning.successMessage}</p>}
      <ErrorMessage error={returning.error} />
      <ErrorMessage error={loans.error} />
      {loans.isLoading && !loans.data && <Loading />}

      {loans.data?.totalCount === 0 && (
        <div className="empty-state">
          <p>{overdue ? 'אין השאלות באיחור.' : 'אין השאלות.'}</p>
        </div>
      )}

      {loans.data && (
        <>
          <LoanList
            loans={loans.data.items}
            showReader
            returningId={returning.returningId}
            onReturn={returning.handleReturn}
          />
          <Pagination page={loans.data.page} totalPages={loans.data.totalPages} onChange={setPage} />
        </>
      )}
    </>
  );
}
