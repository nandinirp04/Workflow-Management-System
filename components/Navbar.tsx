"use client";

import { Bell, Search, Menu, X } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full h-16 bg-white/90 backdrop-blur-lg shadow-lg flex items-center justify-between px-6 lg:px-8">
      {/* Logo/Title */}
      <div className="text-xl font-bold text-gray-800">Workflow Dashboard</div>

      {/* Desktop Search */}
      <div className="hidden md:flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg flex-1 max-w-md mx-8">
        <Search size={18} />
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleSearch}
          className="bg-transparent outline-none flex-1"
        />
      </div>

      {/* Desktop Right Side */}
      <div className="hidden md:flex items-center gap-4">
        <button onClick={() => router.push("/notifications")} className="relative p-1">
          <Bell className="w-5 h-5 text-gray-700" />
          <span className="absolute -top-1 -right-1 bg-red-500 w-3 h-3 rounded-full"></span>
        </button>
        <div className="w-8 h-8 bg-indigo-500 rounded-full"></div>
      </div>

      {/* Mobile Menu Button */}
      <button onClick={() => setIsMobileOpen(true)} className="md:hidden p-1">
        <Menu className="w-6 h-6" />
      </button>

      {/* Mobile Menu Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsMobileOpen(false)} />
      )}
      <div className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl transform transition-transform ${
        isMobileOpen ? 'translate-x-0' : '-translate-x-full'
      } md:hidden z-50 p-6`}>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold">Menu</h2>
          <button onClick={() => setIsMobileOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              className="bg-transparent outline-none flex-1"
            />
          </div>
          <button onClick={() => {
            router.push("/notifications");
            setIsMobileOpen(false);
          }} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100">
            <Bell className="w-5 h-5" />
            Notifications
          </button>
        </div>
      </div>
    </nav>
  );
}