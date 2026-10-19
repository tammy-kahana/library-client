import { Navigate, Route, Routes } from 'react-router-dom';
import RequireAuth from './auth/RequireAuth';
import Layout from './components/Layout';
import AddBookPage from './pages/AddBookPage';
import AllLoansPage from './pages/AllLoansPage';
import BookDetailsPage from './pages/BookDetailsPage';
import BooksPage from './pages/BooksPage';
import LoginPage from './pages/LoginPage';
import MyLoansPage from './pages/MyLoansPage';
import RegisterPage from './pages/RegisterPage';
import { ROLES } from './utils/roles';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/" element={<RequireAuth><BooksPage /></RequireAuth>} />
        <Route path="/books/:id" element={<RequireAuth><BookDetailsPage /></RequireAuth>} />
        <Route path="/my-loans" element={<RequireAuth roles={[ROLES.Reader]}><MyLoansPage /></RequireAuth>} />
        <Route
          path="/loans"
          element={<RequireAuth roles={[ROLES.Librarian, ROLES.Admin]}><AllLoansPage /></RequireAuth>}
        />
        <Route
          path="/books/new"
          element={<RequireAuth roles={[ROLES.Librarian, ROLES.Admin]}><AddBookPage /></RequireAuth>}
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
