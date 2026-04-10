"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import AuthGuard from "@/components/AuthGuard";
import { getStoredStudents, saveStudents, Student, classes } from "@/lib/data";

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterClass, setFilterClass] = useState("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [newStudent, setNewStudent] = useState({
    name: "",
    studentId: "",
    class: "10A",
    fingerprintId: "",
    parentEmail: "",
    parentName: "",
  });

  useEffect(() => {
    setStudents(getStoredStudents());
  }, []);

  const showMessage = (msg: string) => {
    setSaveMessage(msg);
    setTimeout(() => setSaveMessage(""), 4000);
  };

  const handleAddStudent = () => {
    if (!newStudent.name || !newStudent.studentId || !newStudent.fingerprintId) {
      showMessage("❌ Please fill in all required fields.");
      return;
    }
    const student: Student = {
      id: `s${Date.now()}`,
      ...newStudent,
      fingerprintStatus: "active",
    };
    const updated = [...students, student];
    setStudents(updated);
    saveStudents(updated);
    setNewStudent({
      name: "",
      studentId: "",
      class: "10A",
      fingerprintId: "",
      parentEmail: "",
      parentName: "",
    });
    setShowAddForm(false);
    showMessage(`✅ ${student.name} has been registered with fingerprint ${student.fingerprintId}.`);
  };

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.fingerprintId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass = filterClass === "all" || s.class === filterClass;
    return matchesSearch && matchesClass;
  });

  return (
    <AuthGuard allowedRoles={["admin", "teacher"]}>
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <span>🎓</span> Student Registry
            </h1>
            <p className="text-slate-400 mt-1">
              Manage student records and their fingerprint enrollments.
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            <span>+</span> Register New Student
          </button>
        </div>

        {saveMessage && (
          <div className="mb-4 p-3 bg-slate-800 border border-slate-600 rounded-lg text-slate-200 text-sm">
            {saveMessage}
          </div>
        )}

        {showAddForm && (
          <div className="mb-6 bg-slate-800 border border-slate-700 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Register New Student</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-400 text-sm mb-1.5">Full Name <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  value={newStudent.name}
                  onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                  placeholder="e.g. John Doe"
                  className="w-full bg-slate-900 border border-slate-600 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-1.5">Student ID <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  value={newStudent.studentId}
                  onChange={(e) => setNewStudent({ ...newStudent, studentId: e.target.value.toUpperCase() })}
                  placeholder="e.g. STU001"
                  className="w-full bg-slate-900 border border-slate-600 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-1.5">Class <span className="text-red-400">*</span></label>
                <select
                  value={newStudent.class}
                  onChange={(e) => setNewStudent({ ...newStudent, class: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-600 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
                >
                  {classes.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-1.5">Fingerprint ID <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  value={newStudent.fingerprintId}
                  onChange={(e) => setNewStudent({ ...newStudent, fingerprintId: e.target.value.toUpperCase() })}
                  placeholder="e.g. FP-X1Y2Z3"
                  className="w-full bg-slate-900 border border-slate-600 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 placeholder-slate-500 font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-1.5">Parent / Guardian Name</label>
                <input
                  type="text"
                  value={newStudent.parentName}
                  onChange={(e) => setNewStudent({ ...newStudent, parentName: e.target.value })}
                  placeholder="e.g. Mr. Doe"
                  className="w-full bg-slate-900 border border-slate-600 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-1.5">Parent Email</label>
                <input
                  type="email"
                  value={newStudent.parentEmail}
                  onChange={(e) => setNewStudent({ ...newStudent, parentEmail: e.target.value })}
                  placeholder="e.g. parent@email.com"
                  className="w-full bg-slate-900 border border-slate-600 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleAddStudent}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
              >
                Add Student
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium"
              >
                Cancel
              </button>
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
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              className="bg-slate-900 border border-slate-600 text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Classes</option>
              {classes.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
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
                  <th className="text-left px-6 py-3 text-slate-400 text-sm font-medium">Parent Info</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                      {students.length === 0 ? "No students registered yet. Click 'Register New Student' to add one." : "No students match your search."}
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student) => (
                    <tr key={student.id} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                      <td className="px-6 py-4">
                        <p className="text-white font-medium">{student.name}</p>
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
                          <span className={`w-2.5 h-2.5 rounded-full ${student.fingerprintStatus === "active" ? "bg-green-400" : "bg-red-400"}`}></span>
                          <span className={`text-sm ${student.fingerprintStatus === "active" ? "text-green-400" : "text-red-400"}`}>
                            {student.fingerprintStatus === "active" ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-slate-300 text-sm">{student.parentName || "—"}</p>
                        <p className="text-slate-500 text-xs">{student.parentEmail || "—"}</p>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 bg-slate-800 border border-slate-700 rounded-xl p-4 flex items-start gap-3">
          <span className="text-slate-400 text-xl mt-0.5">ℹ️</span>
          <div>
            <p className="text-slate-300 font-medium text-sm">Fingerprint Assignment</p>
            <p className="text-slate-500 text-xs mt-0.5">
              Each student is assigned a unique fingerprint ID that links their biometric scan to their
              school record. When the fingerprint sensor detects a scan, it reads this ID and
              automatically records attendance in real time. To manage fingerprint status, visit the Fingerprint Manager.
            </p>
          </div>
        </div>
      </main>
    </div>
    </AuthGuard>
  );
}
