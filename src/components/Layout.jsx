import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { ROLE_NAMES, ROLES } from '../utils/roles';

export default function Layout() {
  const { user, hasRole, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <header className="site-header">
        <div className="container header-inner">
          <NavLink to="/" className="brand">
            <span className="brand-icon" aria-hidden="true">📚</span>
            הספרייה
          </NavLink>

          {user && (
            <nav className="nav">
              <NavLink to="/" end>
                ספרים
              </NavLink>
              {hasRole(ROLES.Reader) && <NavLink to="/my-loans">ההשאלות שלי</NavLink>}
              {hasRole(ROLES.Librarian, ROLES.Admin) && (
                <>
                  <NavLink to="/loans">כל ההשאלות</NavLink>
                  <NavLink to="/books/new">הוספת ספר</NavLink>
                </>
              )}
            </nav>
          )}

          {user && (
            <div className="user-box">
              <span className="user-name">{user.fullName}</span>
              <span className="role-tag">{ROLE_NAMES[user.role]}</span>
              <button type="button" className="button-ghost" onClick={handleLogout}>
                התנתקות
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="container page">
        <Outlet />
      </main>
    </>
  );
}
