import { DayOfWeek, SchoolInfo } from "../types";

/**
 * Academic Year 2026 - 2027 Calendar Definitions
 * Official start date: Week 1 begins on Monday, 07/09/2026
 * Week 2 begins on Monday, 14/09/2026
 * ...
 * Week 35 finishes in May 2027
 */
export const ACADEMIC_YEAR_START_YEAR = 2026;
export const ACADEMIC_YEAR_START_MONTH = 8; // September (0-indexed: 8)
export const ACADEMIC_YEAR_START_DAY = 7; // 7th of September
export const TOTAL_ACADEMIC_WEEKS = 35;

export interface WeekDateRange {
  week: number;
  startDate: string; // DD/MM/YYYY (Thứ Hai)
  endDate: string; // DD/MM/YYYY (Thứ Sáu)
  shortStartDate: string; // DD/MM
  shortEndDate: string; // DD/MM
  formattedRange: string; // "Từ 07/09/2026 đến 11/09/2026"
  formattedRangeShort: string; // "07/09 - 11/09/2026"
  startDay: number;
  startMonth: number;
  startYear: number;
  endDay: number;
  endMonth: number;
  endYear: number;
}

export interface DayDateInfo {
  day: DayOfWeek;
  shortDate: string; // DD/MM (ví dụ "07/09")
  fullDate: string; // DD/MM/YYYY (ví dụ "07/09/2026")
  dayNumber: number;
  monthNumber: number;
  yearNumber: number;
}

/**
 * Format a Date object to DD/MM/YYYY
 */
export function formatDateDDMMYYYY(d: Date): string {
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Format a Date object to DD/MM
 */
export function formatDateDDMM(d: Date): string {
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  return `${day}/${month}`;
}

/**
 * Get Monday date of a specific school week (Week 1 = 07/09/2026)
 */
export function getMondayOfWeek(week: number): Date {
  const validWeek = Math.max(1, Math.min(week || 1, 52));
  const baseMonday = new Date(ACADEMIC_YEAR_START_YEAR, ACADEMIC_YEAR_START_MONTH, ACADEMIC_YEAR_START_DAY);
  const monday = new Date(baseMonday);
  monday.setDate(baseMonday.getDate() + (validWeek - 1) * 7);
  return monday;
}

/**
 * Calculate start (Monday) and end (Friday) dates for any school week
 */
export function calculateWeekDateRange(week: number): WeekDateRange {
  const monday = getMondayOfWeek(week);
  const friday = new Date(monday);
  friday.setDate(monday.getDate() + 4);

  const startDate = formatDateDDMMYYYY(monday);
  const endDate = formatDateDDMMYYYY(friday);
  const shortStartDate = formatDateDDMM(monday);
  const shortEndDate = formatDateDDMM(friday);

  return {
    week: week || 1,
    startDate,
    endDate,
    shortStartDate,
    shortEndDate,
    formattedRange: `Từ ngày ${startDate} đến ngày ${endDate}`,
    formattedRangeShort: `${shortStartDate} - ${shortEndDate}/${friday.getFullYear()}`,
    startDay: monday.getDate(),
    startMonth: monday.getMonth() + 1,
    startYear: monday.getFullYear(),
    endDay: friday.getDate(),
    endMonth: friday.getMonth() + 1,
    endYear: friday.getFullYear(),
  };
}

/**
 * Calculate dates for all 5 school days (Thứ Hai -> Thứ Sáu) of a specific week
 */
export function getDayDatesForWeek(week: number): DayDateInfo[] {
  const monday = getMondayOfWeek(week);
  const days: DayOfWeek[] = ["Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu"];

  return days.map((dayName, index) => {
    const cur = new Date(monday);
    cur.setDate(monday.getDate() + index);

    return {
      day: dayName,
      shortDate: formatDateDDMM(cur),
      fullDate: formatDateDDMMYYYY(cur),
      dayNumber: cur.getDate(),
      monthNumber: cur.getMonth() + 1,
      yearNumber: cur.getFullYear(),
    };
  });
}

/**
 * Get a dictionary map of dayName -> shortDate / fullDate for quick lookup
 */
export function getDayDateMapForWeek(week: number): Record<string, { shortDate: string; fullDate: string }> {
  const dayDates = getDayDatesForWeek(week);
  const map: Record<string, { shortDate: string; fullDate: string }> = {};

  dayDates.forEach((d) => {
    map[d.day] = {
      shortDate: d.shortDate,
      fullDate: d.fullDate,
    };
  });

  return map;
}

/**
 * Calculate weekly dates (Monday -> Friday) based on week and optional custom startDate
 */
export function getWeekDatesList(week: number, customStartDate?: string): string[] {
  // If custom start date is given and does not match standard pattern, parse it
  if (customStartDate && customStartDate.trim() !== "") {
    const parts = customStartDate.split(/[\/\-]/);
    if (parts.length >= 2) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10);
      const year = parts[2] ? parseInt(parts[2], 10) : ACADEMIC_YEAR_START_YEAR;
      if (!isNaN(day) && !isNaN(month)) {
        const d = new Date(year, month - 1, day);
        return [0, 1, 2, 3, 4].map((offset) => {
          const cur = new Date(d);
          cur.setDate(d.getDate() + offset);
          return formatDateDDMM(cur);
        });
      }
    }
  }

  // Otherwise calculate automatically from the academic calendar
  const dayDates = getDayDatesForWeek(week);
  return dayDates.map((d) => d.shortDate);
}

/**
 * Format date string (DD/MM/YYYY) to official Vietnamese text: "ngày 07 tháng 09 năm 2026"
 */
export function formatDateVietnamese(dateStr: string): string {
  if (!dateStr) return "";
  const parts = dateStr.split(/[\/\-]/);
  if (parts.length >= 3) {
    const day = parts[0].padStart(2, "0");
    const month = parts[1].padStart(2, "0");
    const year = parts[2];
    return `ngày ${day} tháng ${month} năm ${year}`;
  }
  return dateStr;
}

/**
 * Ensure a SchoolInfo object has synchronized startDate and endDate matching its week number
 */
export function syncSchoolInfoDates(info: SchoolInfo, newWeek?: number): SchoolInfo {
  const targetWeek = newWeek !== undefined ? newWeek : (info.week || 1);
  const range = calculateWeekDateRange(targetWeek);

  return {
    ...info,
    week: targetWeek,
    startDate: range.startDate,
    endDate: range.endDate,
  };
}

/**
 * Pre-generate all 35 academic weeks with labels for dropdown selectors
 */
export interface WeekOption {
  week: number;
  label: string;
  shortLabel: string;
  startDate: string;
  endDate: string;
}

export const ALL_ACADEMIC_WEEKS: WeekOption[] = Array.from({ length: TOTAL_ACADEMIC_WEEKS }, (_, i) => {
  const weekNum = i + 1;
  const range = calculateWeekDateRange(weekNum);
  return {
    week: weekNum,
    label: `Tuần ${weekNum} (${range.shortStartDate} - ${range.shortEndDate})`,
    shortLabel: `Tuần ${weekNum}`,
    startDate: range.startDate,
    endDate: range.endDate,
  };
});
