import { useBooks, useMembers, useLendings } from "../hooks";
import BookTable from "../components/BookTable";

export default function Books() {
  const { data: books = [], isPending: booksPending } = useBooks();
  const { data: lendings = [], isPending: lendingsPending } = useLendings();
  const { data: members = [], isPending: membersPending } = useMembers();

  const loading = booksPending || lendingsPending || membersPending;

  if (loading) {
    return (
      <div className="text-center py-20 animate-pulse">
        <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-100 px-4 py-1 text-sm text-gray-600">
          Loading books…
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Books</h1>
      <p className="text-gray-600">Browse the library catalog (read-only).</p>
      <BookTable books={books} lendings={lendings} members={members} />
    </div>
  );
}
