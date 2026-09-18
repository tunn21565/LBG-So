import { DayOfWeek, MasterTimetable, ScheduleItem, SessionType, SchoolInfo, Grade } from "../types";
import { getGradeCurriculumLesson } from "./gradeCurriculums";
import { getWeekDatesList } from "../utils/dateHelper";

export interface TeacherInfo {
  id: string;
  name: string;
  role: string;
  type: "homeroom" | "specialist";
  specialistSubject?: string;
  assignedClasses?: string[];
  subjects: string[];
}

export const DEFAULT_CLASSES = [
  "1A1", "1A2", "1B", "1C",
  "2A1", "2A2", "2B", "2C",
  "3A1", "3A2", "3B", "3C",
  "4A1", "4A2", "4B", "4C",
  "5A", "5B", "5C"
];

// 31 Giáo viên toàn trường: 19 GVCN (Khối 1 - 5) + 12 GV Bộ Môn / Chuyên
export const DEFAULT_TEACHERS: TeacherInfo[] = [
  // --- 19 GIÁO VIÊN CHỦ NHIỆM (GVCN) KHỐI 1 ĐẾN KHỐI 5 ---
  // Khối 1
  { id: "gvcn_1a1", name: "Cô A", role: "GVCN 1A1", type: "homeroom", assignedClasses: ["1A1"], subjects: ["Tiếng Việt", "Toán", "HĐTN", "TC Tiếng Việt", "BD-PĐ"] },
  { id: "gvcn_1a2", name: "Cô B", role: "GVCN 1A2", type: "homeroom", assignedClasses: ["1A2"], subjects: ["Tiếng Việt", "Toán", "HĐTN", "TC Tiếng Việt", "BD-PĐ"] },
  { id: "gvcn_1b", name: "Cô CC", role: "GVCN 1B", type: "homeroom", assignedClasses: ["1B"], subjects: ["Tiếng Việt", "Toán", "HĐTN", "TC Tiếng Việt", "BD-PĐ"] },
  { id: "gvcn_1c", name: "Cô GG", role: "GVCN 1C", type: "homeroom", assignedClasses: ["1C"], subjects: ["Tiếng Việt", "Toán", "HĐTN", "TC Tiếng Việt", "BD-PĐ"] },

  // Khối 2
  { id: "gvcn_2a1", name: "Cô C", role: "GVCN 2A1", type: "homeroom", assignedClasses: ["2A1"], subjects: ["Tiếng Việt", "Toán", "HĐTN", "TC Tiếng Việt", "BD-PĐ"] },
  { id: "gvcn_2a2", name: "Cô D", role: "GVCN 2A2", type: "homeroom", assignedClasses: ["2A2"], subjects: ["Tiếng Việt", "Toán", "HĐTN", "TC Tiếng Việt", "BD-PĐ"] },
  { id: "gvcn_2b", name: "Khánh Linh", role: "GVCN 2B", type: "homeroom", assignedClasses: ["2B"], subjects: ["Tiếng Việt", "Toán", "HĐTN", "TC Tiếng Việt", "BD-PĐ"] },
  { id: "gvcn_2c", name: "Cô YY", role: "GVCN 2C", type: "homeroom", assignedClasses: ["2C"], subjects: ["Tiếng Việt", "Toán", "HĐTN", "TC Tiếng Việt", "BD-PĐ"] },

  // Khối 3
  { id: "gvcn_3a1", name: "Cô H", role: "GVCN 3A1", type: "homeroom", assignedClasses: ["3A1"], subjects: ["Tiếng Việt", "Toán", "TNXH", "HĐTN", "TC Tiếng Việt", "TC Toán"] },
  { id: "gvcn_3a2", name: "Cô F", role: "GVCN 3A2 (TPT Đội)", type: "homeroom", assignedClasses: ["3A2"], subjects: ["Tiếng Việt", "Toán", "TNXH", "ĐĐ", "HĐTN", "TC Tiếng Việt", "TC Toán"] },
  { id: "gvcn_3b", name: "Cô DD", role: "GVCN 3B", type: "homeroom", assignedClasses: ["3B"], subjects: ["Tiếng Việt", "Toán", "TNXH", "HĐTN", "TC Tiếng Việt", "TC Toán"] },
  { id: "gvcn_3c", name: "Thầy Nguyễn Văn Sang", role: "GVCN 3C", type: "homeroom", assignedClasses: ["3C"], subjects: ["Tiếng Việt", "Toán", "TNXH", "HĐTN", "TC Tiếng Việt", "TC Toán"] },

  // Khối 4
  { id: "gvcn_4a1", name: "Cô TT", role: "GVCN 4A1", type: "homeroom", assignedClasses: ["4A1"], subjects: ["Tiếng Việt", "Toán", "Khoa học", "Lịch sử & Địa lí", "Đạo đức", "HĐTN"] },
  { id: "gvcn_4a2", name: "Cô AA", role: "GVCN 4A2", type: "homeroom", assignedClasses: ["4A2"], subjects: ["Tiếng Việt", "Toán", "Khoa học", "Lịch sử & Địa lí", "Đạo đức", "HĐTN"] },
  { id: "gvcn_4b", name: "Cô EE", role: "GVCN 4B", type: "homeroom", assignedClasses: ["4B"], subjects: ["Tiếng Việt", "Toán", "Khoa học", "Lịch sử & Địa lí", "HĐTN", "TC Toán"] },
  { id: "gvcn_4c", name: "Cô YYY", role: "GVCN 4C", type: "homeroom", assignedClasses: ["4C"], subjects: ["Tiếng Việt", "Toán", "Khoa học", "Lịch sử & Địa lí", "HĐTN", "TC Toán"] },

  // Khối 5
  { id: "gvcn_5a", name: "Cô Tuyết", role: "GVCN 5A", type: "homeroom", assignedClasses: ["5A"], subjects: ["Tiếng Việt", "Toán", "Khoa học", "Lịch sử & Địa lí", "HĐTN", "TC Toán"] },
  { id: "gvcn_5b", name: "Cô Mai", role: "GVCN 5B", type: "homeroom", assignedClasses: ["5B"], subjects: ["Tiếng Việt", "Toán", "Khoa học", "Lịch sử & Địa lí", "HĐTN", "TC Toán"] },
  { id: "gvcn_5c", name: "Thầy/Cô UUU", role: "GVCN 5C", type: "homeroom", assignedClasses: ["5C"], subjects: ["Tiếng Việt", "Toán", "Khoa học", "Lịch sử & Địa lí", "HĐTN", "BD-PĐ"] },

  // --- 12 GIÁO VIÊN BỘ MÔN / CHUYÊN TOÀN TRƯỜNG ---
  {
    id: "chuong",
    name: "Thầy Chương",
    role: "GV Chuyên GDTC & HĐTN",
    type: "specialist",
    specialistSubject: "Giáo dục thể chất",
    assignedClasses: ["1A1", "1A2", "1B", "1C", "3B", "4A2", "5A", "5B"],
    subjects: ["GDTC", "BDNK GDTC", "HĐTN (Chương)"]
  },
  {
    id: "vinh",
    name: "Thầy Vinh",
    role: "GV Chuyên GDTC & HĐTN",
    type: "specialist",
    specialistSubject: "Giáo dục thể chất",
    assignedClasses: ["2A1", "2A2", "2B", "2C", "3A1", "3A2", "4A1", "4A2", "4C"],
    subjects: ["GDTC", "BDNK GDTC", "HĐTN (Vinh)"]
  },
  {
    id: "tranh",
    name: "Cô Tranh",
    role: "GV Chuyên GDTC & HĐTN",
    type: "specialist",
    specialistSubject: "Giáo dục thể chất",
    assignedClasses: ["3A1", "3A2", "3B", "3C", "4B", "4C", "5B", "5C"],
    subjects: ["GDTC", "BDNK GDTC", "HĐTN (Tranh)"]
  },
  {
    id: "huong",
    name: "Cô Hương",
    role: "GV Chuyên Âm nhạc",
    type: "specialist",
    specialistSubject: "Âm nhạc",
    assignedClasses: DEFAULT_CLASSES,
    subjects: ["A.NHẠC", "BDNK A.NHẠC"]
  },
  {
    id: "my",
    name: "Cô My",
    role: "GV Chuyên Mĩ thuật",
    type: "specialist",
    specialistSubject: "Mĩ thuật",
    assignedClasses: DEFAULT_CLASSES,
    subjects: ["M.THUẬT", "BDNK M.THUẬT"]
  },
  {
    id: "huynh",
    name: "Cô Huỳnh",
    role: "GV Chuyên Tiếng Anh",
    type: "specialist",
    specialistSubject: "Tiếng Anh",
    assignedClasses: ["3A1", "3A2", "3B", "4A2", "4B", "5B"],
    subjects: ["T.ANH (Huỳnh)"]
  },
  {
    id: "loan",
    name: "Cô Loan",
    role: "GV Chuyên Tiếng Anh",
    type: "specialist",
    specialistSubject: "Tiếng Anh",
    assignedClasses: ["3C", "4A1", "4C", "5A", "5C"],
    subjects: ["T.ANH (Loan)"]
  },
  {
    id: "luu",
    name: "Cô Lưu",
    role: "GV Chuyên Tin học & Công nghệ",
    type: "specialist",
    specialistSubject: "Tin học",
    assignedClasses: ["1B", "2A1", "2A2", "2C", "3A1", "3A2", "3C", "4A1", "4A2", "4C", "5A", "5C"],
    subjects: ["TIN HỌC (Lưu)", "C.NGHỆ (Lưu)", "HĐTN (Lưu)"]
  },
  {
    id: "thi",
    name: "Cô Thi",
    role: "GV Chuyên Tin học & Công nghệ",
    type: "specialist",
    specialistSubject: "Tin học",
    assignedClasses: ["1A1", "1A2", "1C", "2B", "3A1", "3A2", "3B", "4A1", "4A2", "4B", "5B"],
    subjects: ["TIN HỌC (Thi)", "C.NGHỆ (Thi)", "HĐTN (Thi)"]
  },
  {
    id: "bety",
    name: "Cô Bé Tý",
    role: "GV Bộ môn (TNXH - Đạo đức - TC Toán)",
    type: "specialist",
    specialistSubject: "Tự nhiên và Xã hội",
    assignedClasses: ["1A1", "1A2", "1B", "1C", "4B", "4C", "5A", "5B"],
    subjects: ["TNXH (Bé Tý)", "ĐẠO ĐỨC (Bé Tý)", "TC Toán (Bé Tý)"]
  },
  {
    id: "oanh",
    name: "Cô Oanh",
    role: "GV Bộ môn (Đạo đức - TNXH - TC Toán)",
    type: "specialist",
    specialistSubject: "Đạo đức",
    assignedClasses: ["2A1", "2A2", "2B", "2C", "3A1", "3A2", "3B", "3C"],
    subjects: ["ĐẠO ĐỨC (Oanh)", "TNXH (Oanh)", "TC Toán (Oanh)"]
  },
  {
    id: "toan",
    name: "Thầy Toàn",
    role: "GV Bộ môn (TNXH - Đạo đức - Công nghệ)",
    type: "specialist",
    specialistSubject: "Tự nhiên và Xã hội",
    assignedClasses: ["2C", "5C"],
    subjects: ["TNXH (Toàn)", "ĐĐ (Toàn)", "CN (Toàn)"]
  }
];

