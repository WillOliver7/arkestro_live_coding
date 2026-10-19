import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge";
import type { Book, Lending, Member } from "../types";

type BookTableProps = {
  books: Book[];
  lendings: Lending[];
  members: Member[];
};

export default function BookTable({ books, lendings, members }: BookTableProps) {
  const memberById = new Map(members.map((m) => [m.id, m]));
  const activeByBook = new Map(
    lendings
      .filter((l) => !l.return_date)
      .map((l) => [l.book_id, l])
  );

  if (books.length === 0) {
    return <div className="text-center py-10 text-gray-500">No books found.</div>;
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <table className="w-full text-sm text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="p-4 font-medium text-gray-600">Title</th>
            <th className="p-4 font-medium text-gray-600">Bar code</th>
            <th className="p-4 font-medium text-gray-600">Status</th>
            <th className="p-4 font-medium text-gray-600">Current borrower</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {books.map((book) => {
            const active = activeByBook.get(book.id);
            const borrower = active ? memberById.get(active.member_id) : null;
            return (
              <tr key={book.id} className="hover:bg-gray-50">
                <td className="p-4">
                  <Link to={`/books/${book.id}`} className="text-blue-600 hover:underline">
                    {book.title}
                  </Link>
                </td>
                <td className="p-4 text-gray-600">{book.bar_code}</td>
                <td className="p-4">
                  <StatusBadge status={book.is_lent ? "lent" : "available"} />
                </td>
                <td className="p-4 text-gray-600">
                  {borrower ? borrower.name : "—"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
