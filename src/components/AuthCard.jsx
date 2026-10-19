/** המסגרת המשותפת למסכי ההתחברות וההרשמה */
export default function AuthCard({ title, subtitle, children, footer }) {
  return (
    <section className="auth-card">
      <div className="auth-header">
        <span className="auth-icon" aria-hidden="true">📚</span>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {children}
      <p className="form-footer">{footer}</p>
    </section>
  );
}