export const DAYS_OF_WEEK: DayOfWeek[] = ["Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu"];

// Master timetable matrix based on official timetable: Phân hiệu Kiến Bình (NH 2026-2027)
export const DEFAULT_MASTER_TIMETABLE: MasterTimetable = {
  schoolName: "Trường Tiểu học Tân Thạnh",
  branchName: "Phân hiệu Kiến Bình",
  effectiveDate: "Áp dụng từ ngày 07/09/2026 (Tuần 01) - NH 2026-2027",
  classes: DEFAULT_CLASSES,
  slots: {
    // ==========================================
    // THỨ HAI
    // ==========================================
    "Thứ Hai_Sáng_1": {
      "1A1": "HĐTN (CC)", "1A2": "HĐTN (CC)", "1B": "HĐTN (CC)", "1C": "HĐTN (CC)",
      "2A1": "HĐTN (CC)", "2A2": "HĐTN (CC)", "2B": "HĐTN (CC)", "2C": "HĐTN (CC)",
      "3A1": "HĐTN (CC)", "3A2": "HĐTN (CC)", "3B": "HĐTN (CC)", "3C": "HĐTN (CC)",
      "4A1": "HĐTN (CC)", "4A2": "HĐTN (CC)", "4B": "HĐTN (CC)", "4C": "HĐTN (CC)",
      "5A": "HĐTN (CC)", "5B": "HĐTN (CC)", "5C": "HĐTN (CC)"
    },
    "Thứ Hai_Sáng_2": {
      "1A1": "GDTC(Chương)", "1A2": "TV", "1B": "TV", "1C": "A.NHẠC (Hương)",
      "2A1": "TV", "2A2": "TV", "2B": "TV", "2C": "TV",
      "3A1": "T", "3A2": "T", "3B": "T", "3C": "TV",
      "4A1": "T", "4A2": "T", "4B": "TV", "4C": "T",
      "5A": "TV", "5B": "ĐẠO ĐỨC (Bé Tý)", "5C": "T"
    },
    "Thứ Hai_Sáng_3": {
      "1A1": "TV", "1A2": "GDTC(Chương)", "1B": "TNXH (Bé Tý)", "1C": "TV",
      "2A1": "TV", "2A2": "TV", "2B": "TV", "2C": "A.NHẠC (Hương)",
      "3A1": "TV", "3A2": "TV", "3B": "TV", "3C": "TV",
      "4A1": "TV", "4A2": "TV", "4B": "TV", "4C": "TV",
      "5A": "TV", "5B": "TV", "5C": "TV"
    },
    "Thứ Hai_Sáng_4": {
      "1A1": "TV", "1A2": "TV", "1B": "TV", "1C": "TV",
      "2A1": "T", "2A2": "T", "2B": "T", "2C": "TV",
      "3A1": "TV", "3A2": "TV", "3B": "TV", "3C": "A.NHẠC (Hương)",
      "4A1": "TV", "4A2": "TV", "4B": "ĐẠO ĐỨC (Bé Tý)", "4C": "TV",
      "5A": "GDTC(Chương)", "5B": "TV", "5C": "TV"
    },

    "Thứ Hai_Chiều_1": {
      "1A1": "A.NHẠC (Hương)", "1A2": "T", "1B": "TV", "1C": "T",
      "2A1": "TV", "2A2": "TV", "2B": "ĐẠO ĐỨC (Oanh)", "2C": "GDTC (Vinh)",
      "3A1": "TNXH", "3A2": "ĐĐ", "3B": "TNXH", "3C": "T",
      "4A1": "KH", "4A2": "KH", "4B": "GDTC (Tranh)", "4C": "KH",
      "5A": "T", "5B": "M.THUẬT (My)", "5C": "KH"
    },
    "Thứ Hai_Chiều_2": {
      "1A1": "T", "1A2": "TV", "1B": "TV", "1C": "GDTC(Chương)",
      "2A1": "TC Tiếng Việt", "2A2": "TC Tiếng Việt", "2B": "TNXH (Oanh)", "2C": "BDNK GDTC (Vinh)",
      "3A1": "TC Tiếng Việt", "3A2": "A.NHẠC (Hương)", "3B": "GDTC (Tranh)", "3C": "TC Tiếng Việt",
      "4A1": "ĐĐ", "4A2": "ĐĐ", "4B": "M.THUẬT (My)", "4C": "TC Toán",
      "5A": "KH", "5B": "T", "5C": "TV"
    },
    "Thứ Hai_Chiều_3": {
      "1A1": "TC Tiếng Việt", "1A2": "TV", "1B": "M.THUẬT (My)", "1C": "BDNK GDTC (Chương)",
      "2A1": "A.NHẠC (Hương)", "2A2": "BD-PĐ", "2B": "TC Toán (Oanh)", "2C": "T",
      "3A1": "TC Toán", "3A2": "TC Tiếng Việt", "3B": "TC Tiếng Việt", "3C": "BDNK GDTC (Tranh)",
      "4A1": "GDTC (Vinh)", "4A2": "LS và ĐL", "4B": "T", "4C": "LS và ĐL",
      "5A": "LS và ĐL", "5B": "KH", "5C": "BD-PĐ"
    },

    // ==========================================
    // THỨ BA
    // ==========================================
    "Thứ Ba_Sáng_1": {
      "1A1": "TNXH (Bé Tý)", "1A2": "TV", "1B": "TV", "1C": "TV",
      "2A1": "HĐTN (Lưu)", "2A2": "GDTC (Vinh)", "2B": "TIN HỌC (Thi)", "2C": "TV",
      "3A1": "T.ANH (Huỳnh)", "3A2": "GDTC (Tranh)", "3B": "T", "3C": "T.ANH (Loan)",
      "4A1": "T", "4A2": "T", "4B": "T", "4C": "M.THUẬT (My)",
      "5A": "T", "5B": "T", "5C": "T"
    },
    "Thứ Ba_Sáng_2": {
      "1A1": "TC Toán (Bé Tý)", "1A2": "TV", "1B": "TV", "1C": "TV",
      "2A1": "GDTC (Vinh)", "2A2": "ĐẠO ĐỨC (Oanh)", "2B": "HĐTN (Thi)", "2C": "T",
      "3A1": "GDTC (Tranh)", "3A2": "T.ANH (Huỳnh)", "3B": "TV", "3C": "M.THUẬT (My)",
      "4A1": "HĐTN (Lưu)", "4A2": "TV", "4B": "TV", "4C": "T.ANH (Loan)",
      "5A": "TV", "5B": "TV", "5C": "TV"
    },
    "Thứ Ba_Sáng_3": {
      "1A1": "TV", "1A2": "TNXH (Bé Tý)", "1B": "T", "1C": "T",
      "2A1": "TV", "2A2": "TNXH (Oanh)", "2B": "TV", "2C": "M.THUẬT (My)",
      "3A1": "C.NGHỆ (Lưu)", "3A2": "T", "3B": "T.ANH (Huỳnh)", "3C": "T",
      "4A1": "T.ANH (Loan)", "4A2": "GDTC (Vinh)", "4B": "BDNK GDTC (Tranh)", "4C": "T",
      "5A": "KH", "5B": "TIN HỌC (Thi)", "5C": "TV"
    },
    "Thứ Ba_Sáng_4": {
      "1A1": "TV", "1A2": "TC Toán (Bé Tý)", "1B": "BD-PĐ", "1C": "M.THUẬT (My)",
      "2A1": "T", "2A2": "TC Toán (Oanh)", "2B": "T", "2C": "TV",
      "3A1": "T", "3A2": "TV", "3B": "BDNK GDTC (Tranh)", "3C": "TV",
      "4A1": "GDTC (Vinh)", "4A2": "C.NGHỆ (Lưu)", "4B": "T.ANH (Huỳnh)", "4C": "TV",
      "5A": "T.ANH (Loan)", "5B": "C.NGHỆ (Thi)", "5C": "HĐTN"
    },

    "Thứ Ba_Chiều_1": {
      "1A1": "BDNK A.NHẠC (Hương)", "1A2": "BDNK GDTC (Chương)", "1B": "TIN HỌC (Lưu)", "1C": "TIN HỌC (Thi)",
      "2A1": "TV", "2A2": "TV", "2B": "TC Tiếng Việt", "2C": "TV",
      "3A1": "TV", "3A2": "BDNK GDTC (Vinh)", "3B": "M.THUẬT (My)", "3C": "T.ANH (Loan)",
      "4A1": "TV", "4A2": "T.ANH (Huỳnh)", "4B": "TV", "4C": "GDTC (Tranh)",
      "5A": "TV", "5B": "TV", "5C": "KH"
    },
    "Thứ Ba_Chiều_2": {
      "1A1": "BDNK GDTC (Chương)", "1A2": "BDNK A.NHẠC (Hương)", "1B": "HĐTN (Lưu)", "1C": "HĐTN (Thi)",
      "2A1": "TV", "2A2": "T", "2B": "M.THUẬT (My)", "2C": "TV",
      "3A1": "TNXH", "3A2": "T.ANH (Huỳnh)", "3B": "TV", "3C": "GDTC (Tranh)",
      "4A1": "BDNK GDTC (Vinh)", "4A2": "LS và ĐL", "4B": "TV", "4C": "KH",
      "5A": "TV", "5B": "TV", "5C": "T.ANH (Loan)"
    },
    "Thứ Ba_Chiều_3": {
      "1A1": "T", "1A2": "T", "1B": "TC Tiếng Việt", "1C": "TC Tiếng Việt",
      "2A1": "BDNK GDTC (Vinh)", "2A2": "A.NHẠC (Hương)", "2B": "BDNK M.THUẬT (My)", "2C": "BD-PĐ",
      "3A1": "T.ANH (Huỳnh)", "3A2": "TIN HỌC (Lưu)", "3B": "TV", "3C": "TC Toán",
      "4A1": "LS và ĐL", "4A2": "BDNK GDTC (Chương)", "4B": "KH", "4C": "T.ANH (Loan)",
      "5A": "TC Toán", "5B": "LS và ĐL", "5C": "GDTC (Tranh)"
    },

    // ==========================================
    // THỨ TƯ
    // ==========================================
    "Thứ Tư_Sáng_1": {
      "1A1": "TV", "1A2": "TV", "1B": "GDTC (Chương)", "1C": "ĐẠO ĐỨC (Bé Tý)",
      "2A1": "ĐẠO ĐỨC (Oanh)", "2A2": "M.THUẬT (My)", "2B": "TV", "2C": "TV",
      "3A1": "BDNK GDTC (Vinh)", "3A2": "T", "3B": "TIN HỌC (Thi)", "3C": "T",
      "4A1": "T.ANH (Loan)", "4A2": "T", "4B": "A.NHẠC (Hương)", "4C": "TV",
      "5A": "T", "5B": "T.ANH (Huỳnh)", "5C": "T"
    },
    "Thứ Tư_Sáng_2": {
      "1A1": "TV", "1A2": "TV", "1B": "A.NHẠC (Hương)", "1C": "TNXH (Bé Tý)",
      "2A1": "TNXH (Oanh)", "2A2": "GDTC (Vinh)", "2B": "T", "2C": "T",
      "3A1": "T", "3A2": "TC Tiếng Việt", "3B": "C.NGHỆ (Thi)", "3C": "TV",
      "4A1": "M.THUẬT (My)", "4A2": "KH", "4B": "T.ANH (Huỳnh)", "4C": "TV",
      "5A": "T.ANH (Loan)", "5B": "GDTC(Chương)", "5C": "LS và ĐL"
    },
    "Thứ Tư_Sáng_3": {
      "1A1": "T", "1A2": "T", "1B": "TV", "1C": "TV",
      "2A1": "TC Toán (Oanh)", "2A2": "TV", "2B": "TV", "2C": "TC Tiếng Việt",
      "3A1": "TC Tiếng Việt", "3A2": "T.ANH (Huỳnh)", "3B": "A.NHẠC (Hương)", "3C": "TV",
      "4A1": "TV", "4A2": "GDTC (Vinh)", "4B": "TIN HỌC (Thi)", "4C": "T.ANH (Loan)",
      "5A": "ĐẠO ĐỨC (Bé Tý)", "5B": "BDNK GDTC (Chương)", "5C": "CN (Toàn)"
    },
    "Thứ Tư_Sáng_4": {
      "1A1": "BD-PĐ", "1A2": "BD-PĐ", "1B": "TV", "1C": "TV",
      "2A1": "GDTC (Vinh)", "2A2": "TV", "2B": "TV", "2C": "TNXH (Toàn)",
      "3A1": "ĐẠO ĐỨC (Oanh)", "3A2": "M.THUẬT (My)", "3B": "HĐTN (Chương)", "3C": "TNXH",
      "4A1": "TV", "4A2": "T.ANH (Huỳnh)", "4B": "C.NGHỆ (Thi)", "4C": "T",
      "5A": "LS và ĐL", "5B": "A.NHẠC (Hương)", "5C": "T.ANH (Loan)"
    },

    "Thứ Tư_Chiều_1": {
      "1A1": "M.THUẬT (My)", "1A2": "TC Tiếng Việt", "1B": "ĐẠO ĐỨC (Bé Tý)", "1C": "TC Tiếng Việt",
      "2A1": "TV", "2A2": "T", "2B": "TV", "2C": "ĐĐ (Oanh)",
      "3A1": "HĐTN (Thi)", "3A2": "T.ANH (Huỳnh)", "3B": "T", "3C": "T.ANH (Loan)",
      "4A1": "T", "4A2": "A.NHẠC (Hương)", "4B": "T", "4C": "HĐTN (Vinh)",
      "5A": "C.NGHỆ (Lưu)", "5B": "T", "5C": "GDTC (Tranh)"
    },
    "Thứ Tư_Chiều_2": {
      "1A1": "TV", "1A2": "M.THUẬT (My)", "1B": "TNXH (Bé Tý)", "1C": "TV",
      "2A1": "T", "2A2": "TV", "2B": "TC Tiếng Việt", "2C": "GDTC (Vinh)",
      "3A1": "A.NHẠC (Hương)", "3A2": "HĐTN (Thi)", "3B": "TNXH", "3C": "ĐẠO ĐỨC (Oanh)",
      "4A1": "LS và ĐL", "4A2": "T.ANH (Huỳnh)", "4B": "TC Toán", "4C": "BDNK GDTC (Tranh)",
      "5A": "TIN HỌC (Lưu)", "5B": "TV", "5C": "T.ANH (Loan)"
    },
    "Thứ Tư_Chiều_3": {
      "1A1": "TV", "1A2": "A.NHẠC (Hương)", "1B": "TC Toán (Bé Tý)", "1C": "TV",
      "2A1": "M.THUẬT (My)", "2A2": "TC Tiếng Việt", "2B": "BD-PĐ", "2C": "HĐTN (Vinh)",
      "3A1": "T.ANH (Huỳnh)", "3A2": "TNXH (Oanh)", "3B": "TC Tiếng Việt", "3C": "TIN HỌC (Lưu)",
      "4A1": "KH", "4A2": "HĐTN (Thi)", "4B": "LS và ĐL", "4C": "T.ANH (Loan)",
      "5A": "TV", "5B": "KH", "5C": "BDNK GDTC (Tranh)"
    },

    // ==========================================
    // THỨ NĂM
    // ==========================================
    "Thứ Năm_Sáng_1": {
      "1A1": "TIN HỌC (Thi)", "1A2": "ĐẠO ĐỨC (Bé Tý)", "1B": "TV", "1C": "GDTC(Chương)",
      "2A1": "T", "2A2": "BDNK M.THUẬT (My)", "2B": "GDTC (Vinh)", "2C": "TV",
      "3A1": "TV", "3A2": "TV", "3B": "T", "3C": "T",
      "4A1": "A.NHẠC (Hương)", "4A2": "T.ANH (Huỳnh)", "4B": "T", "4C": "T",
      "5A": "T.ANH (Loan)", "5B": "T", "5C": "T"
    },
    "Thứ Năm_Sáng_2": {
      "1A1": "HĐTN (Thi)", "1A2": "TNXH (Bé Tý)", "1B": "TV", "1C": "TV",
      "2A1": "TV", "2A2": "TV", "2B": "TV", "2C": "TC Toán (Oanh)",
      "3A1": "T.ANH (Huỳnh)", "3A2": "TV", "3B": "TV", "3C": "HĐTN (Chương)",
      "4A1": "T.ANH (Loan)", "4A2": "M.THUẬT (My)", "4B": "HĐTN (Vinh)", "4C": "TV",
      "5A": "A.NHẠC (Hương)", "5B": "HĐTN (Tranh)", "5C": "TIN HỌC (Lưu)"
    },
    "Thứ Năm_Sáng_3": {
      "1A1": "ĐẠO ĐỨC (Bé Tý)", "1A2": "TIN HỌC (Thi)", "1B": "BDNK A.NHẠC (Hương)", "1C": "TV",
      "2A1": "BDNK M.THUẬT (My)", "2A2": "T", "2B": "T", "2C": "T",
      "3A1": "TV", "3A2": "TNXH (Oanh)", "3B": "T.ANH (Huỳnh)", "3C": "T.ANH (Loan)",
      "4A1": "BDNK GDTC (Vinh)", "4A2": "TV", "4B": "GDTC (Tranh)", "4C": "C.NGHỆ (Lưu)",
      "5A": "T", "5B": "GDTC(Chương)", "5C": "TV"
    },
    "Thứ Năm_Sáng_4": {
      "1A1": "TNXH (Bé Tý)", "1A2": "HĐTN (Thi)", "1B": "BDNK GDTC (Chương)", "1C": "BD-PĐ",
      "2A1": "TNXH (Oanh)", "2A2": "BDNK GDTC (Vinh)", "2B": "A.NHẠC (Hương)", "2C": "TV",
      "3A1": "M.THUẬT (My)", "3A2": "T", "3B": "GDTC (Tranh)", "3C": "TV",
      "4A1": "T", "4A2": "TV", "4B": "T.ANH (Huỳnh)", "4C": "TIN HỌC (Lưu)",
      "5A": "TV", "5B": "TV", "5C": "T.ANH (Loan)"
    },

    "Thứ Năm_Chiều_1": {
      "1A1": "TV", "1A2": "TV", "1B": "T", "1C": "BDNK A.NHẠC (Hương)",
      "2A1": "TV", "2A2": "TV", "2B": "TNXH (Oanh)", "2C": "TV",
      "3A1": "TIN HỌC (Lưu)", "3A2": "TV", "3B": "TC Toán", "3C": "TNXH",
      "4A1": "T.ANH (Loan)", "4A2": "TIN HỌC (Thi)", "4B": "TV", "4C": "ĐẠO ĐỨC (Bé Tý)",
      "5A": "HĐTN (Chương)", "5B": "T.ANH (Huỳnh)", "5C": "LS và ĐL"
    },
    "Thứ Năm_Chiều_2": {
      "1A1": "TV", "1A2": "TV", "1B": "GDTC (Chương)", "1C": "TNXH (Bé Tý)",
      "2A1": "TV", "2A2": "HĐTN (Lưu)", "2B": "TV", "2C": "TC Tiếng Việt",
      "3A1": "T", "3A2": "TC Toán", "3B": "ĐẠO ĐỨC (Oanh)", "3C": "TV",
      "4A1": "TIN HỌC (Thi)", "4A2": "TV", "4B": "T.ANH (Huỳnh)", "4C": "A.NHẠC (Hương)",
      "5A": "T.ANH (Loan)", "5B": "LS và ĐL", "5C": "ĐĐ (Toàn)"
    },
    "Thứ Năm_Chiều_3": {
      "1A1": "TC Tiếng Việt", "1A2": "TC Tiếng Việt", "1B": "TC Tiếng Việt", "1C": "TC Toán (Bé Tý)",
      "2A1": "BD-PĐ", "2A2": "TNXH (Oanh)", "2B": "TV", "2C": "TNXH (Toàn)",
      "3A1": "TV", "3A2": "C.NGHỆ (Lưu)", "3B": "T.ANH (Huỳnh)", "3C": "TC Tiếng Việt",
      "4A1": "C.NGHỆ (Thi)", "4A2": "T", "4B": "LS và ĐL", "4C": "LS và ĐL",
      "5A": "BDNK GDTC (Chương)", "5B": "TC Toán", "5C": "A.NHẠC (Hương)"
    },

    // ==========================================
    // THỨ SÁU
    // ==========================================
    "Thứ Sáu_Sáng_1": {
      "1A1": "TV", "1A2": "GDTC(Chương)", "1B": "TV", "1C": "TV",
      "2A1": "TC Tiếng Việt", "2A2": "TV", "2B": "GDTC (Vinh)", "2C": "TIN HỌC (Lưu)",
      "3A1": "T", "3A2": "T", "3B": "T", "3C": "GDTC (Tranh)",
      "4A1": "T", "4A2": "T", "4B": "T", "4C": "T",
      "5A": "T", "5B": "T.ANH (Huỳnh)", "5C": "M.THUẬT (My)"
    },
    "Thứ Sáu_Sáng_2": {
      "1A1": "GDTC(Chương)", "1A2": "TV", "1B": "TV", "1C": "TV",
      "2A1": "T", "2A2": "T", "2B": "BDNK GDTC (Vinh)", "2C": "BDNK M.THUẬT (My)",
      "3A1": "TV", "3A2": "TV", "3B": "TV", "3C": "C.NGHỆ (Lưu)",
      "4A1": "TV", "4A2": "TV", "4B": "TV", "4C": "GDTC (Tranh)",
      "5A": "HĐTN (SHL)", "5B": "T.ANH (Huỳnh)", "5C": "T"
    },
    "Thứ Sáu_Sáng_3": {
      "1A1": "TV", "1A2": "TV", "1B": "T", "1C": "T",
      "2A1": "TIN HỌC (Lưu)", "2A2": "HĐTN (SHL)", "2B": "T", "2C": "T",
      "3A1": "HĐTN (SHL)", "3A2": "GDTC (Tranh)", "3B": "T.ANH (Huỳnh)", "3C": "T",
      "4A1": "TV", "4A2": "BDNK GDTC (Chương)", "4B": "KH", "4C": "TV",
      "5A": "M.THUẬT (My)", "5B": "T", "5C": "TV"
    },
    "Thứ Sáu_Sáng_4": {
      "1A1": "HĐTN (SHL)", "1A2": "HĐTN (SHL)", "1B": "HĐTN (SHL)", "1C": "HĐTN (SHL)",
      "2A1": "HĐTN (SHL)", "2A2": "TIN HỌC (Lưu)", "2B": "HĐTN (SHL)", "2C": "HĐTN (SHL)",
      "3A1": "GDTC (Tranh)", "3A2": "HĐTN (SHL)", "3B": "HĐTN (SHL)", "3C": "HĐTN (SHL)",
      "4A1": "HĐTN (SHL)", "4A2": "HĐTN (SHL)", "4B": "HĐTN (SHL)", "4C": "HĐTN (SHL)",
      "5A": "GDTC(Chương)", "5B": "HĐTN (SHL)", "5C": "HĐTN (SHL)"
    }
  }
};

