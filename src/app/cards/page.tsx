"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import AuthGuard from "@/components/AuthGuard";
import { students as initialStudents, Student } from "@/lib/data";

export default function CardsPage() {
  const [students, setStudents] = useState<Student[]>([...initialStudents]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");
  const [actionMessage, setActionMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState<{
    studentId: string;
    action: "deactivate" | "activate";
  } | null>(null);

  const showMessage = (msg: string) => {
    setActionMessage(msg);
    setTimeout(() => setActionMessage(""), 4000);
  };

  const handleToggleCard = (studentId: string, action: "deactivate" | "activate") => {
    setStudents((prev) =>
      prev.map((s) =>
        s.studentId === studentId
          ? { ...s, rfidStatus: action === "deactivate" ? "inactive" : "active" }
          : s
      )
    );
    setConfirmAction(null);
    if (action === "deactivate") {
      showMessage(`🔴 Card deactivated. Student must pay replacement fee to get a new card.`);
    } else {
      showMessage(`🟢 Card reactivated successfully. Student can now scan in.`);
    }
  };

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.rfidTag.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || s.rfidStatus === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const activeCount = students.filter((s) => s.rfidStatus === "active").length;
  const inactiveCount = students.filter((s) => s.rfidStatus === "inactive").length;

  return (
    <AuthGuard allowedRoles={["admin", "teacher"]}>
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <span>💳</span> RFID Card Manager
          </h1>
          <p className="text-slate-400 mt-1">
            Activate, deactivate, or renew student RFID cards. Manage lost or misplaced cards.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 text-center">
            <p className="text-3xl font-bold text-blue-400">{students.length}</p>
            <p className="text-slate-400 text-sm mt-1">Total Cards</p>
          </div>
          <div className="bg-slate-800 rounded-xl p-4 border border-green-700/50 text-center">
            <p className="text-3xl font-bold text-green-400">{activeCount}</p>
            <p className="text-slate-400 text-sm mt-1">Active</p>
          </div>
          <div className="bg-slate-800 rounded-xl p-4 border border-red-700/50 text-center">
            <p className="text-3xl font-bold text-red-400">{inactiveCount}</p>
            <p className="text-slate-400 text-sm mt-1">Inactive / Lost</p>
          </div>
        </div>

        {/* Action Message */}
        {actionMessage && (
          <div className="mb-4 p-3 bg-slate-800 border border-slate-600 rounded-lg text-slate-200 text-sm">
            {actionMessage}
          </div>
        )}

        {/* Confirm Dialog */}
        {confirmAction && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 border border-slate-600 rounded-xl p-6 max-w-md w-full">
              <h3 className="text-white font-semibold text-lg mb-2">
                {confirmAction.action === "deactivate"
                  ? "⚠️ Deactivate RFID Card?"
                  : "✅ Reactivate RFID Card?"}
              </h3>
              <p className="text-slate-400 text-sm mb-4">
                {confirmAction.action === "deactivate"
                  ? "This will prevent the student from scanning in. They will need to pay a replacement fee to get a new card."
                  : "This will allow the student to scan in again with their card."}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() =>
                    handleToggleCard(confirmAction.studentId, confirmAction.action)
                  }
                  className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    confirmAction.action === "deactivate"
                      ? "bg-red-600 hover:bg-red-700 text-white"
                      : "bg-green-600 hover:bg-green-700 text-white"
                  }`}
                >
                  {confirmAction.action === "deactivate" ? "Deactivate Card" : "Reactivate Card"}
                </button>
                <button
                  onClick={() => setConfirmAction(null)}
                  className="flex-1 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Search & Filter */}
        <div className="bg-slate-800 rounded-xl p-5 border border-slate-700 mb-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-48">
              <input
                type="text"
                placeholder="Search by name, student ID, or RFID tag..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-600 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 placeholder-slate-500"
              />
            </div>
            <div className="flex gap-2">
              {(["all", "active", "inactive"] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors capitalize ${
                    filterStatus === status
                      ? "bg-blue-600 text-white"
                      : "bg-slate-900 text-slate-400 hover:bg-slate-700"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Cards Table */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700">
            <h2 className="text-white font-semibold">
              Student RFID Cards ({filteredStudents.length})
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700 bg-slate-900/50">
                  <th className="text-left px-6 py-3 text-slate-400 text-sm font-medium">Student</th>
                  <th className="text-left px-6 py-3 text-slate-400 text-sm font-medium">Student ID</th>
                  <th className="text-left px-6 py-3 text-slate-400 text-sm font-medium">Class</th>
                  <th className="text-left px-6 py-3 text-slate-400 text-sm font-medium">RFID Tag</th>
                  <th className="text-left px-6 py-3 text-slate-400 text-sm font-medium">Card Status</th>
                  <th className="text-left px-6 py-3 text-slate-400 text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr
                    key={student.id}
                    className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <p className="text-white font-medium">{student.name}</p>
                      <p className="text-slate-500 text-xs">{student.parentName}</p>
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-sm">{student.studentId}</td>
                    <td className="px-6 py-4 text-slate-400 text-sm">Class {student.class}</td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm text-slate-300 bg-slate-900 px-2 py-1 rounded">
                        {student.rfidTag}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2.5 h-2.5 rounded-full ${
                            student.rfidStatus === "active"
                              ? "bg-green-400"
                              : "bg-red-400"
                          }`}
                        ></span>
                        <span
                          className={`text-sm font-medium ${
                            student.rfidStatus === "active"
                              ? "text-green-400"
                              : "text-red-400"
                          }`}
                        >
                          {student.rfidStatus === "active" ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {student.rfidStatus === "active" ? (
                          <button
                            onClick={() =>
                              setConfirmAction({
                                studentId: student.studentId,
                                action: "deactivate",
                              })
                            }
                            className="px-3 py-1.5 bg-red-900/50 hover:bg-red-800 border border-red-700 text-red-300 rounded text-xs font-medium transition-colors"
                          >
                            🔴 Deactivate
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              setConfirmAction({
                                studentId: student.studentId,
                                action: "activate",
                              })
                            }
                            className="px-3 py-1.5 bg-green-900/50 hover:bg-green-800 border border-green-700 text-green-300 rounded text-xs font-medium transition-colors"
                          >
                            🟢 Reactivate
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-amber-950/50 border border-amber-700/50 rounded-xl p-4 flex items-start gap-3">
          <span className="text-amber-400 text-xl mt-0.5">💡</span>
          <div>
            <p className="text-amber-300 font-medium text-sm">Replacement Fee Policy</p>
            <p className="text-amber-500 text-xs mt-0.5">
              When a student loses their RFID card, deactivate it immediately to prevent misuse.
              The student must pay the replacement fee before a new card is issued and reactivated.
              Inactive cards will trigger the Red LED and buzzer error at the scanner.
            </p>
          </div>
        </div>
      </main>
    </div>
    </AuthGuard>
  );
}
