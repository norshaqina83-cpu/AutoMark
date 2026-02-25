"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import AuthGuard from "@/components/AuthGuard";
import { useAuth } from "@/lib/auth";
import { students, attendanceRecords, AttendanceRecord } from "@/lib/data";

function ParentPortalContent() {
  const { user } = useAuth();

  // Admins can select any student; parents are locked to their linked child
  const isAdmin = user?.role === "admin";
  const defaultStudentId = isAdmin
    ? students[0].studentId
    : (user?.linkedStudentId ?? students[0].studentId);

  const [selectedStudentId, setSelectedStudentId] = useState(defaultStudentId);
  const [records, setRecords] = useState<AttendanceRecord[]>([...attendanceRecords]);

  // Absence reason editing state
  const [editingReasonId, setEditingReasonId] = useState<string | null>(null);
  const [reasonDraft, setReasonDraft] = useState("");
  const [reasonSaved, setReasonSaved] = useState("");

  const selectedStudent = students.find((s) => s.studentId === selectedStudentId)!;
  const studentRecords = records
    .filter((r) => r.studentId === selectedStudentId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const presentCount = studentRecords.filter((r) => r.status === "present").length;
  const lateCount = studentRecords.filter((r) => r.status === "late").length;
  const absentCount = studentRecords.filter((r) => r.status === "absent").length;
  const totalDays = studentRecords.length;
  const attendanceRate =
    totalDays > 0 ? Math.round(((presentCount + lateCount) / totalDays) * 100) : 0;

  const handleStartEditReason = (record: AttendanceRecord) => {
    setEditingReasonId(record.id);
    setReasonDraft(record.absentReason ?? "");
  };

  const handleSaveReason = (id: string) => {
    setRecords((prev) =>
      prev.map((r) => (r.id === id ? { ...r, absentReason: reasonDraft.trim() } : r))
    );
    setEditingReasonId(null);
    setReasonSaved("✅ Absence reason submitted. The teacher has been notified.");
    setTimeout(() => setReasonSaved(""), 4000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <span>👨‍👩‍👧</span> Parent Portal
          </h1>
          <p className="text-slate-400 mt-1">
            Monitor your child&apos;s attendance and submit absence reasons.
          </p>
        </div>

        {/* Info notice */}
        <div className="mb-6 p-3 bg-blue-950/50 border border-blue-700/50 rounded-lg flex items-center gap-3">
          <span className="text-blue-400">ℹ️</span>
          <p className="text-blue-300 text-sm">
            You can view attendance records and submit a reason for any absence. Teachers and
            administrators will be able to see your submitted reasons.
          </p>
        </div>

        {/* Student Selector — only admins can switch students */}
        {isAdmin ? (
          <div className="bg-slate-800 rounded-xl p-5 border border-slate-700 mb-6">
            <label className="block text-slate-400 text-sm mb-2">Select Student (Admin View)</label>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="bg-slate-900 border border-slate-600 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 w-full max-w-sm"
            >
              {students.map((s) => (
                <option key={s.studentId} value={s.studentId}>
                  {s.name} — Class {s.class}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="bg-slate-800 rounded-xl p-5 border border-slate-700 mb-6">
            <p className="text-slate-400 text-sm mb-1">Viewing attendance for</p>
            <p className="text-white font-semibold text-lg">{selectedStudent?.name}</p>
            <p className="text-slate-500 text-xs mt-0.5">
              Class {selectedStudent?.class} · {selectedStudent?.studentId}
            </p>
          </div>
        )}

        {/* Student Info Card */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 mb-6">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-2xl font-bold text-white">
                {selectedStudent.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-white text-xl font-semibold">{selectedStudent.name}</h2>
                <p className="text-slate-400 text-sm">
                  {selectedStudent.studentId} · Class {selectedStudent.class}
                </p>
                <p className="text-slate-500 text-xs mt-0.5">
                  RFID: {selectedStudent.rfidTag} ·{" "}
                  <span
                    className={
                      selectedStudent.rfidStatus === "active"
                        ? "text-green-400"
                        : "text-red-400"
                    }
                  >
                    Card {selectedStudent.rfidStatus}
                  </span>
                </p>
              </div>
            </div>

            {/* Attendance Rate */}
            <div className="text-center">
              <div
                className={`text-4xl font-bold ${
                  attendanceRate >= 80
                    ? "text-green-400"
                    : attendanceRate >= 60
                    ? "text-yellow-400"
                    : "text-red-400"
                }`}
              >
                {attendanceRate}%
              </div>
              <p className="text-slate-400 text-sm">Attendance Rate</p>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-5 border-t border-slate-700">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-400">{presentCount}</p>
              <p className="text-slate-400 text-sm">Days Present</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-400">{lateCount}</p>
              <p className="text-slate-400 text-sm">Days Late</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-400">{absentCount}</p>
              <p className="text-slate-400 text-sm">Days Absent</p>
            </div>
          </div>
        </div>

        {/* Absence Alert */}
        {absentCount > 0 && (
          <div className="mb-6 p-4 bg-red-950/50 border border-red-700/50 rounded-xl flex items-start gap-3">
            <span className="text-red-400 text-xl mt-0.5">🚨</span>
            <div>
              <p className="text-red-300 font-medium">Absence Alert</p>
              <p className="text-red-400 text-sm mt-0.5">
                {selectedStudent.name} has been absent {absentCount} time
                {absentCount !== 1 ? "s" : ""}. You can submit a reason for each absence below.
              </p>
            </div>
          </div>
        )}

        {/* Inactive Card Alert */}
        {selectedStudent.rfidStatus === "inactive" && (
          <div className="mb-6 p-4 bg-amber-950/50 border border-amber-700/50 rounded-xl flex items-start gap-3">
            <span className="text-amber-400 text-xl mt-0.5">⚠️</span>
            <div>
              <p className="text-amber-300 font-medium">RFID Card Inactive</p>
              <p className="text-amber-400 text-sm mt-0.5">
                Your child&apos;s RFID card has been deactivated. They will not be able to scan in until
                a replacement card is issued. Please contact the school administration.
              </p>
            </div>
          </div>
        )}

        {/* Reason saved message */}
        {reasonSaved && (
          <div className="mb-4 p-3 bg-green-900/50 border border-green-700 rounded-lg text-green-300 text-sm">
            {reasonSaved}
          </div>
        )}

        {/* Attendance History */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700">
            <h2 className="text-white font-semibold">Attendance History</h2>
            <p className="text-slate-500 text-xs mt-0.5">
              Click &quot;Add Reason&quot; on any absent record to submit an explanation
            </p>
          </div>

          {studentRecords.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <p className="text-4xl mb-3">📋</p>
              <p>No attendance records found for this student.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-700/50">
              {studentRecords.map((record) => (
                <div key={record.id} className="px-6 py-4 hover:bg-slate-700/20 transition-colors">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    {/* Left: date + status */}
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-white text-sm font-medium">{record.date}</p>
                        <p className="text-slate-500 text-xs">
                          Class {record.class}
                          {record.time ? ` · Scanned at ${record.time}` : " · No scan"}
                        </p>
                      </div>
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                          record.status === "present"
                            ? "bg-green-900 text-green-300"
                            : record.status === "late"
                            ? "bg-yellow-900 text-yellow-300"
                            : "bg-red-900 text-red-300"
                        }`}
                      >
                        {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                      </span>
                    </div>

                    {/* Right: action (only for absent records) */}
                    {record.status === "absent" && editingReasonId !== record.id && (
                      <button
                        onClick={() => handleStartEditReason(record)}
                        className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded text-xs font-medium transition-colors shrink-0"
                      >
                        {record.absentReason ? "✏️ Edit Reason" : "📝 Add Reason"}
                      </button>
                    )}
                  </div>

                  {/* Absence reason display / edit */}
                  {record.status === "absent" && (
                    <div className="mt-3">
                      {editingReasonId === record.id ? (
                        <div className="space-y-2">
                          <textarea
                            value={reasonDraft}
                            onChange={(e) => setReasonDraft(e.target.value)}
                            placeholder="Explain the reason for absence (e.g. sick, family emergency, doctor appointment)…"
                            rows={3}
                            className="w-full bg-slate-900 border border-blue-500 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none resize-none placeholder-slate-500"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleSaveReason(record.id)}
                              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium transition-colors"
                            >
                              Submit Reason
                            </button>
                            <button
                              onClick={() => setEditingReasonId(null)}
                              className="px-4 py-1.5 bg-slate-600 hover:bg-slate-500 text-white rounded text-xs font-medium transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : record.absentReason ? (
                        <div className="flex items-start gap-2 p-3 bg-blue-950/40 border border-blue-700/40 rounded-lg">
                          <span className="text-blue-400 text-sm mt-0.5">💬</span>
                          <div>
                            <p className="text-blue-300 text-xs font-medium mb-0.5">Reason submitted by parent:</p>
                            <p className="text-slate-300 text-sm">{record.absentReason}</p>
                          </div>
                        </div>
                      ) : (
                        <p className="text-slate-600 text-xs italic">No reason submitted yet.</p>
                      )}

                      {/* Teacher note (read-only for parents) */}
                      {record.teacherNote && (
                        <div className="mt-2 flex items-start gap-2 p-3 bg-purple-950/40 border border-purple-700/40 rounded-lg">
                          <span className="text-purple-400 text-sm mt-0.5">📌</span>
                          <div>
                            <p className="text-purple-300 text-xs font-medium mb-0.5">Teacher note:</p>
                            <p className="text-slate-300 text-sm">{record.teacherNote}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Corrected by note */}
                  {record.correctedBy && (
                    <p className="mt-2 text-yellow-500 text-xs">✏️ Corrected by {record.correctedBy}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function ParentPage() {
  return (
    <AuthGuard allowedRoles={["parent", "admin"]}>
      <ParentPortalContent />
    </AuthGuard>
  );
}
