import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyLoans } from '../api/loans';
import ErrorMessage from '../components/ErrorMessage';
import LoanList from '../components/LoanList';
import Loading from '../components/Loading';
import Pagination from '../components/Pagination';
import { useApi } from '../hooks/useApi';
import { useReturnLoan } from '../hooks/useReturnLoan';

const PAGE_SIZE = 10;

export default function MyLoansPage() {
  const [page, setPage] = useState(1);
  const [activeOnly, setActiveOnly] = useState(true);

  const loans = useApi(() => getMyLoans({ page, pageSize: PAGE_SIZE, activeOnly }), [page, activeOnly]);
  const returning = useReturnLoan(loans.reload);

  return (
    <>
      <div className="section-title">
        <h1>ההשאלות שלי</h1>
        <label className="toggle">
          <input
            type="checkbox"
            checked={activeOnly}
            onChange={(e) => {
              setActiveOnly(e.target.checked);
              setPage(1);
            }}
          />
          רק השאלות פעילות
        </label>
      </div>

      {returning.successMessage && <p className="success">{returning.successMessage}</p>}
      <ErrorMessage error={returning.error} />
      <ErrorMessage error={loans.error} />
      {loans.isLoading && !loans.data && <Loading />}

      {loans.data?.totalCount === 0 && (
        <div className="empty-state">
          <p>{activeOnly ? 'אין לך כרגע השאלות פעילות.' : 'עדיין לא השאלת ספרים.'}</p>
          <Link to="/">לרשימת הספרים</Link>
        </div>
      )}

      {loans.data && (
        <>
          <LoanList loans={loans.data.items} returningId={returning.returningId} onReturn={returning.handleReturn} />
          <Pagination page={loans.data.page} totalPages={loans.data.totalPages} onChange={setPage} />
        </>
      )}
    </>
  );
}
