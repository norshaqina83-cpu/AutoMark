"use client";

import { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/lib/auth";
import { attendanceRecords, Student } from "@/lib/data";
import AuthGuard from "@/components/AuthGuard";

export default function StudentDashboard() {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState<"week" | "month" | "all">("month");
  const [claimedReward, setClaimedReward] = useState(false);

  // Get student's attendance records
  const studentRecords = useMemo(() => {
    if (!user) return [];
    return attendanceRecords.filter((record) => record.studentId === user.idNumber);
  }, [user]);

  // Get student info
  const studentInfo = useMemo((): Student | null => {
    if (!user) return null;
    const students = [
      { id: "s1", name: "Alice Johnson", studentId: "STU001", class: "10A", rfidTag: "RFID-A1B2C3", rfidStatus: "active" as const, parentEmail: "", parentName: "" },
      { id: "s2", name: "Bob Smith", studentId: "STU002", class: "10A", rfidTag: "RFID-D4E5F6", rfidStatus: "active" as const, parentEmail: "", parentName: "" },
      { id: "s3", name: "Carol White", studentId: "STU003", class: "10B", rfidTag: "RFID-G7H8I9", rfidStatus: "inactive" as const, parentEmail: "", parentName: "" },
      { id: "s4", name: "David Brown", studentId: "STU004", class: "10B", rfidTag: "RFID-J1K2L3", rfidStatus: "active" as const, parentEmail: "", parentName: "" },
      { id: "s5", name: "Emma Davis", studentId: "STU005", class: "10A", rfidTag: "RFID-M4N5O6", rfidStatus: "active" as const, parentEmail: "", parentName: "" },
      { id: "s6", name: "Frank Wilson", studentId: "STU006", class: "10C", rfidTag: "RFID-P7Q8R9", rfidStatus: "active" as const, parentEmail: "", parentName: "" },
    ];
    return students.find((s) => s.studentId === user.idNumber) || null;
  }, [user]);

  // Calculate streak - counts consecutive days of present/late (not absent)
  // Streak is lost when student is absent for a day
  const streakData = useMemo(() => {
    if (!user || studentRecords.length === 0) return { currentStreak: 0, longestStreak: 0, totalPresent: 0, totalLate: 0, totalAbsent: 0 };

    // Sort records by date (newest first for current streak calculation)
    const sortedByDate = [...studentRecords].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    // Get unique dates only
    const uniqueDates = sortedByDate.reduce((acc, record) => {
      if (!acc.find(r => r.date === record.date)) {
        acc.push(record);
      }
      return acc;
    }, [] as typeof sortedByDate);

    // Calculate current streak (consecutive present/late from today backwards)
    let currentStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (const record of uniqueDates) {
      const recordDate = new Date(record.date);
      recordDate.setHours(0, 0, 0, 0);
      
      // Skip future dates
      if (recordDate > today) continue;
      
      if (record.status === "present" || record.status === "late") {
        currentStreak++;
      } else {
        // Streak broken by absence
        break;
      }
    }

    // Calculate longest streak
    let longestStreak = 0;
    let tempStreak = 0;
    const sortedAsc = [...uniqueDates].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    for (const record of sortedAsc) {
      if (record.status === "present" || record.status === "late") {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 0;
      }
    }

    // Count totals
    const totalPresent = studentRecords.filter(r => r.status === "present").length;
    const totalLate = studentRecords.filter(r => r.status === "late").length;
    const totalAbsent = studentRecords.filter(r => r.status === "absent").length;

    return { currentStreak, longestStreak, totalPresent, totalLate, totalAbsent };
  }, [studentRecords, user]);

  // Filter records based on selected period
  const filteredRecords = useMemo(() => {
    if (!user) return [];
    const now = new Date();
    let startDate: Date;

    switch (selectedPeriod) {
      case "week":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "month":
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        return studentRecords;
    }

    return studentRecords.filter((record) => {
      const recordDate = new Date(record.date);
      return recordDate >= startDate;
    });
  }, [studentRecords, selectedPeriod, user]);

  // Calculate stats for filtered period
  const stats = useMemo(() => {
    const total = filteredRecords.length;
    const present = filteredRecords.filter((r) => r.status === "present").length;
    const late = filteredRecords.filter((r) => r.status === "late").length;
    const absent = filteredRecords.filter((r) => r.status === "absent").length;

    return { total, present, late, absent };
  }, [filteredRecords]);

  // Get recent records (last 10)
  const recentRecords = useMemo(() => {
    return [...studentRecords]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10);
  }, [studentRecords]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "present":
        return "bg-green-100 text-green-800";
      case "late":
        return "bg-yellow-100 text-yellow-800";
      case "absent":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "present":
        return "Present";
      case "late":
        return "Late";
      case "absent":
        return "Absent";
      default:
        return status;
    }
  };

  const handleClaimReward = () => {
    if (streakData.currentStreak >= 100) {
      setClaimedReward(true);
      alert("Reward claimed! Please contact your teacher to receive your reward.");
    }
  };

  const canClaimReward = streakData.currentStreak >= 100 && !claimedReward;

  return (
    <AuthGuard allowedRoles={["student"]}>
      <div className="min-h-screen bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">Welcome, {user?.name}!</h1>
            <p className="text-slate-400 mt-1">Track your attendance streak and earn rewards!</p>
          </div>

          {/* Student Info Card */}
          {studentInfo && (
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 mb-8">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {studentInfo.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">{studentInfo.name}</h2>
                  <p className="text-slate-400">Student ID: {studentInfo.studentId} • Class: {studentInfo.class}</p>
                </div>
              </div>
            </div>
          )}

          {/* Streak Display */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-amber-600 to-orange-600 border border-amber-500 rounded-2xl p-8 text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <span className="text-5xl">🔥</span>
                <span className="text-6xl font-bold text-white">{streakData.currentStreak}</span>
                <span className="text-2xl text-amber-200">days</span>
              </div>
              <p className="text-amber-100 text-lg">
                {streakData.currentStreak === 0 
                  ? "Start your streak today! Come to school on time." 
                  : streakData.currentStreak < 10 
                    ? "Great start! Keep it up!"
                    : streakData.currentStreak < 30 
                      ? "Amazing progress! You're on fire! 🔥"
                      : streakData.currentStreak < 50
                        ? "Incredible dedication! 🎉"
                        : streakData.currentStreak < 100
                          ? "Outstanding streak! You're a superstar! ⭐"
                          : "LEGENDARY STREAK! 🏆"}
              </p>
              {canClaimReward && (
                <button
                  onClick={handleClaimReward}
                  className="mt-6 px-8 py-3 bg-white text-amber-700 font-bold rounded-full hover:bg-amber-50 transition-colors shadow-lg"
                >
                  🎁 Claim Your Reward!
                </button>
              )}
              {claimedReward && (
                <div className="mt-6 px-6 py-3 bg-green-500 text-white font-semibold rounded-full inline-block">
                  ✓ Reward Claimed! Contact your teacher.
                </div>
              )}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Longest Streak */}
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-slate-400 text-sm font-medium">Longest Streak</h3>
                <span className="text-2xl">🏅</span>
              </div>
              <p className="text-4xl font-bold text-amber-400">{streakData.longestStreak}</p>
              <p className="text-slate-500 text-sm mt-1">days</p>
            </div>

            {/* Present */}
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-slate-400 text-sm font-medium">Present</h3>
                <span className="text-2xl">✅</span>
              </div>
              <p className="text-4xl font-bold text-green-400">{stats.present}</p>
              <p className="text-slate-500 text-sm mt-1">days</p>
            </div>

            {/* Late */}
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-slate-400 text-sm font-medium">Late</h3>
                <span className="text-2xl">⏰</span>
              </div>
              <p className="text-4xl font-bold text-yellow-400">{stats.late}</p>
              <p className="text-slate-500 text-sm mt-1">days</p>
            </div>

            {/* Absent */}
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-slate-400 text-sm font-medium">Absent</h3>
                <span className="text-2xl">❌</span>
              </div>
              <p className="text-4xl font-bold text-red-400">{stats.absent}</p>
              <p className="text-slate-500 text-sm mt-1">days</p>
            </div>
          </div>

          {/* Progress to reward */}
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Progress to Next Reward</h3>
              <span className="text-amber-400 font-bold">{Math.min(streakData.currentStreak, 100)} / 100 days</span>
            </div>
            <div className="h-4 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all bg-gradient-to-r from-amber-500 to-yellow-400"
                style={{ width: `${Math.min(streakData.currentStreak, 100)}%` }}
              />
            </div>
            {streakData.currentStreak < 100 && (
              <p className="text-slate-400 text-sm mt-3">
                {100 - streakData.currentStreak} more days to reach your reward!
              </p>
            )}
          </div>

          {/* Period Filter */}
          <div className="flex items-center gap-2 mb-6">
            <span className="text-slate-400 text-sm">Show records for:</span>
            <div className="flex gap-1 bg-slate-800 p-1 rounded-lg">
              <button
                onClick={() => setSelectedPeriod("week")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedPeriod === "week"
                    ? "bg-blue-600 text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Last 7 Days
              </button>
              <button
                onClick={() => setSelectedPeriod("month")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedPeriod === "month"
                    ? "bg-blue-600 text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Last 30 Days
              </button>
              <button
                onClick={() => setSelectedPeriod("all")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedPeriod === "all"
                    ? "bg-blue-600 text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                All Time
              </button>
            </div>
          </div>

          {/* Recent Attendance Records */}
          <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-700">
              <h3 className="text-xl font-semibold text-white">Recent Attendance Records</h3>
              <p className="text-slate-400 text-sm mt-1">Your attendance history</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-900/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Time</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {recentRecords.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-slate-400">
                        No attendance records found
                      </td>
                    </tr>
                  ) : (
                    recentRecords.map((record) => (
                      <tr key={record.id} className="hover:bg-slate-700/30 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                          {new Date(record.date).toLocaleDateString("en-US", {
                            weekday: "short",
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                          {record.time || "—"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(record.status)}`}>
                            {getStatusLabel(record.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-400">
                          {record.absentReason || record.teacherNote || "—"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
