import { Link } from 'react-router-dom';
import Badge from './Badge';
import BookCover from './BookCover';

export default function BookCard({ book }) {
  const isAvailable = book.availableCopies > 0;

  return (
    <Link to={`/books/${book.id}`} className="book-card">
      <BookCover title={book.title} />
      <div className="book-card-body">
        <h3>{book.title}</h3>
        <p className="muted">{book.author}</p>
        <div className="chips">
          {book.categories.map((category) => (
            <span key={category.id} className="chip">
              {category.name}
            </span>
          ))}
        </div>
        <Badge tone={isAvailable ? 'success' : 'warning'}>
          {isAvailable ? `${book.availableCopies} מתוך ${book.totalCopies} פנויים` : 'אין עותק פנוי כרגע'}
        </Badge>
      </div>
    </Link>
  );
}
