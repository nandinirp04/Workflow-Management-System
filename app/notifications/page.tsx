"use client";

import { useState, useEffect } from "react";
import { Bell, CheckCircle, Clock, Filter, Trash2 } from "lucide-react";

// ✅ TypeScript Interface
interface Notification {
  id: number;
  text: string;
  category: "info" | "success" | "warning" | "error";
  read: boolean;
  timestamp: string; // ISO date
}

export default function NotificationsPage() {
  // ✅ Typed state
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [showFilters, setShowFilters] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("notifications");
    if (saved) {
      try {
        setNotifications(JSON.parse(saved));
      } catch (error) {
        console.error("Failed to load notifications:", error);
      }
    } else {
      // Seed some demo data
      const demoNotifications: Notification[] = [
        {
          id: Date.now(),
          text: "New client ABC Company added successfully",
          category: "success",
          read: false,
          timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 min ago
        },
        {
          id: Date.now() + 1,
          text: "SEO meeting with XYZ Pvt Ltd at 5:00 PM today",
          category: "info",
          read: false,
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 min ago
        },
        {
          id: Date.now() + 2,
          text: "Ads campaign payment overdue - follow up required",
          category: "warning",
          read: true,
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        },
        {
          id: Date.now() + 3,
          text: "Client feedback received for Content project",
          category: "info",
          read: false,
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
        },
      ];
      setNotifications(demoNotifications);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("notifications", JSON.stringify(notifications));
  }, [notifications]);

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((n) => (n.read ? n : { ...n, read: true }))
    );
  };

  const deleteNotification = (id: number) => {
    if (confirm("Delete this notification?")) {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.read;
    if (filter === "read") return n.read;
    return true;
  });

  const categoryColors = {
    info: "bg-blue-100 text-blue-800 border-blue-200",
    success: "bg-green-100 text-green-800 border-green-200",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
    error: "bg-red-100 text-red-800 border-red-200",
  };

  const getTimeAgo = (timestamp: string): string => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffHours / 24)}d ago`;
  };

  return (
    <div className="space-y-6 p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-100 mb-1">Notifications</h1>
          <p className="text-zinc-400">
            {notifications.length} total • {notifications.filter((n) => !n.read).length} unread
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {notifications.filter((n) => !n.read).length > 0 && (
            <button
              onClick={markAllAsRead}
              className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-xl hover:bg-indigo-700 transition-colors font-medium"
            >
              Mark all read
            </button>
          )}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Toggle filters"
          >
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
          <div className="flex gap-2 flex-wrap">
            {[
              { value: "all" as const, label: "All" },
              { value: "unread" as const, label: "Unread" },
              { value: "read" as const, label: "Read" },
            ].map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setFilter(value)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  filter === value
                    ? "bg-indigo-600 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Notifications List */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="divide-y divide-gray-100 max-h-[70vh] overflow-y-auto">
         {filteredNotifications.map((notification) => (
  <div
    key={notification.id}
    className={`p-6 hover:bg-gray-50 transition-colors ${
      notification.read ? "opacity-75" : ""
    }`}
  >
        <div className="flex items-start gap-4">
                {/* Category Badge */}
                <div
                  className={`shrink-0 w-3 h-3 rounded-full mt-1 ${
                    categoryColors[notification.category as keyof typeof categoryColors]
                  }`}
                />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-semibold text-gray-900 leading-tight pr-2 truncate">
                      {notification.text}
                    </h3>
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="ml-auto -mt-1 p-1 rounded-full hover:bg-indigo-100 text-indigo-600 hover:text-indigo-700 transition-colors"
                        title="Mark as read"
                      >
                        <CheckCircle size={18} />
                      </button>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <span>{getTimeAgo(notification.timestamp)}</span>
                    <div className="w-px h-3 bg-gray-300" />
                    <span className="capitalize">{notification.category}</span>
                  </div>
                </div>
                
                <button
                  onClick={() => deleteNotification(notification.id)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors ml-2"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {filteredNotifications.length === 0 && (
          <div className="text-center py-16">
            <Bell className="mx-auto h-16 w-16 text-gray-400 mb-6" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {filter === "unread" ? "No unread notifications" : "No notifications"}
            </h3>
            <p className="text-gray-500 mb-6">
              {filter === "unread" 
                ? "All notifications have been read" 
                : "Notifications will appear here"
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}