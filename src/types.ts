export type Grade = 1 | 2 | 3 | 4 | 5;
export type TeacherType = "homeroom" | "specialist";

export interface SchoolInfo {
  schoolName: string;
  departmentName: string; // Phòng GD&ĐT hoặc UBND Xã/Huyện
  branchName: string; // Phân hiệu / Điểm trường
  academicYear: string; // 2026 - 2027
  week: number;
  startDate: string; // 21/09/2026
  endDate: string; // 25/09/2026
  teacherName: string; // Nguyễn Hoàng Tuấn
  teacherType: TeacherType; // "homeroom" (GVCN) hoặc "specialist" (GV Bộ môn/Chuyên)
  specialistSubject?: string; // Tiếng Anh, Tin học, Âm nhạc, Mĩ thuật, Giáo dục thể chất, v.v.
  assignedClasses?: string[]; // Các lớp giảng dạy (dành cho GV Chuyên)
  grade: Grade;
  className: string; // 5A, 1A, 2/2,...
  principalName?: string; // Tên Hiệu trưởng ký duyệt
  departmentHeadName?: string; // Tên Tổ trưởng CM ký duyệt
  fontSize: 12 | 13 | 14;
  fontFamily: "Times New Roman" | "Arial";
}

export type DayOfWeek = "Thứ Hai" | "Thứ Ba" | "Thứ Tư" | "Thứ Năm" | "Thứ Sáu";
export type SessionType = "Sáng" | "Chiều";

export interface TimetableSlot {
  id: string;
  day: DayOfWeek;
  session: SessionType;
  period: number; // 1 -> 5 sáng, 1 -> 3 chiều
  subject: string; // Tiếng Việt, Toán, Đạo đức, HĐTN,...
  subSubject?: string; // Đọc, Viết, LTVC, Kể chuyện...
  teacher?: string;
  room?: string;
  className: string;
}

export interface MasterTimetable {
  schoolName: string;
  branchName?: string;
  effectiveDate: string;
  classes: string[]; // ['1A', '1B', '2A', '2B', '3A', '3B', '4A', '4B', '5A', '5B']
  slots: Record<string, Record<string, string>>; // key: `${day}_${session}_${period}`, value: Record<className, string (e.g. "TV (Tuấn)" or "Toán")>
}

export interface ScheduleItem {
  id: string;
  day: DayOfWeek;
  dateStr: string; // 21/09
  session: SessionType;
  period: number;
  subject: string;
  subSubject?: string;
  curriculumPeriod: number | string; // Tiết PPCT (vd: 15)
  lessonTitle: string; // Đọc: Tiếng hạt nảy mầm
  integrationNotes?: string; // Tích hợp AI (1.A1.1), GDQPAN, GDDD...
  note?: string; // Chào cờ, Sinh hoạt, GV dạy...
  teacherName?: string;
  className: string;
}

export interface LessonActivity {
  name: string; // 1. Khởi động, 2. Khám phá, 3. Luyện tập, 4. Vận dụng
  objective: string; // Mục tiêu
  teacherActivity: string; // Hoạt động của giáo viên (cột 1)
  studentActivity: string; // Hoạt động của học sinh (cột 2)
}

export interface LessonPlan {
  id: string;
  scheduleItemId?: string;
  grade: Grade;
  subject: string;
  subSubject?: string;
  periodNumber: number | string; // Tiết theo tuần (vd: Tiết 2)
  curriculumPeriod: number | string; // Tiết PPCT (vd: Tiết 15)
  lessonTitle: string;
  week: number;
  dayOfWeek: DayOfWeek;
  session?: SessionType;
  dateStr?: string;
  teacherName: string;
  className: string;
  schoolName: string;
  departmentName?: string;
  branchName?: string;
  objectives: {
    specificCompetencies: string[]; // 1. Năng lực đặc thù
    generalCompetencies: string[]; // 2. Năng lực chung (tự chủ, giao tiếp, giải quyết vấn đề)
    qualities: string[]; // 3. Phẩm chất (yêu nước, nhân ái, chăm chỉ, trung thực, trách nhiệm)
    integrations?: {
      ai?: string; // Tích hợp AI (mã và mô tả)
      digitalCompetence?: string; // Năng lực số (CV 3456)
      humanRights?: string; // Quyền con người (QCN)
      defense?: string; // Giáo dục Quốc phòng & An ninh (TT 08/2024)
      nutrition?: string; // Giáo dục Dinh dưỡng
      stem?: string; // Giáo dục STEM / Học thông qua chơi
      environment?: string; // Bảo vệ môi trường
      lifeSkills?: string; // Kỹ năng sống
    };
  };
  materials: {
    teacher: string[];
    student: string[];
  };
  activities: LessonActivity[];
  postLessonAdjustment: string; // IV. Điều chỉnh sau bài dạy
}

export interface IntegrationTopic {
  id: string;
  category: "AI" | "NLS" | "QCN" | "GDQPAN" | "GDDD" | "STEM" | "BVMT" | "KNS";
  code?: string; // vd: 1.A1.1, 4.C2.1, 1.1.CB1a
  grade: Grade | "all";
  subject?: string;
  lessonAddress?: string;
  content: string;
  suggestedActivity: string;
}
