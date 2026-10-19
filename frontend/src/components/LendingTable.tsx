import { useState, useMemo, useCallback, type FormEvent } from "react";
import { useCreateLending, useUpdateLending } from "../hooks";
import StatusBadge from "./StatusBadge";
import type { Book, Member, Lending } from "../types";

const TODAY = new Date().toISOString().slice(0, 10);

type LendingTableProps = {
  lendings: Lending[];
  books: Book[];
  members: Member[];
};

export default function LendingTable({
  lendings,
  books,
  members,
}: LendingTableProps) {
  const bookById = useMemo(
    () => new Map(books.map((b) => [b.id, b])),
    [books]
  );
  const memberById = useMemo(
    () => new Map(members.map((m) => [m.id, m])),
    [members]
  );

  const [returningId, setReturningId] = useState<number | null>(null);
  const updateLending = useUpdateLending();
  const handleReturn = useCallback(
    (id: number) => {
      if (!window.confirm("Mark this book as returned?")) return;
      setReturningId(id);
      updateLending.mutate(
        { id, payload: { return_date: TODAY } },
        {
          onSettled: () => setReturningId(null),
        }
      );
    },
    [updateLending]
  );

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <table className="w-full text-sm text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="p-4 font-medium text-gray-600">Book</th>
            <th className="p-4 font-medium text-gray-600">Member</th>
            <th className="p-4 font-medium text-gray-600">Due date</th>
            <th className="p-4 font-medium text-gray-600">Returned</th>
            <th className="p-4 font-medium text-gray-600">Late</th>
            <th className="p-4 font-medium text-gray-600">Rating</th>
            <th className="p-4 font-medium text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {lendings.map((l) => {
            const book = bookById.get(l.book_id);
            const member = memberById.get(l.member_id);
            const isOverdue =
              !l.return_date &&
              l.due_date &&
              new Date(l.due_date) < new Date(TODAY);
            return (
              <tr key={l.id} className="hover:bg-gray-50">
                <td className="p-4 text-gray-900">{book?.title}</td>
                <td className="p-4 text-gray-600">{member?.name}</td>
                <td className="p-4">
                  <span
                    className={`text-sm font-medium ${
                      isOverdue ? "text-red-600" : "text-gray-600"
                    }`}
                  >
                    {l.due_date || "—"}
                  </span>
                </td>
                <td className="p-4 text-gray-600">
                  {l.return_date || <span className="italic">—</span>}
                </td>
                <td className="p-4">
                  {l.is_late ? (
                    <StatusBadge status="late" />
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
                <td className="p-4 text-gray-600">
                  {l.rating ?? <span className="italic text-gray-400">—</span>}
                </td>
                <td className="p-4">
                  {!l.return_date && (
                    <button
                      disabled={returningId === l.id}
                      onClick={() => handleReturn(l.id)}
                      className="rounded-lg bg-red-600 px-3 py-1.5 text-xs text-white hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {returningId === l.id ? "Returning…" : "Return book"}
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

type LendingFormProps = {
  books: Book[];
  members: Member[];
  onSuccess?: () => void;
};

export function LendingForm({
  books,
  members,
  onSuccess,
}: LendingFormProps) {
  const [memberId, setMemberId] = useState("");
  const [bookId, setBookId] = useState("");
  const [rating, setRating] = useState("");
  const [isLate, setIsLate] = useState(false);

  const createLending = useCreateLending();

  const availableBooks = books.filter((b) => !b.is_lent);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    createLending.mutate(
      {
        book_id: Number(bookId),
        member_id: Number(memberId),
      },
      {
        onSuccess: () => {
          onSuccess?.();
          reset();
        },
      }
    );
  };

  const reset = () => {
    setMemberId("");
    setBookId("");
    setRating("");
    setIsLate(false);
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-gray-900">Lend a book</h3>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex flex-col gap-2 sm:col-span-2">
          <label className="text-sm font-medium text-gray-700">Member</label>
          <select
            value={memberId}
            onChange={(e) => setMemberId(e.target.value)}
            required
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            <option value="">Select member</option>
            {members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-2 sm:col-span-2">
          <label className="text-sm font-medium text-gray-700">Book (available only)</label>
          <select
            value={bookId}
            onChange={(e) => setBookId(e.target.value)}
            required
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            <option value="">Select book</option>
            {availableBooks.map((b) => (
              <option key={b.id} value={b.id}>
                {b.title} ({b.bar_code})
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">Rating (1-5)</label>
          <input
            type="number"
            min="1"
            max="5"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>
        <div className="flex items-end flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">Returned late?</label>
          <input
            type="checkbox"
            checked={isLate}
            onChange={(e) => setIsLate(e.target.checked)}
            className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
        </div>
        <div className="flex items-end gap-2 sm:col-span-3">
          <button
            type="submit"
            disabled={createLending.isPending}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {createLending.isPending ? "Creating…" : "Create lending"}
          </button>
          <button
            type="button"
            onClick={reset}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Reset
          </button>
        </div>
        {createLending.isError && (
          <div className="sm:col-span-3 text-sm text-red-600">
            Failed to create lending. Please try again.
          </div>
        )}
      </form>
    </div>
  );
}
