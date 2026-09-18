import { DayOfWeek, Grade, LessonPlan, MasterTimetable, ScheduleItem, SchoolInfo, TeacherType } from "../types";
import { DEFAULT_CLASSES, DEFAULT_TEACHERS, generateWeeklyScheduleFromTimetable, TeacherInfo } from "../data/defaultTimetables";
import { generateFullWeekLessonPlans } from "../data/curriculumData";

/**
 * Filter schedule items to strictly include only periods directly taught by the teacher
 * (e.g., removing specialist subjects from a homeroom teacher's personal schedule)
 */
export function filterPersonalTeacherSchedule(
  items: ScheduleItem[],
  teacherType: TeacherType = "homeroom"
): ScheduleItem[] {
  if (teacherType === "specialist") {
    // For specialist teachers, all items in their schedule are already their taught periods
    return items;
  }
  // For homeroom teachers, exclude specialist and subject-specific periods taught by other teachers
  // Tiết HĐTN thứ 2 (CC/SHDC) và thứ 6 (SHL) luôn do GVCN dạy
  return items.filter((it) => {
    if (it.day === "Thứ Hai" && (it.subject.includes("HĐTN") || it.subSubject?.includes("dưới cờ") || it.note?.includes("Chào cờ"))) {
      return true;
    }
    if (it.day === "Thứ Sáu" && (it.subject.includes("HĐTN") || it.subSubject?.includes("lớp") || it.note?.includes("Sinh hoạt"))) {
      return true;
    }
    return !it.note || (!it.note.includes("GV Chuyên") && !it.note.includes("GV Bộ môn"));
  });
}

/**
 * Generate full teaching schedule & lesson plans specifically for any teacher in the school
 */
export function getScheduleAndPlansForTeacher(
  teacher: TeacherInfo,
  masterTimetable: MasterTimetable,
  currentSchoolInfo: SchoolInfo,
  week?: number
): {
  schoolInfo: SchoolInfo;
  scheduleItems: ScheduleItem[];
  personalScheduleItems: ScheduleItem[];
  lessonPlans: LessonPlan[];
} {
  const selectedWeek = week || currentSchoolInfo.week || 1;
  const isHomeroom = teacher.type === "homeroom";
  
  let targetClass = currentSchoolInfo.className;
  let targetGrade = currentSchoolInfo.grade;

  if (isHomeroom && teacher.assignedClasses && teacher.assignedClasses.length > 0) {
    targetClass = teacher.assignedClasses[0];
    const gNum = parseInt(targetClass.charAt(0)) as Grade;
    if (!isNaN(gNum) && gNum >= 1 && gNum <= 5) {
      targetGrade = gNum;
    }
  }

  const teacherSchoolInfo: SchoolInfo = {
    ...currentSchoolInfo,
    teacherName: teacher.name,
    teacherType: teacher.type as TeacherType,
    specialistSubject: teacher.specialistSubject || currentSchoolInfo.specialistSubject || "Tiếng Anh",
    assignedClasses: teacher.assignedClasses || (isHomeroom ? [targetClass] : DEFAULT_CLASSES),
    className: targetClass,
    grade: targetGrade,
    week: selectedWeek,
  };

  // Generate the full schedule from the master timetable
  const rawSchedule = generateWeeklyScheduleFromTimetable(
    masterTimetable,
    teacherSchoolInfo.className,
    teacherSchoolInfo.teacherName,
    teacherSchoolInfo.week,
    teacherSchoolInfo.startDate,
    teacherSchoolInfo.teacherType,
    teacherSchoolInfo.specialistSubject,
    teacherSchoolInfo.assignedClasses
  );

  // Filter personal schedule (excluding specialist periods for GVCN)
  const personalSchedule = filterPersonalTeacherSchedule(rawSchedule, teacherSchoolInfo.teacherType);

  // Generate Lesson Plans (KHBD) specifically for this teacher's taught subjects
  const plans = generateFullWeekLessonPlans(teacherSchoolInfo, rawSchedule);

  return {
    schoolInfo: teacherSchoolInfo,
    scheduleItems: rawSchedule,
    personalScheduleItems: personalSchedule,
    lessonPlans: plans,
  };
}
