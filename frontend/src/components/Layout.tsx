import { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  RefreshCw,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/books", label: "Books", icon: BookOpen },
  { to: "/members", label: "Members", icon: Users },
  { to: "/lendings", label: "Lendings", icon: RefreshCw },
];

export default function Layout() {
  const [open, setOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-50">
      <aside
        className={`fixed inset-y-0 left-0 z-20 ${
          open
            ? "w-64 bg-white border-r border-gray-200 transform translate-x-0 transition-transform duration-200"
            : "-w-full transform -translate-x-full transition-transform duration-200"
        }`}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200 bg-white">
          <span className="font-semibold">BookLending</span>
          <button
            onClick={() => setOpen(false)}
            className="md:hidden p-2 text-gray-500 hover:text-gray-700"
            aria-label="Close menu"
          >
            <X />
          </button>
        </div>
        <nav className="mt-6 px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 text-gray-600"
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className={`flex-1 ${open ? "pl-64" : ""} overflow-y-auto`}>
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center justify-between h-16 border-b border-gray-200 bg-white px-4">
          <button
            onClick={() => setOpen(true)}
            className="p-2 text-gray-500 hover:text-gray-700"
            aria-label="Open menu"
          >
            <Menu />
          </button>
          <button className="p-2 text-gray-500 hover:text-gray-700">
            <RefreshCw />
          </button>
        </div>

        <main className="p-6 md:p-8"><Outlet /></main>
      </div>
    </div>
  );
}