/**
 * Calculate weekly dates (Monday -> Friday) based on week number and optional startDate (dd/mm/yyyy or dd/mm)
 */
export function getWeekDatesFromStartDate(startDateStr: string, week: number = 1): string[] {
  return getWeekDatesList(week, startDateStr);
}

/**
 * Helper to check if a timetable slot cell matches a teacher or subject
 */
export function isSlotMatchingTeacherOrSubject(
  cellText: string,
  teacherName: string,
  specialistSubject?: string
): boolean {
  if (!cellText || cellText.trim() === "" || cellText === "SHCM") return false;
  const clean = cellText.trim();
  const lowerCell = clean.toLowerCase();
  const lowerName = teacherName.toLowerCase().trim();

  // 0. Tiết HĐTN thứ 2 (Chào cờ/SHDC) và thứ 6 (Sinh hoạt lớp/SHL) luôn do GVCN dạy
  if (
    lowerCell.includes("(cc)") ||
    lowerCell.includes("chào cờ") ||
    lowerCell.includes("(shl)") ||
    lowerCell.includes("sinh hoạt")
  ) {
    return false;
  }

  // Known teacher tags in parentheses
  const teacherTags = [
    { tag: "chương", key: "chương" },
    { tag: "vinh", key: "vinh" },
    { tag: "tranh", key: "tranh" },
    { tag: "hương", key: "hương" },
    { tag: "my", key: "my" },
    { tag: "huỳnh", key: "huỳnh" },
    { tag: "loan", key: "loan" },
    { tag: "lưu", key: "lưu" },
    { tag: "thi", key: "thi" },
    { tag: "bé tý", key: "bé tý" },
    { tag: "oanh", key: "oanh" },
    { tag: "toàn", key: "toàn" },
    { tag: "sang", key: "sang" },
  ];

  // If the cell specifies another teacher's tag, it only matches that teacher
  for (const t of teacherTags) {
    if (lowerCell.includes(`(${t.tag})`) || lowerCell.includes(`(${t.tag.replace(" ", "")})`)) {
      return lowerName.includes(t.key);
    }
  }

  // Direct match by full name or last word of teacher name
  const nameParts = lowerName.split(" ");
  const lastName = nameParts[nameParts.length - 1];

  if (lowerCell.includes(lowerName)) return true;
  if (lastName && (
    lowerCell.includes(`(${lastName})`) || 
    lowerCell.includes(`thầy ${lastName}`) || 
    lowerCell.includes(`cô ${lastName}`) ||
    lowerCell.endsWith(lastName)
  )) {
    return true;
  }

  // Match by specialist subject keywords if no specific teacher tag is present
  if (specialistSubject) {
    const sSub = specialistSubject.toLowerCase();
    if (sSub.includes("tiếng anh") || sSub.includes("anh văn")) {
      return lowerCell.startsWith("t.anh") || lowerCell.includes("tiếng anh");
    }
    if (sSub.includes("tin học")) {
      return lowerCell.startsWith("tin học") || lowerCell.startsWith("th ");
    }
    if (sSub.includes("âm nhạc")) {
      return lowerCell.startsWith("a.nhạc") || lowerCell.startsWith("âm nhạc");
    }
    if (sSub.includes("mĩ thuật") || sSub.includes("mỹ thuật")) {
      return lowerCell.startsWith("m.thuật") || lowerCell.startsWith("mĩ thuật");
    }
    if (sSub.includes("thể chất") || sSub.includes("gdtc")) {
      return lowerCell.startsWith("gdtc");
    }
    if (sSub.includes("đạo đức")) {
      return lowerCell.startsWith("đạo đức") || lowerCell === "đđ";
    }
    if (sSub.includes("trải nghiệm") || sSub.includes("hđtn")) {
      return lowerCell.startsWith("hđtn") || lowerCell.startsWith("hdtn");
    }
  }

  return false;
}

