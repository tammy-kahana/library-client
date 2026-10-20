/**
 * הודעת שגיאה אחידה.
 * מזהה הבקשה מוצג רק בתקלת שרת (500 ומעלה), כדי שאפשר יהיה למצוא אותה בלוג של השרת.
 * בשגיאה עסקית צפויה (למשל "הגעת למכסה") ההודעה מסבירה הכול, והמזהה רק היה מבלבל.
 */
export default function ErrorMessage({ error }) {
  if (!error) return null;

  const showRequestId = error.correlationId && error.status >= 500;

  return (
    <div className="error" role="alert">
      <p>{error.message}</p>
      {showRequestId && <p className="error-id">מזהה בקשה: {error.correlationId}</p>}
    </div>
  );
}
