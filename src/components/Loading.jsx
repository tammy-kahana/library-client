export default function Loading({ text = 'טוען...' }) {
  return (
    <div className="loading" role="status">
      <span className="spinner" aria-hidden="true" />
      {text}
    </div>
  );
}