export const DAY_ORDER: Record<DayOfWeek, number> = {
  "Thứ Hai": 1,
  "Thứ Ba": 2,
  "Thứ Tư": 3,
  "Thứ Năm": 4,
  "Thứ Sáu": 5,
};

export const SESSION_ORDER: Record<SessionType, number> = {
  "Sáng": 1,
  "Chiều": 2,
};

/**
 * Universal Chronological Sorter:
 * Strict order: Day (Thứ Hai -> Thứ Sáu) -> Session (Sáng -> Chiều) -> Period (1 -> 5)
 */
export function sortScheduleChronologically<T extends {
  dayOfWeek?: DayOfWeek;
  day?: DayOfWeek;
  session?: SessionType;
  periodNumber?: number | string;
  period?: number;
}>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const dayA = a.dayOfWeek || a.day || "Thứ Hai";
    const dayB = b.dayOfWeek || b.day || "Thứ Hai";
    const dDiff = (DAY_ORDER[dayA] || 1) - (DAY_ORDER[dayB] || 1);
    if (dDiff !== 0) return dDiff;

    const sessA = a.session || "Sáng";
    const sessB = b.session || "Sáng";
    const sDiff = (SESSION_ORDER[sessA] || 1) - (SESSION_ORDER[sessB] || 1);
    if (sDiff !== 0) return sDiff;

    const pA = typeof a.periodNumber === "number" ? a.periodNumber : (typeof a.period === "number" ? a.period : Number(a.periodNumber || a.period || 1));
    const pB = typeof b.periodNumber === "number" ? b.periodNumber : (typeof b.period === "number" ? b.period : Number(b.periodNumber || b.period || 1));
    return pA - pB;
  });
}

