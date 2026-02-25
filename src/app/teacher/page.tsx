"use client";

import { useState, useRef } from "react";
import Navbar from "@/components/layout/Navbar";
import AuthGuard from "@/components/AuthGuard";
import { attendanceRecords, students, classes, AttendanceRecord } from "@/lib/data";

export default function TeacherPage() {
  const [selectedClass, setSelectedClass] = useState("10A");
  const [selectedDate, setSelectedDate] = useState("2026-02-25");
  const [records, setRecords] = useState<AttendanceRecord[]>([...attendanceRecords]);
  const idCounter = useRef(100);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editStatus, setEditStatus] = useState<"present" | "absent" | "late">("present");
  const [editNote, setEditNote] = useState("");
  const [saveMessage, setSaveMessage] = useState("");

  // Note editing state (separate from status editing)
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState("");

  const filteredRecords = records.filter(
    (r) => r.class === selectedClass && r.date === selectedDate
  );

  // Students in this class not yet in records for this date
  const classStudents = students.filter((s) => s.class === selectedClass);
  const recordedStudentIds = filteredRecords.map((r) => r.studentId);
  const unrecordedStudents = classStudents.filter(
    (s) => !recordedStudentIds.includes(s.studentId)
  );

  const handleEdit = (record: AttendanceRecord) => {
    setEditingId(record.id);
    setEditStatus(record.status);
    setEditNote(record.teacherNote ?? "");
  };

  const handleSave = (id: string) => {
    setRecords((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, status: editStatus, correctedBy: "Teacher", teacherNote: editNote.trim() || r.teacherNote }
          : r
      )
    );
    setEditingId(null);
    setSaveMessage("✅ Attendance record updated successfully.");
    setTimeout(() => setSaveMessage(""), 3000);
  };

  const handleStartEditNote = (record: AttendanceRecord) => {
    setEditingNoteId(record.id);
    setNoteDraft(record.teacherNote ?? "");
  };

  const handleSaveNote = (id: string) => {
    setRecords((prev) =>
      prev.map((r) => (r.id === id ? { ...r, teacherNote: noteDraft.trim() } : r))
    );
    setEditingNoteId(null);
    setSaveMessage("✅ Note saved.");
    setTimeout(() => setSaveMessage(""), 3000);
  };

  const handleAddAbsent = (studentId: string, studentName: string) => {
    const newRecord: AttendanceRecord = {
      id: `a${(idCounter.current++).toString()}`,
      studentId,
      studentName,
      class: selectedClass,
      date: selectedDate,
      time: "",
      status: "absent",
      rfidTag: students.find((s) => s.studentId === studentId)?.rfidTag || "",
    };
    setRecords((prev) => [...prev, newRecord]);
  };

  const presentCount = filteredRecords.filter((r) => r.status === "present").length;
  const lateCount = filteredRecords.filter((r) => r.status === "late").length;
  const absentCount = filteredRecords.filter((r) => r.status === "absent").length;

  return (
    <AuthGuard allowedRoles={["admin", "teacher"]}>
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <span>👩‍🏫</span> Teacher Portal
          </h1>
          <p className="text-slate-400 mt-1">
            View and manage class attendance. Correct RFID scan errors and add notes.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-slate-800 rounded-xl p-5 border border-slate-700 mb-6">
          <div className="flex flex-wrap gap-4 items-end">
            <div>
              <label className="block text-slate-400 text-sm mb-1.5">Select Class</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="bg-slate-900 border border-slate-600 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
              >
                {classes.map((c) => (
                  <option key={c} value={c}>
                    Class {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-400 text-sm mb-1.5">Select Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-slate-900 border border-slate-600 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex gap-3 ml-auto">
              <div className="text-center px-4 py-2 bg-green-900/40 border border-green-700 rounded-lg">
                <p className="text-green-400 font-bold text-xl">{presentCount}</p>
                <p className="text-green-600 text-xs">Present</p>
              </div>
              <div className="text-center px-4 py-2 bg-yellow-900/40 border border-yellow-700 rounded-lg">
                <p className="text-yellow-400 font-bold text-xl">{lateCount}</p>
                <p className="text-yellow-600 text-xs">Late</p>
              </div>
              <div className="text-center px-4 py-2 bg-red-900/40 border border-red-700 rounded-lg">
                <p className="text-red-400 font-bold text-xl">{absentCount}</p>
                <p className="text-red-600 text-xs">Absent</p>
              </div>
            </div>
          </div>
        </div>

        {/* Save message */}
        {saveMessage && (
          <div className="mb-4 p-3 bg-green-900/50 border border-green-700 rounded-lg text-green-300 text-sm">
            {saveMessage}
          </div>
        )}

        {/* Attendance Records */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
            <h2 className="text-white font-semibold">
              Class {selectedClass} — {selectedDate}
            </h2>
            <span className="text-slate-400 text-sm">{filteredRecords.length} records</span>
          </div>

          {filteredRecords.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <p className="text-4xl mb-3">📋</p>
              <p>No attendance records for this class and date.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-700/50">
              {filteredRecords.map((record) => (
                <div
                  key={record.id}
                  className="px-6 py-4 hover:bg-slate-700/20 transition-colors"
                >
                  {/* Main row */}
                  <div className="flex items-center gap-4 flex-wrap">
                    {/* Student info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium">{record.studentName}</p>
                      <p className="text-slate-500 text-xs">
                        {record.studentId} · <span className="font-mono">{record.rfidTag}</span>
                        {record.time ? ` · Scanned ${record.time}` : " · No scan"}
                      </p>
                      {record.correctedBy && (
                        <p className="text-yellow-500 text-xs mt-0.5">✏️ Corrected by {record.correctedBy}</p>
                      )}
                    </div>

                    {/* Status */}
                    <div className="shrink-0">
                      {editingId === record.id ? (
                        <select
                          value={editStatus}
                          onChange={(e) =>
                            setEditStatus(e.target.value as "present" | "absent" | "late")
                          }
                          className="bg-slate-900 border border-blue-500 text-white rounded px-2 py-1 text-sm"
                        >
                          <option value="present">Present</option>
                          <option value="late">Late</option>
                          <option value="absent">Absent</option>
                        </select>
                      ) : (
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
                      )}
                    </div>

                    {/* Actions */}
                    <div className="shrink-0">
                      {editingId === record.id ? (
                        <div className="space-y-2">
                          <div>
                            <label className="block text-slate-400 text-xs mb-1">Teacher Note (optional)</label>
                            <input
                              type="text"
                              value={editNote}
                              onChange={(e) => setEditNote(e.target.value)}
                              placeholder="Add a note…"
                              className="bg-slate-900 border border-slate-600 text-white rounded px-2 py-1 text-xs w-48 focus:outline-none focus:border-blue-500"
                            />
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleSave(record.id)}
                              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium transition-colors"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="px-3 py-1.5 bg-slate-600 hover:bg-slate-500 text-white rounded text-xs font-medium transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleEdit(record)}
                          className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded text-xs font-medium transition-colors"
                        >
                          ✏️ Edit
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Absence reason from parent + teacher note */}
                  {record.status === "absent" && (
                    <div className="mt-3 space-y-2">
                      {/* Parent reason */}
                      {record.absentReason ? (
                        <div className="flex items-start gap-2 p-3 bg-blue-950/40 border border-blue-700/40 rounded-lg">
                          <span className="text-blue-400 text-sm mt-0.5">💬</span>
                          <div>
                            <p className="text-blue-300 text-xs font-medium mb-0.5">Parent reason:</p>
                            <p className="text-slate-300 text-sm">{record.absentReason}</p>
                          </div>
                        </div>
                      ) : (
                        <p className="text-slate-600 text-xs italic">No absence reason submitted by parent yet.</p>
                      )}

                      {/* Teacher note */}
                      {editingNoteId === record.id ? (
                        <div className="space-y-2">
                          <textarea
                            value={noteDraft}
                            onChange={(e) => setNoteDraft(e.target.value)}
                            placeholder="Add a teacher note about this absence…"
                            rows={2}
                            className="w-full bg-slate-900 border border-purple-500 text-white rounded-lg px-3 py-2 text-sm focus:outline-none resize-none placeholder-slate-500"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleSaveNote(record.id)}
                              className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded text-xs font-medium transition-colors"
                            >
                              Save Note
                            </button>
                            <button
                              onClick={() => setEditingNoteId(null)}
                              className="px-3 py-1.5 bg-slate-600 hover:bg-slate-500 text-white rounded text-xs font-medium transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start gap-2">
                          {record.teacherNote ? (
                            <div className="flex-1 flex items-start gap-2 p-3 bg-purple-950/40 border border-purple-700/40 rounded-lg">
                              <span className="text-purple-400 text-sm mt-0.5">📌</span>
                              <div className="flex-1">
                                <p className="text-purple-300 text-xs font-medium mb-0.5">Teacher note:</p>
                                <p className="text-slate-300 text-sm">{record.teacherNote}</p>
                              </div>
                              <button
                                onClick={() => handleStartEditNote(record)}
                                className="text-purple-400 hover:text-purple-300 text-xs shrink-0"
                              >
                                Edit
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleStartEditNote(record)}
                              className="px-3 py-1.5 bg-purple-900/40 hover:bg-purple-800/50 border border-purple-700/50 text-purple-300 rounded text-xs font-medium transition-colors"
                            >
                              📌 Add Note
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Unrecorded Students */}
        {unrecordedStudents.length > 0 && (
          <div className="bg-slate-800 rounded-xl border border-yellow-700/50 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-700 bg-yellow-900/20">
              <h2 className="text-yellow-300 font-semibold flex items-center gap-2">
                <span>⚠️</span> Students Without Records ({unrecordedStudents.length})
              </h2>
              <p className="text-yellow-600 text-sm mt-0.5">
                These students have no RFID scan for this date. Mark them as absent or add manually.
              </p>
            </div>
            <div className="p-4 space-y-2">
              {unrecordedStudents.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between p-3 bg-slate-900 rounded-lg"
                >
                  <div>
                    <p className="text-white font-medium">{student.name}</p>
                    <p className="text-slate-500 text-xs">
                      {student.studentId} · {student.rfidTag} ·{" "}
                      <span
                        className={
                          student.rfidStatus === "active"
                            ? "text-green-400"
                            : "text-red-400"
                        }
                      >
                        Card {student.rfidStatus}
                      </span>
                    </p>
                  </div>
                  <button
                    onClick={() => handleAddAbsent(student.studentId, student.name)}
                    className="px-3 py-1.5 bg-red-900/50 hover:bg-red-800 border border-red-700 text-red-300 rounded text-xs font-medium transition-colors"
                  >
                    Mark Absent
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
    </AuthGuard>
  );
}
