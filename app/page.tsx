"use client";

import { useEffect, useState } from "react";
import { Users, FileText, CheckCircle, Calendar, Clock, TrendingUp, Activity, BarChart3, Plus } from "lucide-react";interface Stats {
  title: string;
  value: number;
  change: number;
  icon: React.ReactNode;
  color: string;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats[]>([
    {
      title: "Total Clients",
      value: 24,
      change: 12,
      icon: <Users className="w-6 h-6" />,
      color: "indigo",
    },
    {
      title: "Active Projects",
      value: 8,
      change: 3,
      icon: <FileText className="w-6 h-6" />,
      color: "green",
    },
    {
      title: "Completed Tasks",
      value: 156,
      change: 28,
      icon: <CheckCircle className="w-6 h-6" />,
      color: "blue",
    },
    {
      title: "Upcoming Meetings",
      value: 5,
      change: -1,
      icon: <Calendar className="w-6 h-6" />,
      color: "purple",
    },
  ]);

  const recentActivities = [
    {
      id: 1,
      title: "New client ABC Corp added",
      time: "2 mins ago",
      type: "success" as const,
    },
    {
      id: 2,
      title: "SEO project marked complete",
      time: "15 mins ago",
      type: "success" as const,
    },
    {
      id: 3,
      title: "Client meeting rescheduled",
      time: "1 hour ago",
      type: "warning" as const,
    },
    {
      id: 4,
      title: "Payment received from XYZ Ltd",
      time: "3 hours ago",
      type: "success" as const,
    },
    {
      id: 5,
      title: "New task assigned - Ads campaign",
      time: "5 hours ago",
      type: "info" as const,
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-indigo-100 p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">
              Dashboard
            </h1>
            <p className="text-xl text-gray-600 max-w-md">
              Welcome back! Here's what's happening with your projects.
            </p>
          </div>
          <div className="flex gap-4">
            <button className="px-8 py-3 bg-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-xl transition-all font-medium flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Schedule Meeting
            </button>
            <button className="px-8 py-3 bg-indigo-600 text-white rounded-2xl shadow-lg hover:shadow-xl hover:bg-indigo-700 transition-all font-medium flex items-center gap-2">
              <Plus className="w-5 h-5" />
              New Client
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-8 mb-12">
        {/* Stats Cards */}
        {stats.map((stat, index) => (
          <div
            key={index}
            className="group bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 hover:border-white"
          >
            <div className="flex items-center justify-between mb-6">
              <div className={`p-3 rounded-2xl bg-linear-to-br ${stat.color === "indigo" ? "from-indigo-100 to-indigo-200" : stat.color === "green" ? "from-green-100 to-green-200" : stat.color === "blue" ? "from-blue-100 to-blue-200" : "from-purple-100 to-purple-200"} shadow-lg`}>
                {stat.icon}
              </div>
              <div className={`text-sm font-medium px-3 py-1 rounded-full ${
                stat.change >= 0 
                  ? "bg-green-100 text-green-800" 
                  : "bg-red-100 text-red-800"
              }`}>
                {stat.change >= 0 ? `+${stat.change}%` : `${stat.change}%`}
              </div>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value.toLocaleString()}</p>
              <p className="text-gray-600 font-medium">{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Recent Activities */}
        <div className="xl:col-span-2 bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-8">
          <div className="flex items-center gap-3 mb-8">
            <Activity className="w-8 h-8 text-indigo-600" />
            <h2 className="text-2xl font-bold text-gray-900">Recent Activity</h2>
          </div>
          
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4 p-4 hover:bg-gray-50 rounded-2xl transition-all group">
                <div className={`w-3 h-3 rounded-full mt-2 shrink-0 ${
                  activity.type === "success" ? "bg-green-500" :
                  activity.type === "warning" ? "bg-yellow-500" :
                  "bg-indigo-500"
                }`}></div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">
                    {activity.title}
                  </p>
                  <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-6">
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <BarChart3 className="w-6 h-6 text-indigo-600" />
              Performance
            </h3>
            <div className="space-y-6">
              <div>
                <p className="text-3xl font-bold text-indigo-600">98.7%</p>
                <p className="text-sm text-gray-600 mt-1">On-time delivery</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-green-600">4.8/5</p>
                <p className="text-sm text-gray-600 mt-1">Client rating</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-purple-600">$12.4K</p>
                <p className="text-sm text-gray-600 mt-1">Monthly revenue</p>
              </div>
            </div>
          </div>

          <div className="bg-linear-to-br from-indigo-500 to-purple-600 text-white rounded-3xl p-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-8 h-8" />
              <h3 className="text-xl font-bold">Growth</h3>
            </div>
            <p className="text-4xl font-bold mb-2">+27%</p>
            <p className="text-indigo-100">This month vs last month</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="max-w-7xl mx-auto mt-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "New Client", icon: Users, href: "/clients", color: "indigo" },
            { title: "Add Task", icon: CheckCircle, href: "/tasks", color: "green" },
            { title: "Schedule Meeting", icon: Calendar, href: "/calendar", color: "blue" },
            { title: "View Reports", icon: BarChart3, href: "/reports", color: "purple" },
          ].map(({ title, icon: Icon, href, color }, index) => (
            <a
              key={index}
              href={href}
              className="group bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/50 hover:shadow-2xl hover:-translate-y-2 hover:border-white transition-all duration-300 flex flex-col items-center gap-4 text-center"
            >
              <div className={`w-16 h-16 bg-linear-to-br ${color === "indigo" ? "from-indigo-100 to-indigo-200" : color === "green" ? "from-green-100 to-green-200" : color === "blue" ? "from-blue-100 to-blue-200" : "from-purple-100 to-purple-200"} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all`}>
                <Icon className="w-8 h-8 text-gray-700" />
              </div>
              <h3 className="font-bold text-lg text-gray-900 group-hover:text-indigo-600 transition-colors">{title}</h3>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}