"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import { students as initialStudents, Student, classes } from "@/lib/data";

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([...initialStudents]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterClass, setFilterClass] = useState("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [newStudent, setNewStudent] = useState({
    name: "",
    studentId: "",
    class: "10A",
    rfidTag: "",
    parentEmail: "",
    parentName: "",
  });

  const showMessage = (msg: string) => {
    setSaveMessage(msg);
    setTimeout(() => setSaveMessage(""), 4000);
  };

  const handleAddStudent = () => {
    if (!newStudent.name || !newStudent.studentId || !newStudent.rfidTag) {
      showMessage("❌ Please fill in all required fields.");
      return;
    }
    const student: Student = {
      id: `s${Date.now()}`,
      ...newStudent,
      rfidStatus: "active",
    };
    setStudents((prev) => [...prev, student]);
    setNewStudent({
      name: "",
      studentId: "",
      class: "10A",
      rfidTag: "",
      parentEmail: "",
      parentName: "",
    });
    setShowAddForm(false);
    showMessage(`✅ ${student.name} has been registered with RFID tag ${student.rfidTag}.`);
  };

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.rfidTag.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass = filterClass === "all" || s.class === filterClass;
    return matchesSearch && matchesClass;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <span>🎓</span> Student Registry
            </h1>
            <p className="text-slate-400 mt-1">
              Manage student records and their RFID card assignments.
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            <span>+</span> Register New Student
          </button>
        </div>

        {/* Save Message */}
        {saveMessage && (
          <div className="mb-4 p-3 bg-slate-800 border border-slate-600 rounded-lg text-slate-200 text-sm">
            {saveMessage}
          </div>
        )}

        {/* Add Student Form */}
        {showAddForm && (
          <div className="bg-slate-800 rounded-xl border border-blue-700/50 p-6 mb-6">
            <h2 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
              <span>➕</span> Register New Student
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 text-sm mb-1.5">
                  Full Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={newStudent.name}
                  onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-600 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 placeholder-slate-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-1.5">
                  Student ID <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. STU007"
                  value={newStudent.studentId}
                  onChange={(e) => setNewStudent({ ...newStudent, studentId: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-600 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 placeholder-slate-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-1.5">Class</label>
                <select
                  value={newStudent.class}
                  onChange={(e) => setNewStudent({ ...newStudent, class: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-600 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
                >
                  {classes.map((c) => (
                    <option key={c} value={c}>
                      Class {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-1.5">
                  RFID Tag Number <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. RFID-X1Y2Z3"
                  value={newStudent.rfidTag}
                  onChange={(e) => setNewStudent({ ...newStudent, rfidTag: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-600 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 placeholder-slate-500 font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-1.5">Parent / Guardian Name</label>
                <input
                  type="text"
                  placeholder="e.g. Mr. Doe"
                  value={newStudent.parentName}
                  onChange={(e) => setNewStudent({ ...newStudent, parentName: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-600 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 placeholder-slate-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-1.5">Parent Email</label>
                <input
                  type="email"
                  placeholder="e.g. parent@email.com"
                  value={newStudent.parentEmail}
                  onChange={(e) => setNewStudent({ ...newStudent, parentEmail: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-600 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 placeholder-slate-500"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button
                onClick={handleAddStudent}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Register Student
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Cancel
              </button>
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
              <button
                onClick={() => setFilterClass("all")}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  filterClass === "all"
                    ? "bg-blue-600 text-white"
                    : "bg-slate-900 text-slate-400 hover:bg-slate-700"
                }`}
              >
                All Classes
              </button>
              {classes.map((c) => (
                <button
                  key={c}
                  onClick={() => setFilterClass(c)}
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    filterClass === c
                      ? "bg-blue-600 text-white"
                      : "bg-slate-900 text-slate-400 hover:bg-slate-700"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Students Table */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
            <h2 className="text-white font-semibold">
              Registered Students ({filteredStudents.length})
            </h2>
            <span className="text-slate-500 text-sm">
              RFID Tag ↔ Student Mapping
            </span>
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
                  <th className="text-left px-6 py-3 text-slate-400 text-sm font-medium">Parent / Guardian</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr
                    key={student.id}
                    className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {student.name.charAt(0)}
                        </div>
                        <p className="text-white font-medium">{student.name}</p>
                      </div>
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
                            student.rfidStatus === "active" ? "bg-green-400" : "bg-red-400"
                          }`}
                        ></span>
                        <span
                          className={`text-sm ${
                            student.rfidStatus === "active" ? "text-green-400" : "text-red-400"
                          }`}
                        >
                          {student.rfidStatus === "active" ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-slate-300 text-sm">{student.parentName || "—"}</p>
                      <p className="text-slate-500 text-xs">{student.parentEmail || "—"}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-slate-800 border border-slate-700 rounded-xl p-4 flex items-start gap-3">
          <span className="text-slate-400 text-xl mt-0.5">ℹ️</span>
          <div>
            <p className="text-slate-300 font-medium text-sm">RFID Tag Assignment</p>
            <p className="text-slate-500 text-xs mt-0.5">
              Each student is assigned a unique RFID tag number that links their physical card to their
              school record. When the RC522 reader detects a card tap, it reads this tag number and
              automatically records attendance in real time. To manage card status, visit the RFID Card Manager.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
