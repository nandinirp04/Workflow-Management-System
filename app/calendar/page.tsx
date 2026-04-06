"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isToday, 
  isSameMonth, 
  parseISO 
} from "date-fns";
import { ChevronLeft, ChevronRight, Plus, Calendar, Clock, Trash2 } from "lucide-react";

// ✅ TypeScript Interfaces
interface Appointment {
  id: number;
  title: string;
  time: string;
  date: string; // YYYY-MM-DD
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newEvent, setNewEvent] = useState<Omit<Appointment, 'id'>>({
    title: "",
    time: "",
    date: format(new Date(), "yyyy-MM-dd"), // ✅ Defaults to today
  });

  // Load appointments from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("calendarAppointments");
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Appointment[];
        setAppointments(parsed);
      } catch (error) {
        console.error("Failed to load appointments:", error);
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("calendarAppointments", JSON.stringify(appointments));
  }, [appointments]);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  // ✅ Typed function
  const getEventsForDate = (date: Date): Appointment[] => {
    return appointments.filter((appt) => 
      format(parseISO(appt.date), "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
    );
  };

  // ✅ Typed event handler with date picker
  const addAppointment = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newEvent.title && newEvent.time && newEvent.date) {
      const appointment: Appointment = {
        ...newEvent,
        id: Date.now(),
        // date is already YYYY-MM-DD from input
      };
      setAppointments([...appointments, appointment]);
      setNewEvent({
        title: "",
        time: "",
        date: format(new Date(), "yyyy-MM-dd"),
      });
      setShowAddModal(false);
    }
  };

  const deleteAppointment = (id: number) => {
    setAppointments(appointments.filter((appt) => appt.id !== id));
  };

  return (
    <div className="space-y-6 p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-100 mb-1">Calendar</h1>
          <p className="text-zinc-300">Manage your appointments and schedule</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-medium flex items-center gap-2 shadow-lg transition-colors"
        >
          <Plus size={20} />
          Add Appointment
        </button>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentDate(subMonths(currentDate, 1))}
          className="p-2 rounded-lg hover:bg-gray-100 text-zinc-200 hover:text-zinc-500 transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-2xl font-bold text-zinc-100">
          {format(currentDate, "MMMM yyyy")}
        </h2>
        <button
          onClick={() => setCurrentDate(addMonths(currentDate, 1))}
          className="p-2 rounded-lg hover:bg-gray-100 text-zinc-200 hover:text-zinc-500 transition-colors"
          aria-label="Next month"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 bg-linear-to-r from-indigo-50 to-purple-50">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="p-4 text-center font-semibold text-gray-700 text-sm uppercase tracking-wide">
              {day}
            </div>
          ))}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7 divide-y divide-gray-100">
          {days.map((day, idx) => {
            const events = getEventsForDate(day);
            const isCurrentMonth = isSameMonth(day, currentDate);
            const today = isToday(day);

            return (
              <div key={idx} className="p-3 h-24 relative group hover:bg-gray-50 transition-colors">
                <div
                  className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center cursor-pointer transition-all font-semibold text-sm hover:scale-110 ${
                    today
                      ? "bg-red-500 text-white shadow-lg scale-105"
                      : isCurrentMonth
                      ? "text-gray-900 hover:bg-indigo-100 hover:scale-105"
                      : "text-gray-400 hover:bg-gray-100"
                  }`}
                  title={format(day, "MMM do, yyyy")}
                  aria-label={format(day, "MMM do, yyyy")}
                >
                  {format(day, "d")}
                </div>

                {/* Event Dots */}
                <div className="absolute bottom-1 left-2 flex flex-col gap-0.5">
                  {events.slice(0, 4).map((event, eIdx) => (
                    <div
                      key={event.id}
                      className="w-1.5 h-1.5 bg-indigo-500 rounded-full shadow-sm hover:bg-indigo-600 transition-colors"
                      title={`${event.title} at ${event.time}`}
                      style={{ transform: `translateY(${eIdx * -3}px)` }}
                    />
                  ))}
                  {events.length > 4 && (
                    <span className="text-xs text-gray-500 font-medium">+{events.length - 4}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-xl">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Calendar size={24} className="text-indigo-600" />
            Today ({format(new Date(), "MMM dd")})
          </h3>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {appointments
              .filter((appt) => appt.date === format(new Date(), "yyyy-MM-dd"))
              .map((appt) => (
                <div 
                  key={appt.id} 
                  className="p-4 bg-linear-to-r from-indigo-50 to-purple-50 rounded-xl flex justify-between items-start group hover:shadow-md transition-all"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{appt.title}</p>
                    <p className="flex items-center gap-2 text-sm text-gray-600 mt-0.5">
                      <Clock size={14} />
                      <span>{appt.time}</span>
                      <span className="text-xs bg-indigo-100 px-2 py-0.5 rounded-full">
                        {appt.date}
                      </span>
                    </p>
                  </div>
                  <button
                    onClick={() => deleteAppointment(appt.id)}
                    className="opacity-0 group-hover:opacity-100 ml-3 text-red-500 hover:text-red-700 p-2 -m-2 rounded-lg hover:bg-red-100 transition-all"
                    title="Delete appointment"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            {appointments.filter((appt) => appt.date === format(new Date(), "yyyy-MM-dd")).length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <Calendar className="mx-auto h-16 w-16 text-gray-400 mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">No appointments today</p>
                <p className="mb-6">Add your first appointment using the button above</p>
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white p-6 rounded-2xl shadow-xl space-y-4">
          <h3 className="text-xl font-semibold mb-4">Quick Stats</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-6 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors">
              <div className="text-3xl font-bold text-indigo-600">{appointments.length}</div>
              <div className="text-sm text-gray-600 mt-1">Total Events</div>
            </div>
            <div className="text-center p-6 bg-green-50 rounded-xl hover:bg-green-100 transition-colors">
              <div className="text-3xl font-bold text-green-600">
                {appointments.filter((appt) => appt.date === format(new Date(), "yyyy-MM-dd")).length}
              </div>
              <div className="text-sm text-gray-600 mt-1">Today</div>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Add Event Modal with Date Picker */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Add Appointment</h2>
            <form onSubmit={addAppointment} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newEvent.title}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setNewEvent({ ...newEvent, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  placeholder="e.g., Client Meeting - ABC Corp"
                  maxLength={100}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={newEvent.date}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setNewEvent({ ...newEvent, date: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm"
                  min={format(new Date(), "yyyy-MM-dd")}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  required
                  value={newEvent.time}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setNewEvent({ ...newEvent, time: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 px-6 border border-gray-200 rounded-xl hover:bg-gray-50 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-xl hover:bg-indigo-700 font-medium shadow-lg transition-all flex items-center justify-center"
                >
                  Add Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}