// Helper to generate full weekly schedule items for a specific class (GVCN)
export function generateScheduleForClass(
  master: MasterTimetable,
  targetClass: string,
  week: number,
  startDateStr: string,
  teacherName: string
): ScheduleItem[] {
  const items: ScheduleItem[] = [];
  const dates = getWeekDatesFromStartDate(startDateStr, week);
  const subjectCounters: Record<string, number> = {};

  DAYS_OF_WEEK.forEach((day, dIdx) => {
    // Sáng (Tiết 1 -> 4)
    for (let p = 1; p <= 4; p++) {
      const key = `${day}_Sáng_${p}`;
      const subjectRaw = master.slots[key]?.[targetClass] || "";
      if (subjectRaw && subjectRaw.trim() !== "") {
        const item = mapRawSubjectToScheduleItem(
          subjectRaw,
          day,
          dates[dIdx],
          "Sáng",
          p,
          targetClass,
          week,
          teacherName,
          undefined,
          subjectCounters
        );
        if (item) items.push(item);
      }
    }

    // Chiều (Tiết 1 -> 3) - Thứ 6 không có buổi chiều
    if (day !== "Thứ Sáu") {
      for (let p = 1; p <= 3; p++) {
        const key = `${day}_Chiều_${p}`;
        const subjectRaw = master.slots[key]?.[targetClass] || "";
        if (subjectRaw && subjectRaw.trim() !== "" && subjectRaw !== "SHCM") {
          const item = mapRawSubjectToScheduleItem(
            subjectRaw,
            day,
            dates[dIdx],
            "Chiều",
            p,
            targetClass,
            week,
            teacherName,
            undefined,
            subjectCounters
          );
          if (item) items.push(item);
        }
      }
    }
  });

  return sortScheduleChronologically(items);
}

