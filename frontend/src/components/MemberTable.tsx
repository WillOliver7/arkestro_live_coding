import { useState } from "react";
import {
  useMembers,
  useCreateMember,
  useUpdateMember,
  useDeleteMember,
} from "../hooks";

export default function MemberTable() {
  const { data: members = [], isPending, error } = useMembers();
  const createMember = useCreateMember();
  const updateMember = useUpdateMember();
  const deleteMember = useDeleteMember();

  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const member = editingId ? members.find((m) => m.id === editingId) : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId && member) {
      updateMember.mutate({ id: editingId, payload: { name, email } });
    } else {
      createMember.mutate({ name, email });
    }
    reset();
  };

  const reset = () => {
    setEditingId(null);
    setName("");
    setEmail("");
  };

  const handleDelete = (id: number) => {
    if (!window.confirm("Delete this member? This cannot be undone.")) return;
    deleteMember.mutate(id);
  };

  if (isPending) return <div className="text-center py-10">Loading members…</div>;
  if (error) return <div className="text-center py-10 text-red-600">Error loading members.</div>;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl font-semibold text-gray-900">Members</h2>
        <button
          onClick={() => reset()}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
        >
          + Add member
        </button>
      </div>

      <form onSubmit={handleSubmit} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Jane Doe"
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. jane@example.com"
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={createMember.isPending || updateMember.isPending}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {editingId ? "Save changes" : "Create member"}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={reset}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
        )}
      </form>

      {members.length === 0 ? (
        <div className="text-center py-10 text-gray-500">No members found.</div>
      ) : (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="p-4 font-medium text-gray-600">Name</th>
                <th className="p-4 font-medium text-gray-600">Email</th>
                <th className="p-4 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {members.map((m) => (
                <tr key={m.id}>
                  <td className="p-4 text-gray-900">{m.name}</td>
                  <td className="p-4 text-gray-600">{m.email}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingId(m.id);
                          setName(m.name);
                          setEmail(m.email);
                        }}
                        className="p-2 text-gray-400 hover:text-gray-900"
                        title="Edit"
                      >
                        <span className="sr-only">Edit {m.name}</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(m.id)}
                        className="p-2 text-gray-400 hover:text-red-600"
                        title="Delete"
                      >
                        <span className="sr-only">Delete {m.name}</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
