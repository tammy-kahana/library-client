import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import AuthCard from '../components/AuthCard';
import ErrorMessage from '../components/ErrorMessage';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await login(email, password);
      // חזרה לדף שניסו להגיע אליו לפני ההתחברות
      navigate(location.state?.from ?? '/', { replace: true });
    } catch (err) {
      setError(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthCard
      title="ברוכה הבאה"
      subtitle="התחברי כדי להשאיל ספרים"
      footer={
        <>
          אין לך חשבון? <Link to="/register">להרשמה</Link>
        </>
      }
    >
      {location.state?.message && <p className="notice">{location.state.message}</p>}

      <form onSubmit={handleSubmit} className="form">
        <label>
          מייל
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
        </label>
        <label>
          סיסמה
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </label>

        <ErrorMessage error={error} />

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'מתחברת...' : 'התחברות'}
        </button>
      </form>
    </AuthCard>
  );
}
