import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

/**
 * מסתיר דפים ממי שלא מחוברת, או שאין לה את התפקיד הנדרש.
 * זו נוחות בממשק בלבד: ההרשאה האמיתית נבדקת בשרת ([Authorize]).
 */
export default function RequireAuth({ roles, children }) {
  const { isAuthenticated, hasRole } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (roles && !hasRole(...roles)) {
    return <p className="notice">אין לך הרשאה לדף הזה.</p>;
  }

  return children;
}
