"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { Search, Plus, Edit3, Trash2, Phone } from "lucide-react";

// ✅ TypeScript Interface
interface Client {
  id: number;
  name: string;
  phone: string;
  title: string;
  type: string;
  status: "Pending" | "Active" | "Completed" | "Cancelled";
  remark: string;
}

export default function ClientsPage() {
  // ✅ Proper typing with initial empty array
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  
  const [formData, setFormData] = useState<Client>({
    id: Date.now(),
    name: "",
    phone: "",
    title: "",
    type: "SEO",
    status: "Pending",
    remark: "",
  });

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("clients");
    if (saved) {
      try {
        const parsedClients = JSON.parse(saved) as Client[];
        setClients(parsedClients);
      } catch (error) {
        console.error("Failed to load clients:", error);
      }
    }
  }, []);

  // Save to localStorage & update filtered
  useEffect(() => {
    localStorage.setItem("clients", JSON.stringify(clients));
    setFilteredClients(clients);
  }, [clients]);

  // Search filter
  useEffect(() => {
    const filtered = clients.filter(
      (client) =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.phone.includes(searchTerm)
    );
    setFilteredClients(filtered);
  }, [searchTerm, clients]);

  // ✅ Typed status styles
  const statusStyles: Record<Client["status"], string> = {
    Active: "bg-green-100 text-green-800 border border-green-200",
    Pending: "bg-yellow-100 text-yellow-800 border border-yellow-200",
    Completed: "bg-blue-100 text-blue-800 border border-blue-200",
    Cancelled: "bg-red-100 text-red-800 border border-red-200",
  };

  // ✅ Typed event handlers
  const addOrUpdateClient = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.title) return;

    if (editingClient) {
      setClients(clients.map((c) => (c.id === editingClient.id ? formData : c)));
    } else {
      setClients([...clients, formData]);
    }
    resetForm();
  };

  const deleteClient = (id: number) => {
    if (confirm("Delete this client?")) {
      setClients(clients.filter((c) => c.id !== id));
    }
  };

  const editClient = (client: Client) => {
    setEditingClient(client);
    setFormData(client);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      id: Date.now(),
      name: "",
      phone: "",
      title: "",
      type: "SEO",
      status: "Pending",
      remark: "",
    });
    setEditingClient(null);
    setShowForm(false);
  };

  const handleInputChange = (field: keyof Client, value: string) => {
    setFormData({ ...formData, [field]: value as any });
  };

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-100">
            Clients ({clients.length})
          </h1>
          <p className="text-neutral-300">Manage your client projects and status</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-zinc-50 px-6 py-2.5 rounded-xl font-medium flex items-center gap-2 shadow-lg transition-colors"
        >
          <Plus size={20} />
          Add Client
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text- w-5 h-5" />
        <input
          type="text"
          placeholder="Search clients, pro jects, or phone..."
          value={searchTerm}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
          className="w-full pl-11 pr-4 py-3 border text-zinc-100 border-zinc-50 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
        />
      </div>

      {/* Clients Table */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-linear-to-r from-indigo-50 to-purple-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Project
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Remark
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredClients.map((client: Client) => (
                <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{client.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Phone size={16} className="text-gray-400" />
                      <a
                        href={`tel:${client.phone}`}
                        className="text-indigo-600 hover:text-indigo-800 font-medium"
                      >
                        {client.phone}
                      </a>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{client.title}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex px-2.5 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-800">
                      {client.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2.5 py-1 text-xs font-medium border rounded-full ${
                        statusStyles[client.status]
                      }`}
                    >
                      {client.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                    {client.remark}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button
                      onClick={() => editClient(client)}
                      className="text-indigo-600 hover:text-indigo-900 p-1 -m-1 rounded-lg hover:bg-indigo-100 transition-colors"
                      title="Edit"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => deleteClient(client.id)}
                      className="text-red-600 hover:text-red-900 p-1 -m-1 rounded-lg hover:bg-red-100 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredClients.length === 0 && (
          <div className="text-center py-12">
            <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No clients found
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm ? "Try adjusting your search" : "Get started by adding a client"}
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-indigo-700 transition-colors"
            >
              Add Client
            </button>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingClient ? "Edit Client" : "Add New Client"}
              </h2>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-gray-600 p-1 -m-1 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={addOrUpdateClient} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleInputChange("name", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  placeholder="Enter company name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleInputChange("phone", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleInputChange("title", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  placeholder="Project name"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                      handleInputChange("type", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  >
                    <option value="SEO">SEO</option>
                    <option value="Ads">Ads</option>
                    <option value="Content">Content</option>
                    <option value="General">General</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                      handleInputChange("status", e.target.value as Client["status"])
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Active">Active</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Remark</label>
                <textarea
                  value={formData.remark}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                    handleInputChange("remark", e.target.value)
                  }
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-vertical"
                  placeholder="Additional notes..."
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-gray-100 text-gray-900 px-6 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700 shadow-lg transition-all"
                >
                  {editingClient ? "Update Client" : "Add Client"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}