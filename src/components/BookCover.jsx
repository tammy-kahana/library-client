// "כריכה" צבעונית שנגזרת מהכותרת: אותו ספר מקבל תמיד אותו צבע, בלי צורך בתמונות.
const PALETTES = [
  ['#1f5f7a', '#2f86a6'],
  ['#7a2e3b', '#a8455a'],
  ['#3d5a3a', '#5f8a5a'],
  ['#5a3d7a', '#8160a8'],
  ['#8a5a1f', '#c08a3e'],
  ['#2b3f6b', '#4866a3'],
];

function paletteFor(title) {
  const hash = [...title].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return PALETTES[hash % PALETTES.length];
}

export default function BookCover({ title, size = 'medium' }) {
  const [from, to] = paletteFor(title);

  return (
    <div className={`book-cover book-cover-${size}`} style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}>
      <span className="book-cover-title">{title}</span>
    </div>
  );
}
