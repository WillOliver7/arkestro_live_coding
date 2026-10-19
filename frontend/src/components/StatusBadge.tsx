type StatusBadgeProps = {
  status: "available" | "lent" | "overdue" | "returned" | "late";
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const variants: Record<string, string> = {
    available: "bg-green-100 text-green-700 border-green-200",
    lent: "bg-blue-100 text-blue-700 border-blue-200",
    overdue: "bg-red-100 text-red-700 border-red-200",
    returned: "bg-gray-100 text-gray-700 border-gray-200",
    late: "bg-orange-100 text-orange-700 border-orange-200",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${
        variants[status]
      }`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