// Helper to generate full weekly schedule items for a Specialist Teacher (GV Chuyên Bộ Môn)
export function generateSpecialistSchedule(
  master: MasterTimetable,
  teacherName: string,
  specialistSubject: string,
  week: number,
  startDateStr: string,
  assignedClasses: string[] = DEFAULT_CLASSES
): ScheduleItem[] {
  const items: ScheduleItem[] = [];
  const dates = getWeekDatesFromStartDate(startDateStr, week);
  const classSubjectCounters: Record<string, Record<string, number>> = {};

  DAYS_OF_WEEK.forEach((day, dIdx) => {
    // Sáng (Tiết 1 -> 4)
    for (let p = 1; p <= 4; p++) {
      const key = `${day}_Sáng_${p}`;
      const slotRow = master.slots[key] || {};

      assignedClasses.forEach((cls) => {
        const cell = (slotRow[cls] || "").trim();
        if (cell && isSlotMatchingTeacherOrSubject(cell, teacherName, specialistSubject)) {
          if (!classSubjectCounters[cls]) classSubjectCounters[cls] = {};
          const item = mapRawSubjectToScheduleItem(
            cell,
            day,
            dates[dIdx],
            "Sáng",
            p,
            cls,
            week,
            teacherName,
            specialistSubject,
            classSubjectCounters[cls]
          );
          if (item) items.push(item);
        }
      });
    }

    // Chiều (Tiết 1 -> 3) - Thứ Sáu không có buổi chiều
    if (day !== "Thứ Sáu") {
      for (let p = 1; p <= 3; p++) {
        const key = `${day}_Chiều_${p}`;
        const slotRow = master.slots[key] || {};

        assignedClasses.forEach((cls) => {
          const cell = (slotRow[cls] || "").trim();
          if (cell && cell !== "SHCM" && isSlotMatchingTeacherOrSubject(cell, teacherName, specialistSubject)) {
            if (!classSubjectCounters[cls]) classSubjectCounters[cls] = {};
            const item = mapRawSubjectToScheduleItem(
              cell,
              day,
              dates[dIdx],
              "Chiều",
              p,
              cls,
              week,
              teacherName,
              specialistSubject,
              classSubjectCounters[cls]
            );
            if (item) items.push(item);
          }
        });
      }
    }
  });

  return sortScheduleChronologically(items);
}

// Unified weekly schedule generator based on SchoolInfo
export function generateWeeklyScheduleFromTimetable(
  master: MasterTimetable,
  targetClass: string,
  teacherName: string,
  week: number,
  startDateStr: string,
  teacherType: "homeroom" | "specialist" = "homeroom",
  specialistSubject: string = "Tiếng Anh",
  assignedClasses: string[] = DEFAULT_CLASSES
): ScheduleItem[] {
  if (teacherType === "specialist") {
    return generateSpecialistSchedule(master, teacherName, specialistSubject, week, startDateStr, assignedClasses);
  }
  return generateScheduleForClass(master, targetClass, week, startDateStr, teacherName);
}

