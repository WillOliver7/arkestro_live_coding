import { useBooks, useMembers, useLendings } from "../hooks";
import { LendingForm } from "../components/LendingTable";
import LendingTable from "../components/LendingTable";

export default function Lendings() {
  const { data: books = [], isPending: booksPending } = useBooks();
  const { data: members = [], isPending: membersPending } = useMembers();
  const { data: lendings = [], isPending: lendingsPending } = useLendings();

  const loading = booksPending || membersPending || lendingsPending;

  if (loading) {
    return (
      <div className="text-center py-20 animate-pulse">
        <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-100 px-4 py-1 text-sm text-gray-600">
          Loading lendings…
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Lendings</h1>
      <p className="text-gray-600">
        Create new loans and return books. A due date of today + 14 days is set
        automatically.
      </p>
      <LendingForm
        books={books}
        members={members}
        onSuccess={() => {}}
      />
      <LendingTable lendings={lendings} books={books} members={members} />
    </div>
  );
}
