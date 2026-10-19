type StatCardProps = {
  label: string;
  value: React.ReactNode;
  delta?: string;
};

export default function StatCard({ label, value, delta }: StatCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <p className="text-sm text-gray-500">{label}</p>
      <div className="mt-2 flex items-baseline gap-1">
        <span className="text-2xl font-bold text-gray-900">{value}</span>
        {delta && <span className="text-sm text-green-600">{delta}</span>}
      </div>
    </div>
  );
}
