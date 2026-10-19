import MemberTable from "../components/MemberTable";

export default function Members() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Members</h1>
      <p className="text-gray-600">Manage library members.</p>
      <MemberTable />
    </div>
  );
}
