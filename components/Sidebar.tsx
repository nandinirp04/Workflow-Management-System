"use client";

import Link from "next/link";
<Link href="/">Dashboard</Link>;
<Link href="/clients">Clients</Link>;
<Link href="/calendar">Calendar</Link>;

import { LayoutDashboard, Users, Calendar, CheckSquare, Bell } from "lucide-react";

const menu = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/" },
  { name: "Clients", icon: Users, path: "/clients" },
  { name: "Calendar", icon: Calendar, path: "/calendar" },
  { name: "Tasks", icon: CheckSquare, path: "/tasks" },
  { name: "Notifications", icon: Bell, path: "/notifications" },
];

export default function Sidebar() {
  return (
    <div className="w-64 h-screen bg-white shadow-md p-5">
      <h1 className="text-2xl font-bold text-indigo-600 mb-10">
        Workflow
      </h1>

      <ul className="space-y-4">
        {menu.map((item) => (
          <li key={item.name}>
            <Link
              href={item.path}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-100 transition"
            >
              <item.icon size={20} />
              <span>{item.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}