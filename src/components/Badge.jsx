/** תגית צבעונית קטנה. tone: success | warning | danger | info | muted */
export default function Badge({ tone = 'muted', children }) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}
