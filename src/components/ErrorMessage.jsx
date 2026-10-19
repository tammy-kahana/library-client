/** הודעת שגיאה אחידה. מזהה הבקשה מוצג קטן, כדי שאפשר יהיה למצוא את הבקשה בלוג של השרת. */
export default function ErrorMessage({ error }) {
  if (!error) return null;

  return (
    <div className="error" role="alert">
      <p>{error.message}</p>
      {error.correlationId && <p className="error-id">מזהה בקשה: {error.correlationId}</p>}
    </div>
  );
}
