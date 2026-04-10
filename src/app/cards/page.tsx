"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import AuthGuard from "@/components/AuthGuard";
import { getStoredStudents, saveStudents, Student } from "@/lib/data";

export default function CardsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");
  const [actionMessage, setActionMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState<{
    studentId: string;
    action: "deactivate" | "activate";
  } | null>(null);

  useEffect(() => {
    setStudents(getStoredStudents());
  }, []);

  const showMessage = (msg: string) => {
    setActionMessage(msg);
    setTimeout(() => setActionMessage(""), 4000);
  };

  const handleToggleCard = (studentId: string, action: "deactivate" | "activate") => {
    const newStatus: "active" | "inactive" = action === "deactivate" ? "inactive" : "active";
    const updated = students.map((s) =>
      s.studentId === studentId
        ? { ...s, fingerprintStatus: newStatus }
        : s
    );
    setStudents(updated);
    saveStudents(updated);
    setConfirmAction(null);
    if (action === "deactivate") {
      showMessage(`🔴 Fingerprint deactivated. Student must re-enroll to scan in.`);
    } else {
      showMessage(`🟢 Fingerprint reactivated successfully. Student can now scan in.`);
    }
  };

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.fingerprintId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || s.fingerprintStatus === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const activeCount = students.filter((s) => s.fingerprintStatus === "active").length;
  const inactiveCount = students.filter((s) => s.fingerprintStatus === "inactive").length;

  return (
    <AuthGuard allowedRoles={["admin", "teacher"]}>
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <span>👆</span> Fingerprint Manager
          </h1>
          <p className="text-slate-400 mt-1">
            Activate, deactivate, or re-enroll student fingerprints. Manage sensor access.
          </p>
        </div>

        {actionMessage && (
          <div className="mb-4 p-3 bg-slate-800 border border-slate-600 rounded-lg text-slate-200 text-sm">
            {actionMessage}
          </div>
        )}

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 text-center">
            <p className="text-3xl font-bold text-blue-400">{students.length}</p>
            <p className="text-slate-400 text-sm mt-1">Total Enrolled</p>
          </div>
          <div className="bg-slate-800 rounded-xl p-4 border border-green-700/50 text-center">
            <p className="text-3xl font-bold text-green-400">{activeCount}</p>
            <p className="text-slate-400 text-sm mt-1">Active</p>
          </div>
          <div className="bg-slate-800 rounded-xl p-4 border border-red-700/50 text-center">
            <p className="text-3xl font-bold text-red-400">{inactiveCount}</p>
            <p className="text-slate-400 text-sm mt-1">Inactive</p>
          </div>
        </div>

        {confirmAction && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 border border-slate-600 rounded-xl p-6 max-w-md w-full">
              <h3 className="text-white font-semibold text-lg mb-2">
                {confirmAction.action === "deactivate"
                  ? "⚠️ Deactivate Fingerprint?"
                  : "✅ Reactivate Fingerprint?"}
              </h3>
              <p className="text-slate-400 text-sm mb-4">
                {confirmAction.action === "deactivate"
                  ? "This will prevent the student from scanning in. They will need to re-enroll to use the fingerprint sensor."
                  : "This will allow the student to scan in again with their fingerprint."}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() =>
                    handleToggleCard(confirmAction.studentId, confirmAction.action)
                  }
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium"
                >
                  {confirmAction.action === "deactivate" ? "Deactivate" : "Reactivate"}
                </button>
                <button
                  onClick={() => setConfirmAction(null)}
                  className="flex-1 px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg text-sm font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-slate-800 rounded-xl border border-slate-700 mb-6">
          <div className="p-4 border-b border-slate-700 flex flex-wrap gap-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, student ID, or fingerprint ID..."
              className="flex-1 min-w-[200px] bg-slate-900 border border-slate-600 text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
            />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as "all" | "active" | "inactive")}
              className="bg-slate-900 border border-slate-600 text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left px-6 py-3 text-slate-400 text-sm font-medium">Student</th>
                  <th className="text-left px-6 py-3 text-slate-400 text-sm font-medium">Student ID</th>
                  <th className="text-left px-6 py-3 text-slate-400 text-sm font-medium">Class</th>
                  <th className="text-left px-6 py-3 text-slate-400 text-sm font-medium">Fingerprint ID</th>
                  <th className="text-left px-6 py-3 text-slate-400 text-sm font-medium">Fingerprint Status</th>
                  <th className="text-left px-6 py-3 text-slate-400 text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                      {students.length === 0 ? "No students registered yet." : "No students match your filters."}
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student) => (
                    <tr key={student.id} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                      <td className="px-6 py-4">
                        <p className="text-white font-medium">{student.name}</p>
                        <p className="text-slate-500 text-xs">{student.parentName}</p>
                      </td>
                      <td className="px-6 py-4 text-slate-400 text-sm">{student.studentId}</td>
                      <td className="px-6 py-4 text-slate-400 text-sm">Class {student.class}</td>
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm text-slate-300 bg-slate-900 px-2 py-1 rounded">
                          {student.fingerprintId}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className={`w-2.5 h-2.5 rounded-full ${
                            student.fingerprintStatus === "active" ? "bg-green-400" : "bg-red-400"
                          }`}></span>
                          <span className={`text-sm font-medium ${
                            student.fingerprintStatus === "active" ? "text-green-400" : "text-red-400"
                          }`}>
                            {student.fingerprintStatus === "active" ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {student.fingerprintStatus === "active" ? (
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
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 bg-amber-950/50 border border-amber-700/50 rounded-xl p-4 flex items-start gap-3">
          <span className="text-amber-400 text-xl mt-0.5">💡</span>
          <div>
            <p className="text-amber-300 font-medium text-sm">Fingerprint Re-enrollment</p>
            <p className="text-amber-500 text-xs mt-0.5">
              When a student's fingerprint access is deactivated, they cannot scan in.
              The student must re-enroll their fingerprint at the school administration office to regain access.
              Inactive fingerprints will trigger the Red LED and buzzer error at the scanner.
            </p>
          </div>
        </div>
      </main>
    </div>
    </AuthGuard>
  );
}