// Helper to map shorthand cell string to detailed Lesson Plan Item
export function mapRawSubjectToScheduleItem(
  raw: string,
  day: DayOfWeek,
  dateStr: string,
  session: SessionType,
  period: number,
  className: string,
  week: number,
  teacherName: string,
  specialistSubject?: string,
  subjectOccurrenceTracker?: Record<string, number>
): ScheduleItem {
  const clean = raw.trim();
  const gradeNum = ((parseInt(className.charAt(0)) as Grade) || 1) as Grade;

  let subject = "Tiếng Việt";
  let subSubject = "";
  let lessonTitle = clean;
  let curriculumPeriod: string | number = week * 4 + period;
  let integrationNotes = "";
  let note = "";
  let actualTeacher = teacherName;

  // 1. Detect tagged teacher in parentheses
  if (clean.includes("Chương")) {
    actualTeacher = "Thầy Chương";
    note = "GV Chuyên: Thầy Chương (GDTC & HĐTN)";
  } else if (clean.includes("Vinh")) {
    actualTeacher = "Thầy Vinh";
    note = "GV Chuyên: Thầy Vinh (GDTC & HĐTN)";
  } else if (clean.includes("Tranh")) {
    actualTeacher = "Cô Tranh";
    note = "GV Chuyên: Cô Tranh (GDTC & HĐTN)";
  } else if (clean.includes("Hương")) {
    actualTeacher = "Cô Hương";
    note = "GV Chuyên: Cô Hương (Âm nhạc)";
  } else if (clean.includes("My")) {
    actualTeacher = "Cô My";
    note = "GV Chuyên: Cô My (Mĩ thuật)";
  } else if (clean.includes("Huỳnh")) {
    actualTeacher = "Cô Huỳnh";
    note = "GV Chuyên: Cô Huỳnh (Tiếng Anh)";
  } else if (clean.includes("Loan")) {
    actualTeacher = "Cô Loan";
    note = "GV Chuyên: Cô Loan (Tiếng Anh)";
  } else if (clean.includes("Lưu")) {
    actualTeacher = "Cô Lưu";
    note = "GV Chuyên: Cô Lưu (Tin học & Công nghệ)";
  } else if (clean.includes("Thi")) {
    actualTeacher = "Cô Thi";
    note = "GV Chuyên: Cô Thi (Tin học & Công nghệ)";
  } else if (clean.includes("Bé Tý")) {
    actualTeacher = "Cô Bé Tý";
    note = "GV Bộ môn: Cô Bé Tý";
  } else if (clean.includes("Oanh")) {
    actualTeacher = "Cô Oanh";
    note = "GV Bộ môn: Cô Oanh";
  } else if (clean.includes("Toàn")) {
    actualTeacher = "Thầy Toàn";
    note = "GV Bộ môn: Thầy Toàn";
  } else if (clean.includes("Sang")) {
    actualTeacher = "Thầy Nguyễn Văn Sang";
    note = "GVCN: Thầy Nguyễn Văn Sang (Lớp 3C)";
  }

  // 2. Map Subject details theo KHDH từng khối lớp

  // 2.1 TIẾNG ANH
  if (clean.includes("T.ANH") || clean.includes("TA") || clean.includes("Tiếng Anh") || (specialistSubject && specialistSubject.includes("Tiếng Anh"))) {
    subject = `TIẾNG ANH ${gradeNum}`;
    const pInW = subjectOccurrenceTracker ? (subjectOccurrenceTracker["tiếng anh"] = (subjectOccurrenceTracker["tiếng anh"] || 0) + 1) : ((period % 4) + 1);
    const info = getGradeCurriculumLesson(gradeNum, "Tiếng Anh", week, pInW);
    lessonTitle = info.lessonTitle;
    curriculumPeriod = info.curriculumPeriod;
    integrationNotes = info.integrationNotes || "Tích hợp 4 kỹ năng Tiếng Anh chuẩn GDPT 2018; giao tiếp quốc tế.";
    if (!note) note = "GV Chuyên: Tiếng Anh";
  }

  // 2.2 TIN HỌC / NĂNG LỰC SỐ
  else if (clean.includes("TIN HỌC") || clean.includes("Tin học") || (specialistSubject && specialistSubject.includes("Tin học"))) {
    subject = `TIN HỌC ${gradeNum}`;
    const pInW = subjectOccurrenceTracker ? (subjectOccurrenceTracker["tin học"] = (subjectOccurrenceTracker["tin học"] || 0) + 1) : ((period % 2) + 1);
    const info = getGradeCurriculumLesson(gradeNum, "Tin học", week, pInW);
    lessonTitle = info.lessonTitle;
    curriculumPeriod = info.curriculumPeriod;
    integrationNotes = info.integrationNotes || "Tích hợp NLS: Sử dụng thiết bị số an toàn, làm quen phần mềm học tập.";
    if (!note) note = "GV Chuyên: Tin học";
  }

  // 2.3 ÂM NHẠC & BỒI DƯỠNG NĂNG KHIẾU ÂM NHẠC
  else if (clean.includes("BDNK A.NHẠC") || clean.includes("BDNK Âm nhạc")) {
    subject = `BDNK ÂM NHẠC ${gradeNum}`;
    lessonTitle = `Bồi dưỡng Năng khiếu Âm nhạc: Luyện thanh & Hát đúng cao độ, trường độ bài hát Tuần ${week}`;
    curriculumPeriod = 1;
    integrationNotes = "Tích hợp cảm thụ âm nhạc & phát triển năng khiếu nghệ thuật thiếu nhi.";
    if (!note) note = "GV Chuyên: Cô Hương (Âm nhạc)";
  } else if (clean.includes("A.NHẠC") || clean.includes("Âm nhạc") || (specialistSubject && specialistSubject.includes("Âm nhạc"))) {
    subject = `ÂM NHẠC ${gradeNum}`;
    const info = getGradeCurriculumLesson(gradeNum, "Âm nhạc", week, 1);
    lessonTitle = info.lessonTitle;
    curriculumPeriod = info.curriculumPeriod;
    integrationNotes = info.integrationNotes || "Tích hợp văn hóa truyền thống & cảm thụ giai điệu.";
    if (!note) note = "GV Chuyên: Cô Hương (Âm nhạc)";
  }

  // 2.4 MĨ THUẬT & BỒI DƯỠNG NĂNG KHIẾU MĨ THUẬT
  else if (clean.includes("BDNK M.THUẬT") || clean.includes("BDNK Mĩ thuật")) {
    subject = `BDNK MĨ THUẬT ${gradeNum}`;
    lessonTitle = `Bồi dưỡng Năng khiếu Mĩ thuật: Rèn kĩ năng vẽ nét, tạo hình và phối màu sáng tạo (Tuần ${week})`;
    curriculumPeriod = 1;
    integrationNotes = "Tích hợp STEM tạo hình & Kĩ năng hội họa tự do.";
    if (!note) note = "GV Chuyên: Cô My (Mĩ thuật)";
  } else if (clean.includes("M.THUẬT") || clean.includes("Mĩ thuật") || (specialistSubject && specialistSubject.includes("Mĩ thuật"))) {
    subject = `MĨ THUẬT ${gradeNum}`;
    const info = getGradeCurriculumLesson(gradeNum, "Mĩ thuật", week, 1);
    lessonTitle = info.lessonTitle;
    curriculumPeriod = info.curriculumPeriod;
    integrationNotes = info.integrationNotes || "Tích hợp STEM sáng tạo, rèn luyện óc quan sát thẩm mĩ.";
    if (!note) note = "GV Chuyên: Cô My (Mĩ thuật)";
  }

  // 2.5 GIÁO DỤC THỂ CHẤT & BỒI DƯỠNG NĂNG KHIẾU THỂ CHẤT
  else if (clean.includes("BDNK GDTC") || clean.includes("BDNK Thể chất")) {
    subject = `BDNK THỂ CHẤT ${gradeNum}`;
    lessonTitle = `Bồi dưỡng Năng khiếu Thể chất: Rèn luyện thể lực & Các trò chơi vận động phối hợp (Tuần ${week})`;
    curriculumPeriod = 1;
    integrationNotes = "Tích hợp rèn luyện sức khỏe, tác phong nhanh nhẹn và tinh thần đồng đội.";
  } else if (clean.includes("GDTC") || clean.includes("Thể chất") || (specialistSubject && specialistSubject.includes("Thể chất"))) {
    subject = `GIÁO DỤC THỂ CHẤT ${gradeNum}`;
    const pInW = subjectOccurrenceTracker ? (subjectOccurrenceTracker["giáo dục thể chất"] = (subjectOccurrenceTracker["giáo dục thể chất"] || 0) + 1) : (day === "Thứ Hai" || day === "Thứ Ba" ? 1 : 2);
    const info = getGradeCurriculumLesson(gradeNum, "Giáo dục thể chất", week, pInW);
    lessonTitle = info.lessonTitle;
    curriculumPeriod = info.curriculumPeriod;
    integrationNotes = info.integrationNotes || "Tích hợp rèn luyện thể lực, tư thế đứng nghiêm, quay trái quay phải.";
  }

  // 2.6 HOẠT ĐỘNG TRẢI NGHIỆM (HĐTN) - Tiết Thứ 2 và Thứ 6 do GVCN dạy
  else if (clean === "HĐTN (CC)" || clean.includes("Chào cờ") || (clean.includes("HĐTN") && day === "Thứ Hai" && period === 1)) {
    subject = `HĐTN ${gradeNum}`;
    subSubject = "Sinh hoạt dưới cờ";
    note = "Chào cờ (GVCN)";
    actualTeacher = teacherName;
    const info = getGradeCurriculumLesson(gradeNum, "hoạt động trải nghiệm", week, 1);
    lessonTitle = info.lessonTitle;
    curriculumPeriod = (week - 1) * 3 + 1;
    integrationNotes = info.integrationNotes || "QCN: Quyền và nghĩa vụ học tập, nề nếp kỷ cương dưới cờ.";
  } else if (clean === "HĐTN (SHL)" || clean.includes("Sinh hoạt") || (clean.includes("HĐTN") && day === "Thứ Sáu")) {
    subject = `HĐTN ${gradeNum}`;
    subSubject = "Sinh hoạt lớp";
    note = "Sinh hoạt lớp (GVCN)";
    actualTeacher = teacherName;
    const info = getGradeCurriculumLesson(gradeNum, "hoạt động trải nghiệm", week, 3);
    lessonTitle = info.lessonTitle;
    curriculumPeriod = (week - 1) * 3 + 3;
    integrationNotes = info.integrationNotes || "Tuyên dương gương sáng, xây dựng tình bạn thân thiện, rèn luyện nề nếp.";
  } else if (clean.includes("HĐTN") || clean.includes("HDTN")) {
    subject = `HĐTN ${gradeNum}`;
    subSubject = "Hoạt động giáo dục theo chủ đề";
    const info = getGradeCurriculumLesson(gradeNum, "hoạt động trải nghiệm", week, 2);
    lessonTitle = info.lessonTitle;
    curriculumPeriod = (week - 1) * 3 + 2;
    integrationNotes = info.integrationNotes || "Tích hợp kĩ năng giao tiếp, tự phục vụ và ứng xử văn minh.";
  }

  // 2.7 BỒI DƯỠNG - PHỤ ĐẠO (BD-PĐ)
  else if (clean === "BD-PĐ" || clean.includes("BD-PĐ")) {
    subject = `BD - PHỤ ĐẠO ${gradeNum}`;
    lessonTitle = `Bồi dưỡng học sinh năng khiếu & Phụ đạo học sinh cần giúp đỡ (Tuần ${week})`;
    curriculumPeriod = 1;
    integrationNotes = "Phân hóa đối tượng học sinh, củng cố kiến thức trọng tâm và phát triển tư duy.";
    note = "Bồi dưỡng - Phụ đạo";
  }

  // 2.8 TĂNG CƯỜNG TIẾNG VIỆT (TC Tiếng Việt)
  else if (clean.includes("TC Tiếng Việt") || clean.includes("TCTV")) {
    subject = `TC TIẾNG VIỆT ${gradeNum}`;
    const pInW = period;
    lessonTitle = `Tăng cường Tiếng Việt: Rèn kĩ năng đọc trôi chảy, viết đúng chính tả & Mở rộng vốn từ (Tiết ${pInW})`;
    curriculumPeriod = pInW;
    integrationNotes = "Rèn luyện sự tự tin trong diễn đạt tiếng Việt và giữ gìn vở sạch chữ đẹp.";
    note = "Tăng cường Tiếng Việt";
  }

  // 2.9 TĂNG CƯỜNG TOÁN (TC Toán)
  else if (clean.includes("TC Toán") || clean.includes("TCT")) {
    subject = `TC TOÁN ${gradeNum}`;
    lessonTitle = `Tăng cường Toán: Củng cố kĩ năng tính nhẩm và giải bài toán có lời văn (Tuần ${week})`;
    curriculumPeriod = 1;
    integrationNotes = "Rèn luyện tư duy logic toán học và khả năng áp dụng vào thực tiễn.";
    if (!note) note = "Tăng cường Toán";
  }

  // 2.10 CÔNG NGHỆ (C.NGHỆ / CN)
  else if (clean.includes("C.NGHỆ") || clean.includes("Công nghệ") || clean === "CN" || clean.startsWith("CN ")) {
    subject = `CÔNG NGHỆ ${gradeNum}`;
    const pInW = subjectOccurrenceTracker ? (subjectOccurrenceTracker["công nghệ"] = (subjectOccurrenceTracker["công nghệ"] || 0) + 1) : 1;
    const info = getGradeCurriculumLesson(gradeNum, "công nghệ", week, pInW);
    lessonTitle = info.lessonTitle;
    curriculumPeriod = info.curriculumPeriod;
    integrationNotes = info.integrationNotes || "Tích hợp STEM: Tìm hiểu vật liệu và dụng cụ công nghệ đời sống.";
  }

  // 2.11 ĐẠO ĐỨC (ĐĐ / ĐẠO ĐỨC)
  else if (clean.includes("ĐẠO ĐỨC") || clean.includes("ĐĐ")) {
    subject = `ĐẠO ĐỨC ${gradeNum}`;
    const pInW = subjectOccurrenceTracker ? (subjectOccurrenceTracker["đạo đức"] = (subjectOccurrenceTracker["đạo đức"] || 0) + 1) : 1;
    const info = getGradeCurriculumLesson(gradeNum, "đạo đức", week, pInW);
    lessonTitle = info.lessonTitle;
    curriculumPeriod = info.curriculumPeriod;
    integrationNotes = info.integrationNotes || "Giáo dục lòng nhân ái, lễ phép với thầy cô và hòa nhã với bạn bè.";
  }

  // 2.12 KHOA HỌC (KH) - Dành cho Lớp 4, 5
  else if (clean === "KH" || clean.includes("Khoa học")) {
    subject = `KHOA HỌC ${gradeNum}`;
    const pInW = subjectOccurrenceTracker ? (subjectOccurrenceTracker["khoa học"] = (subjectOccurrenceTracker["khoa học"] || 0) + 1) : (day === "Thứ Hai" || day === "Thứ Ba" ? 1 : 2);
    const info = getGradeCurriculumLesson(gradeNum, "khoa học", week, pInW);
    lessonTitle = info.lessonTitle;
    curriculumPeriod = info.curriculumPeriod;
    integrationNotes = info.integrationNotes || "Tích hợp BVMT: Ý thức bảo vệ nguồn nước và sử dụng năng lượng tiết kiệm.";
  }

  // 2.13 LỊCH SỬ VÀ ĐỊA LÍ (LS và ĐL) - Dành cho Lớp 4, 5
  else if (clean.includes("LS và ĐL") || clean.includes("LS&ĐL") || clean.includes("Lịch sử")) {
    subject = `LỊCH SỬ VÀ ĐỊA LÍ ${gradeNum}`;
    const pInW = subjectOccurrenceTracker ? (subjectOccurrenceTracker["lịch sử và địa lí"] = (subjectOccurrenceTracker["lịch sử và địa lí"] || 0) + 1) : (day === "Thứ Hai" || day === "Thứ Ba" ? 1 : 2);
    const info = getGradeCurriculumLesson(gradeNum, "lịch sử và địa lí", week, pInW);
    lessonTitle = info.lessonTitle;
    curriculumPeriod = info.curriculumPeriod;
    integrationNotes = info.integrationNotes || "Giáo dục lòng yêu nước, tự hào về danh lam thắng cảnh và truyền thống quê hương.";
  }

  // 2.14 TỰ NHIÊN VÀ XÃ HỘI (TNXH) - Dành cho Lớp 1, 2, 3
  else if (clean.includes("TNXH") || clean.includes("Tự nhiên")) {
    subject = `TNXH ${gradeNum}`;
    const pInW = subjectOccurrenceTracker ? (subjectOccurrenceTracker["tự nhiên và xã hội"] = (subjectOccurrenceTracker["tự nhiên và xã hội"] || 0) + 1) : (day === "Thứ Hai" || day === "Thứ Ba" ? 1 : 2);
    const info = getGradeCurriculumLesson(gradeNum, "tự nhiên và xã hội", week, pInW);
    lessonTitle = info.lessonTitle;
    curriculumPeriod = info.curriculumPeriod;
    integrationNotes = info.integrationNotes || "Tích hợp giữ gìn vệ sinh thân thể, bảo vệ môi trường trường lớp.";
  }

  // 2.15 TOÁN (T / Toán)
  else if (clean === "T" || clean.startsWith("T ") || clean.includes("Toán")) {
    subject = `TOÁN ${gradeNum}`;
    const pInW = subjectOccurrenceTracker ? (subjectOccurrenceTracker["toán"] = (subjectOccurrenceTracker["toán"] || 0) + 1) : (day === "Thứ Hai" ? 1 : (day === "Thứ Ba" ? 2 : (day === "Thứ Tư" ? 3 : (day === "Thứ Năm" ? 4 : 5))));

    const info = getGradeCurriculumLesson(gradeNum, "toán", week, pInW);
    lessonTitle = info.lessonTitle;
    curriculumPeriod = info.curriculumPeriod;
    integrationNotes = info.integrationNotes || "Rèn luyện tư duy tính toán, năng lực giải quyết vấn đề toán học.";
  }

  // 2.16 TIẾNG VIỆT (TV / Tiếng Việt)
  else {
    subject = `TIẾNG VIỆT ${gradeNum}`;
    const pInW = subjectOccurrenceTracker ? (subjectOccurrenceTracker["tiếng việt"] = (subjectOccurrenceTracker["tiếng việt"] || 0) + 1) : 1;

    const info = getGradeCurriculumLesson(gradeNum, "tiếng việt", week, pInW);
    lessonTitle = info.lessonTitle;
    subSubject = info.subSubject || "";
    curriculumPeriod = info.curriculumPeriod;
    integrationNotes = info.integrationNotes || "Rèn luyện năng lực ngôn ngữ, kĩ năng đọc - viết - nói - nghe chuẩn mực.";
  }

  return {
    id: `item-${day}-${session}-${period}-${className}-${Math.random().toString(36).substring(2, 7)}`,
    day,
    dateStr,
    session,
    period,
    subject,
    subSubject,
    curriculumPeriod,
    lessonTitle,
    integrationNotes,
    note,
    teacherName: actualTeacher,
    className,
  };
}
