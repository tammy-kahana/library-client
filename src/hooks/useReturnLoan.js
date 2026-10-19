import { useState } from 'react';
import { returnLoan } from '../api/loans';

/** החזרת השאלה + הודעות, משותף לשני מסכי ההשאלות. onDone: רענון הרשימה. */
export function useReturnLoan(onDone) {
  const [returningId, setReturningId] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleReturn = async (loanId) => {
    setReturningId(loanId);
    setError(null);
    setSuccessMessage(null);
    try {
      await returnLoan(loanId);
      setSuccessMessage('הספר הוחזר. תודה!');
    } catch (err) {
      setError(err);
    } finally {
      setReturningId(null);
      onDone();
    }
  };

  return { returningId, error, successMessage, handleReturn };
}
