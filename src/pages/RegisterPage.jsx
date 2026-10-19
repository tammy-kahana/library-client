import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import AuthCard from '../components/AuthCard';
import ErrorMessage from '../components/ErrorMessage';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: '', email: '', password: '' });
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field) => (event) => setForm({ ...form, [field]: event.target.value });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await register(form.fullName, form.email, form.password);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthCard
      title="הרשמה לספרייה"
      subtitle="כמה פרטים, ומתחילים לקרוא"
      footer={
        <>
          כבר רשומה? <Link to="/login">להתחברות</Link>
        </>
      }
    >

      {/* אותם כללים כמו ב-RegisterRequest בשרת. השרת בודק שוב בכל מקרה */}
      <form onSubmit={handleSubmit} className="form">
        <label>
          שם מלא
          <input value={form.fullName} onChange={updateField('fullName')} required maxLength={100} autoComplete="name" />
        </label>
        <label>
          מייל
          <input type="email" value={form.email} onChange={updateField('email')} required maxLength={200} autoComplete="email" />
        </label>
        <label>
          סיסמה (8 תווים לפחות)
          <input
            type="password"
            value={form.password}
            onChange={updateField('password')}
            required
            minLength={8}
            maxLength={100}
            autoComplete="new-password"
          />
        </label>

        <ErrorMessage error={error} />

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'נרשמת...' : 'הרשמה'}
        </button>
      </form>
    </AuthCard>
  );
}
