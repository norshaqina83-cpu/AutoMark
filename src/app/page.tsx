"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import AuthGuard from "@/components/AuthGuard";
import { students, attendanceRecords, attendanceSettings } from "@/lib/data";

function AdminDashboardContent() {
  const today = new Date().toISOString().split("T")[0];
  const todayRecords = attendanceRecords.filter((r) => r.date === today);
  const presentToday = todayRecords.filter((r) => r.status === "present").length;
  const lateToday = todayRecords.filter((r) => r.status === "late").length;
  const absentToday = todayRecords.filter((r) => r.status === "absent").length;
  const activeCards = students.filter((s) => s.rfidStatus === "active").length;
  const inactiveCards = students.filter((s) => s.rfidStatus === "inactive").length;

  const recentScans = attendanceRecords
    .filter((r) => r.time !== "")
    .sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`);
      const dateB = new Date(`${b.date}T${b.time}`);
      return dateB.getTime() - dateA.getTime();
    })
    .slice(0, 5);

  // Time settings state
  const [lateAfter, setLateAfter] = useState(attendanceSettings.lateAfter);
  const [absentAfter, setAbsentAfter] = useState(attendanceSettings.absentAfter);
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [settingsError, setSettingsError] = useState("");

  const handleSaveSettings = () => {
    setSettingsError("");
    // Validate: lateAfter must be before absentAfter
    const [lh, lm] = lateAfter.split(":").map(Number);
    const [ah, am] = absentAfter.split(":").map(Number);
    if (lh * 60 + lm >= ah * 60 + am) {
      setSettingsError("'Late after' time must be earlier than 'Absent after' time.");
      return;
    }
    // Apply to the shared settings object (in-memory)
    attendanceSettings.lateAfter = lateAfter;
    attendanceSettings.absentAfter = absentAfter;
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">System Dashboard</h1>
          <p className="text-slate-400 mt-1">
            RFID Digital Attendance Management System — Real-time overview
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <span className="text-slate-400 text-sm">Present Today</span>
              <span className="text-2xl">✅</span>
            </div>
            <p className="text-3xl font-bold text-green-400">{presentToday}</p>
            <p className="text-slate-500 text-xs mt-1">students scanned in</p>
          </div>

          <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <span className="text-slate-400 text-sm">Late Today</span>
              <span className="text-2xl">⏰</span>
            </div>
            <p className="text-3xl font-bold text-yellow-400">{lateToday}</p>
            <p className="text-slate-500 text-xs mt-1">arrived after {attendanceSettings.lateAfter}</p>
          </div>

          <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <span className="text-slate-400 text-sm">Absent Today</span>
              <span className="text-2xl">❌</span>
            </div>
            <p className="text-3xl font-bold text-red-400">{absentToday}</p>
            <p className="text-slate-500 text-xs mt-1">no scan recorded</p>
          </div>

          <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <span className="text-slate-400 text-sm">Total Students</span>
              <span className="text-2xl">🎓</span>
            </div>
            <p className="text-3xl font-bold text-blue-400">{students.length}</p>
            <p className="text-slate-500 text-xs mt-1">enrolled in system</p>
          </div>
        </div>

        {/* Attendance Time Settings */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 mb-8">
          <h2 className="text-lg font-semibold text-white mb-1 flex items-center gap-2">
            <span>⏱️</span> Attendance Time Settings
          </h2>
          <p className="text-slate-400 text-sm mb-5">
            Configure the cutoff times used to classify RFID scans as Present, Late, or Absent.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
            {/* Late After */}
            <div className="bg-slate-900 rounded-xl p-4 border border-slate-700">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-yellow-400 text-lg">⏰</span>
                <div>
                  <p className="text-white text-sm font-medium">Late After</p>
                  <p className="text-slate-500 text-xs">Scans after this time are marked Late</p>
                </div>
              </div>
              <input
                type="time"
                value={lateAfter}
                onChange={(e) => { setLateAfter(e.target.value); setSettingsError(""); }}
                className="w-full bg-slate-800 border border-slate-600 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-500 transition-colors"
              />
              <p className="text-slate-500 text-xs mt-2">
                Current: <span className="text-yellow-400 font-mono">{attendanceSettings.lateAfter}</span>
              </p>
            </div>

            {/* Absent After */}
            <div className="bg-slate-900 rounded-xl p-4 border border-slate-700">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-red-400 text-lg">🚫</span>
                <div>
                  <p className="text-white text-sm font-medium">Absent After</p>
                  <p className="text-slate-500 text-xs">Scans after this time are marked Absent</p>
                </div>
              </div>
              <input
                type="time"
                value={absentAfter}
                onChange={(e) => { setAbsentAfter(e.target.value); setSettingsError(""); }}
                className="w-full bg-slate-800 border border-slate-600 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-red-500 transition-colors"
              />
              <p className="text-slate-500 text-xs mt-2">
                Current: <span className="text-red-400 font-mono">{attendanceSettings.absentAfter}</span>
              </p>
            </div>
          </div>

          {/* Status legend */}
          <div className="flex flex-wrap gap-3 mb-5 text-xs">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-900/30 border border-green-700/50 rounded-lg">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              <span className="text-green-300">
                <strong>Present</strong> — scan at or before {lateAfter}
              </span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-900/30 border border-yellow-700/50 rounded-lg">
              <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
              <span className="text-yellow-300">
                <strong>Late</strong> — scan after {lateAfter} and before {absentAfter}
              </span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-red-900/30 border border-red-700/50 rounded-lg">
              <span className="w-2 h-2 bg-red-400 rounded-full"></span>
              <span className="text-red-300">
                <strong>Absent</strong> — scan after {absentAfter} or no scan
              </span>
            </div>
          </div>

          {settingsError && (
            <div className="mb-4 p-3 bg-red-950/60 border border-red-700/60 rounded-lg text-red-300 text-sm flex items-center gap-2">
              <span>⚠️</span> {settingsError}
            </div>
          )}

          {settingsSaved && (
            <div className="mb-4 p-3 bg-green-900/50 border border-green-700 rounded-lg text-green-300 text-sm flex items-center gap-2">
              <span>✅</span> Time settings saved successfully.
            </div>
          )}

          <button
            onClick={handleSaveSettings}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors"
          >
            Save Time Settings
          </button>
        </div>

        {/* RFID Card Status + Recent Scans */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* RFID Card Status */}
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span>💳</span> RFID Card Status
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-slate-900 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 bg-green-400 rounded-full"></span>
                  <span className="text-slate-300">Active Cards</span>
                </div>
                <span className="text-green-400 font-bold text-lg">{activeCards}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-900 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 bg-red-400 rounded-full"></span>
                  <span className="text-slate-300">Inactive / Lost</span>
                </div>
                <span className="text-red-400 font-bold text-lg">{inactiveCards}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-900 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 bg-blue-400 rounded-full"></span>
                  <span className="text-slate-300">Total Registered</span>
                </div>
                <span className="text-blue-400 font-bold text-lg">{students.length}</span>
              </div>
            </div>
            <Link
              href="/cards"
              className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Manage RFID Cards →
            </Link>
          </div>

          {/* Recent Scans */}
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span>📡</span> Recent RFID Scans
            </h2>
            <div className="space-y-2">
              {recentScans.map((scan) => (
                <div
                  key={scan.id}
                  className="flex items-center justify-between p-3 bg-slate-900 rounded-lg"
                >
                  <div>
                    <p className="text-white text-sm font-medium">{scan.studentName}</p>
                    <p className="text-slate-500 text-xs">
                      {scan.rfidTag} · Class {scan.class}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        scan.status === "present"
                          ? "bg-green-900 text-green-300"
                          : scan.status === "late"
                          ? "bg-yellow-900 text-yellow-300"
                          : "bg-red-900 text-red-300"
                      }`}
                    >
                      {scan.status}
                    </span>
                    <p className="text-slate-500 text-xs mt-1">{scan.date} {scan.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Access Portals */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/teacher"
            className="group bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-blue-500 rounded-xl p-6 transition-all"
          >
            <div className="text-4xl mb-3">👩‍🏫</div>
            <h3 className="text-white font-semibold text-lg mb-1">Teacher Portal</h3>
            <p className="text-slate-400 text-sm">
              View class attendance, make corrections, and manage daily records.
            </p>
            <span className="mt-3 inline-block text-blue-400 text-sm group-hover:translate-x-1 transition-transform">
              Open Portal →
            </span>
          </Link>

          <Link
            href="/cards"
            className="group bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-purple-500 rounded-xl p-6 transition-all"
          >
            <div className="text-4xl mb-3">💳</div>
            <h3 className="text-white font-semibold text-lg mb-1">RFID Card Manager</h3>
            <p className="text-slate-400 text-sm">
              Activate, deactivate, or renew student RFID cards. Handle lost cards.
            </p>
            <span className="mt-3 inline-block text-purple-400 text-sm group-hover:translate-x-1 transition-transform">
              Manage Cards →
            </span>
          </Link>

          <Link
            href="/parent"
            className="group bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-green-500 rounded-xl p-6 transition-all"
          >
            <div className="text-4xl mb-3">👨‍👩‍👧</div>
            <h3 className="text-white font-semibold text-lg mb-1">Parent Portal</h3>
            <p className="text-slate-400 text-sm">
              Monitor your child&apos;s attendance history and receive absence alerts.
            </p>
            <span className="mt-3 inline-block text-green-400 text-sm group-hover:translate-x-1 transition-transform">
              View Attendance →
            </span>
          </Link>
        </div>

        {/* System Info Banner */}
        <div className="mt-6 bg-blue-950 border border-blue-800 rounded-xl p-4 flex items-start gap-3">
          <span className="text-blue-400 text-xl mt-0.5">📡</span>
          <div>
            <p className="text-blue-300 font-medium text-sm">RC522 RFID Reader — Connected</p>
            <p className="text-blue-400 text-xs mt-0.5">
              The RFID scanner at the classroom entrance is online and transmitting attendance data in real time.
              Green LED = successful scan &middot; Red LED = card inactive or error &middot; Buzzer = confirmation beep.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <AuthGuard allowedRoles={["admin"]}>
      <AdminDashboardContent />
    </AuthGuard>
  );
}
