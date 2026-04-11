export type AttendanceSettings = {
  lateAfter: string;
  absentAfter: string;
};

export const attendanceSettings: AttendanceSettings = {
  lateAfter: "07:00",
  absentAfter: "12:30",
};

export const classes = ["10A", "10B", "10C", "11A", "11B", "12A", "12B"];
