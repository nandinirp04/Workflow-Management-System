"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { Plus, Edit3, Trash2, Calendar, Clock, Search, Filter, CheckCircle } from "lucide-react";

interface Task {
  id: number;
  text: string;
  done: boolean;
  priority: "low" | "medium" | "high";
  dueDate?: string;
  createdAt: string;
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "pending" | "done">("all");

  // Load tasks from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("tasks");
    if (saved) {
      setTasks(JSON.parse(saved));
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // ✅ Notification function (no hooks needed)
  const addNotification = (text: string, category: "info" | "success" = "info") => {
    const notification = {
      id: Date.now(),
      text,
      category,
      read: false,
      timestamp: new Date().toISOString(),
    };
    const saved = localStorage.getItem("notifications");
    const notifications = saved ? JSON.parse(saved) : [];
    localStorage.setItem("notifications", JSON.stringify([...notifications, notification]));
  };

  const addTask = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newTask.trim()) return;

    const task: Task = {
      id: Date.now(),
      text: newTask.trim(),
      done: false,
      priority: "medium",
      createdAt: new Date().toISOString(),
    };

    setTasks([task, ...tasks]);
    setNewTask("");
    
    // ✅ Success confirmation
    addNotification("✅ New task added successfully!", "success");
    
    // Close modal if open
    if (showForm) setShowForm(false);
  };

  const toggleTask = (id: number) => {
    setTasks(tasks.map((task) =>
      task.id === id ? { ...task, done: !task.done } : task
    ));
    addNotification("Task status updated", "info");
  };

  const deleteTask = (id: number) => {
    if (confirm("Delete this task?")) {
      setTasks(tasks.filter((t) => t.id !== id));
      addNotification("Task deleted", "info");
    }
  };

  const editTask = (task: Task) => {
    setEditingTask(task);
    setNewTask(task.text);
    setShowForm(true);
  };

  const updateTask = (e: FormEvent) => {
    e.preventDefault();
    if (!newTask.trim() || !editingTask) return;

    setTasks(tasks.map((task) =>
      task.id === editingTask.id ? { ...task, text: newTask.trim() } : task
    ));
    setNewTask("");
    setEditingTask(null);
    setShowForm(false);
    addNotification("Task updated successfully!", "success");
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.text.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = 
      filter === "all" || 
      (filter === "pending" && !task.done) || 
      (filter === "done" && task.done);
    return matchesSearch && matchesFilter;
  });

  const getPriorityColor = (priority: Task["priority"]) => {
    const colors: Record<Task["priority"], string> = {
      high: "bg-red-100 text-red-800",
      medium: "bg-yellow-100 text-yellow-800",
      low: "bg-green-100 text-green-800",
    };
    return colors[priority];
  };

  const getRelativeTime = (isoString: string) => {
    const now = new Date().getTime();
    const time = new Date(isoString).getTime();
    const diffMs = now - time;
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    return `${diffHours}h ago`;
  };

  return (
    <div className="space-y-6 p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-50 mb-1">Task Manager</h1>
          <p className="text-zinc-100">
            {tasks.length} total • {tasks.filter(t => !t.done).length} pending
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-medium flex items-center gap-2 shadow-lg transition-all"
        >
          <Plus size={20} />
          Add Task
        </button>
      </div>

      {/* Quick Add (top of page) */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Quick add task... (press Enter)"
          value={newTask}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setNewTask(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
          className="flex-1 px-4 py-3 border text-white border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none placeholder-gray-500"
        />
        <button
          onClick={addTask}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg transition-all whitespace-nowrap"
        >
          Add Task
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {["all", "pending", "done"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status as any)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filter === status
                ? "bg-indigo-600 text-white shadow-lg"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md"
            }`}
          >
            {status === "all" ? "All" : status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-50 w-5 h-5" />
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
          className="w-full pl-11 pr-4 py-3 border text-white border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
        />
      </div>

      {/* Tasks List */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="divide-y divide-gray-100 max-h-[60vh] overflow-y-auto">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`p-6 hover:bg-gray-50 transition-all cursor-pointer group ${
                task.done ? "opacity-75" : ""
              }`}
              onClick={() => !task.done && editTask(task)}
            >
              <div className="flex items-start gap-4">
                {/* Checkbox */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleTask(task.id);
                  }}
                  className={`mt-1 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all font-semibold text-sm shrink-0 ${
                    task.done
                      ? "bg-green-500 border-green-500 text-white shadow-md"
                      : "border-gray-300 hover:border-indigo-500 hover:shadow-md hover:scale-105"
                  }`}
                >
                  {task.done ? "✓" : ""}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <h3
                      className={`font-semibold pr-4 truncate leading-tight text-lg ${
                        task.done ? "line-through" : ""
                      }`}
                    >
                      {task.text}
                    </h3>
                    <div className="flex items-center gap-2 ml-auto shrink-0">
                      {task.dueDate && (
                        <div className="text-xs bg-gray-100 px-2 py-1 rounded-full flex items-center gap-1 text-gray-700">
                          <Calendar size={12} />
                          {new Date(task.dueDate).toLocaleDateString("en-US", { 
                            month: "short", 
                            day: "numeric" 
                          })}
                        </div>
                      )}
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${getPriorityColor(task.priority)}`}>
                        {task.priority.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>{getRelativeTime(task.createdAt)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all ml-4 shrink-0">
                  <button
                    onClick={() => editTask(task)}
                    className="p-2 hover:bg-indigo-100 rounded-xl text-indigo-600 hover:text-indigo-700 transition-all hover:scale-105"
                    title="Edit"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="p-2 hover:bg-red-100 rounded-xl text-red-600 hover:text-red-700 transition-all hover:scale-105"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredTasks.length === 0 && (
          <div className="text-center py-20 border-t border-gray-100">
            <Clock className="mx-auto h-20 w-20 text-gray-400 mb-6 opacity-50" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No tasks match your search</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Try adjusting your search term or filter, or add your first task above
            </p>
            <button
              onClick={() => {
                setShowForm(true);
                setNewTask("");
                setEditingTask(null);
              }}
              className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-indigo-700 shadow-xl transition-all flex items-center gap-2 mx-auto"
            >
              <Plus size={20} />
              Create First Task
            </button>
          </div>
        )}
      </div>

      {/* ✅ Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingTask ? "Edit Task" : "Add New Task"}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  setNewTask("");
                  setEditingTask(null);
                }}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={editingTask ? updateTask : addTask} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Task Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newTask}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setNewTask(e.target.value)}
                  className="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm transition-all text-lg placeholder-gray-500"
                  placeholder="What needs to be done?"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Priority</label>
                  <select
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    defaultValue="medium"
                  >
                    <option value="low">🟢 Low</option>
                    <option value="medium">🟡 Medium</option>
                    <option value="high">🔴 High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Due Date</label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setNewTask("");
                    setEditingTask(null);
                  }}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 px-8 py-4 rounded-2xl font-semibold transition-all shadow-sm border"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-semibold shadow-xl transition-all hover:shadow-2xl hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                  <Plus size={20} />
                  {editingTask ? "Update Task" : "Create Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}