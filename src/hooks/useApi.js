import { useCallback, useEffect, useState } from 'react';

/**
 * טעינת נתונים מהשרת: מחזיר data, error, isLoading ו-reload.
 * כל המסכים משתמשים בו, כדי שהלוגיקה של טעינה ושגיאה לא תחזור בכל מסך.
 * deps: מתי לטעון מחדש (למשל כשמשתנים פרמטרי החיפוש).
 */
export function useApi(loader, deps) {
  const [state, setState] = useState({ data: null, error: null, isLoading: true });
  const [reloadCount, setReloadCount] = useState(0);

  useEffect(() => {
    let isCancelled = false;
    // משאירים את הנתונים הקודמים בזמן הטעינה, כדי שהמסך לא "יקפוץ"
    setState((previous) => ({ ...previous, error: null, isLoading: true }));

    loader()
      .then((data) => !isCancelled && setState({ data, error: null, isLoading: false }))
      .catch((error) => !isCancelled && setState({ data: null, error, isLoading: false }));

    return () => {
      isCancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, reloadCount]);

  const reload = useCallback(() => setReloadCount((count) => count + 1), []);

  return { ...state, reload };
}
