import { useMemo } from "react";
import { useBooks, useMembers, useLendings } from "../hooks";
import StatCard from "../components/StatCard";
import LendingTable from "../components/LendingTable";
import StatusBadge from "../components/StatusBadge";
import type { MemberStats, DashboardStats } from "../types";

const TODAY = new Date().toISOString().slice(0, 10);

export default function Dashboard() {
  const { data: books = [], isPending: booksPending } = useBooks();
  const { data: members = [], isPending: membersPending } = useMembers();
  const { data: lendings = [], isPending: lendingsPending } = useLendings();

  const loading = booksPending || membersPending || lendingsPending;

  const bookById = useMemo(
    () => new Map(books.map((b) => [b.id, b])),
    [books]
  );
  const memberById = useMemo(
    () => new Map(members.map((m) => [m.id, m])),
    [members]
  );

  const stats: DashboardStats = useMemo(() => {
    const totalBooks = books.length;
    const lentBooks = books.filter((b) => b.is_lent).length;
    const overdueCount = lendings.filter(
      (l) =>
        !l.return_date &&
        l.due_date &&
        new Date(l.due_date) < new Date(TODAY)
    ).length;
    return {
      total_books: totalBooks,
      lent_books: lentBooks,
      overdue_count: overdueCount,
      total_members: members.length,
    };
  }, [books, lendings, members]);

  const memberStats: MemberStats[] = useMemo(() => {
    return members.map((member) => {
      const ml = lendings.filter((l) => l.member_id === member.id);
      const returned = ml.filter((l) => l.return_date);
      const unreturned = ml.filter((l) => !l.return_date);
      const ratings = ml
        .filter((l) => l.rating !== null)
        .map((l) => l.rating!);
      const maxRating =
        ratings.length > 0 ? Math.max(...ratings) : null;
      const avgRating =
        ratings.length > 0
          ? ratings.reduce((a, b) => a + b, 0) / ratings.length
          : null;
      const everLate = ml.some((l) => l.is_late);
      return {
        member,
        returned_count: returned.length,
        unreturned_count: unreturned.length,
        max_rating: maxRating,
        avg_rating: avgRating,
        ever_late: everLate,
      };
    });
  }, [members, lendings]);

  const recentLendings = useMemo(() => {
    return [...lendings]
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
      .slice(0, 5);
  }, [lendings]);

  if (loading) {
    return (
      <div className="text-center py-20 animate-pulse">
        <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-100 px-4 py-1 text-sm text-gray-600">
          Loading dashboard…
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Books lending overview</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total books" value={stats.total_books} />
        <StatCard
          label="Currently lent"
          value={stats.lent_books}
          delta={stats.lent_books > 0 ? `${stats.lent_books} out` : undefined}
        />
        <StatCard
          label="Overdue"
          value={stats.overdue_count}
          delta={
            stats.overdue_count > 0
              ? `${stats.overdue_count} overdue`
              : "All clear"
          }
        />
        <StatCard label="Members" value={stats.total_members} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-3">
            <h2 className="text-lg font-semibold text-gray-900">
              Member lending history
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="p-4 font-medium text-gray-600">Member</th>
                  <th className="p-4 font-medium text-gray-600">Returned</th>
                  <th className="p-4 font-medium text-gray-600">Out now</th>
                  <th className="p-4 font-medium text-gray-600">Max rating</th>
                  <th className="p-4 font-medium text-gray-600">Avg rating</th>
                  <th className="p-4 font-medium text-gray-600">Ever late</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {memberStats.map((ms) => (
                  <tr key={ms.member.id} className="hover:bg-gray-50">
                    <td className="p-4 text-gray-900">{ms.member.name}</td>
                    <td className="p-4 text-gray-600">{ms.returned_count}</td>
                    <td className="p-4 text-gray-600">
                      {ms.unreturned_count}
                    </td>
                    <td className="p-4 text-gray-600">
                      {ms.max_rating ?? "—"}
                    </td>
                    <td className="p-4 text-gray-600">
                      {ms.avg_rating?.toFixed(2) ?? "—"}
                    </td>
                    <td className="p-4">
                      {ms.ever_late ? (
                        <StatusBadge status="late" />
                      ) : (
                        <span className="text-green-600 text-xs">No</span>
                      )}
                    </td>
                  </tr>
                ))}
                {memberStats.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-500">
                      No members found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Recent activity
          </h2>
          {recentLendings.length === 0 ? (
            <p className="text-gray-500 text-sm">No lending activity yet.</p>
          ) : (
            <ul className="space-y-3">
              {recentLendings.map((l) => {
                const book = bookById.get(l.book_id);
                const member = memberById.get(l.member_id);
                const isOverdue =
                  !l.return_date &&
                  l.due_date &&
                  new Date(l.due_date) < new Date(TODAY);
                return (
                  <li key={l.id} className="flex items-center gap-4 p-3 rounded-lg border border-gray-200 bg-gray-50">
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">
                        {member?.name} borrowed <span className="font-medium">{book?.title}</span>
                      </p>
                      <p className="text-xs text-gray-500">
                        Due {l.due_date || "—"} by {isOverdue ? "OVERDUE" : "on time"}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-medium rounded-full px-2 py-0.5 ${
                        l.return_date
                          ? "bg-green-100 text-green-700"
                          : isOverdue
                          ? "bg-red-100 text-red-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {l.return_date ? "Returned" : isOverdue ? "Overdue" : "On loan"}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-3">
          <h2 className="text-lg font-semibold text-gray-900">All lendings</h2>
          <p className="text-xs text-gray-500 mt-1">
            Mark books as returned from the Lendings page.
          </p>
        </div>
        <LendingTable lendings={lendings} books={books} members={members} />
      </div>
    </div>
  );
}
