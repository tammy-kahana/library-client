/** ניווט בין עמודים. העימוד עצמו קורה בשרת (Skip/Take בתוך השאילתה). */
export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  return (
    <nav className="pagination" aria-label="עמודים">
      <button type="button" className="button-secondary" disabled={page <= 1} onClick={() => onChange(page - 1)}>
        → הקודם
      </button>
      <span>
        עמוד {page} מתוך {totalPages}
      </span>
      <button type="button" className="button-secondary" disabled={page >= totalPages} onClick={() => onChange(page + 1)}>
        הבא ←
      </button>
    </nav>
  );
}
