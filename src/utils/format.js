const dateFormatter = new Intl.DateTimeFormat('he-IL', { day: '2-digit', month: '2-digit', year: 'numeric' });

/** תאריך מהשרת (UTC) → תאריך מקומי לתצוגה. ההמרה לאזור הזמן המקומי קורית רק כאן, בתצוגה. */
export const formatDate = (isoDate) => (isoDate ? dateFormatter.format(new Date(isoDate)) : '');
