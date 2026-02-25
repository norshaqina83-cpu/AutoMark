"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import { students, attendanceRecords } from "@/lib/data";

export default function ParentPage() {
  const [selectedStudentId, setSelectedStudentId] = useState(students[0].studentId);

  const selectedStudent = students.find((s) => s.studentId === selectedStudentId)!;
  const studentRecords = attendanceRecords
    .filter((r) => r.studentId === selectedStudentId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const presentCount = studentRecords.filter((r) => r.status === "present").length;
  const lateCount = studentRecords.filter((r) => r.status === "late").length;
  const absentCount = studentRecords.filter((r) => r.status === "absent").length;
  const totalDays = studentRecords.length;
  const attendanceRate =
    totalDays > 0 ? Math.round(((presentCount + lateCount) / totalDays) * 100) : 0;

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
            Monitor your child&apos;s attendance. View-only access — contact the teacher to make corrections.
          </p>
        </div>

        {/* View-only notice */}
        <div className="mb-6 p-3 bg-blue-950/50 border border-blue-700/50 rounded-lg flex items-center gap-3">
          <span className="text-blue-400">🔒</span>
          <p className="text-blue-300 text-sm">
            <strong>View-only access.</strong> You can monitor attendance but cannot edit records.
            Please contact your child&apos;s teacher if you believe there is an error.
          </p>
        </div>

        {/* Student Selector */}
        <div className="bg-slate-800 rounded-xl p-5 border border-slate-700 mb-6">
          <label className="block text-slate-400 text-sm mb-2">Select Your Child</label>
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
                {absentCount !== 1 ? "s" : ""}. Please contact the school if this is unexpected.
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

        {/* Attendance History */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700">
            <h2 className="text-white font-semibold">Attendance History</h2>
            <p className="text-slate-500 text-xs mt-0.5">All recorded attendance entries</p>
          </div>

          {studentRecords.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <p className="text-4xl mb-3">📋</p>
              <p>No attendance records found for this student.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700 bg-slate-900/50">
                    <th className="text-left px-6 py-3 text-slate-400 text-sm font-medium">Date</th>
                    <th className="text-left px-6 py-3 text-slate-400 text-sm font-medium">Class</th>
                    <th className="text-left px-6 py-3 text-slate-400 text-sm font-medium">Scan Time</th>
                    <th className="text-left px-6 py-3 text-slate-400 text-sm font-medium">Status</th>
                    <th className="text-left px-6 py-3 text-slate-400 text-sm font-medium">Note</th>
                  </tr>
                </thead>
                <tbody>
                  {studentRecords.map((record) => (
                    <tr
                      key={record.id}
                      className="border-b border-slate-700/50 hover:bg-slate-700/20 transition-colors"
                    >
                      <td className="px-6 py-4 text-white text-sm">{record.date}</td>
                      <td className="px-6 py-4 text-slate-400 text-sm">Class {record.class}</td>
                      <td className="px-6 py-4 text-slate-400 text-sm">
                        {record.time || <span className="text-slate-600">No scan</span>}
                      </td>
                      <td className="px-6 py-4">
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
                      </td>
                      <td className="px-6 py-4 text-slate-500 text-xs">
                        {record.correctedBy ? `Corrected by ${record.correctedBy}` : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Contact Info */}
        <div className="mt-6 bg-slate-800 border border-slate-700 rounded-xl p-4 flex items-start gap-3">
          <span className="text-slate-400 text-xl mt-0.5">📞</span>
          <div>
            <p className="text-slate-300 font-medium text-sm">Need to report an issue?</p>
            <p className="text-slate-500 text-xs mt-0.5">
              If you believe there is an error in the attendance record, please contact your child&apos;s
              class teacher directly. Only teachers and administrators can make corrections to the system.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
