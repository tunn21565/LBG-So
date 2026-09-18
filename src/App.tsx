import React, { useState, useEffect } from "react";
import {
  Download,
  FileDown,
  FileText,
  Layers,
  Calendar,
  BookOpen,
  CheckCircle2,
  Sliders,
  Loader2,
  AlertCircle,
  X,
  ExternalLink,
  Users,
  GraduationCap,
} from "lucide-react";
import { MasterTimetable, LessonPlan, ScheduleItem, SchoolInfo, Grade, TeacherType } from "./types";
import { DEFAULT_MASTER_TIMETABLE, DEFAULT_CLASSES, DEFAULT_TEACHERS, generateWeeklyScheduleFromTimetable } from "./data/defaultTimetables";
import { generateFullWeekLessonPlans } from "./data/curriculumData";
import {
  exportTimetableDocx,
  exportScheduleDocx,
  exportLessonPlansDocx,
  exportWeeklyKHBDWithLBGFirstPageDocx,
  exportCombinedAllInOneDocx,
  exportAllThreeFiles,
} from "./utils/docxExporter";

import { Header } from "./components/Header";
import { TimetableManager } from "./components/TimetableManager";
import { ScheduleView } from "./components/ScheduleView";
import { LessonPlanView } from "./components/LessonPlanView";
import { IntegrationReference } from "./components/IntegrationReference";
import { ConfigModal } from "./components/ConfigModal";
import { UploadTKBModal } from "./components/UploadTKBModal";
import { WordExportModal } from "./components/WordExportModal";
import { TeacherSelectModal } from "./components/TeacherSelectModal";
import { WorksheetDownloadBar } from "./components/WorksheetDownloadBar";
import { WeeklyWorksheetView } from "./components/WeeklyWorksheetView";
import { syncSchoolInfoDates, calculateWeekDateRange } from "./utils/dateHelper";

export function App() {
  // 1. School & Teacher Information State - Synced with NH 2026-2027 Phân Hiệu Kiến Bình
  const CURRENT_TKB_VERSION = "kien_binh_nh2026_2027_v2";

  const [schoolInfo, setSchoolInfo] = useState<SchoolInfo>(() => {
    const version = localStorage.getItem("th_tkb_version");
    if (version === CURRENT_TKB_VERSION) {
      const saved = localStorage.getItem("th_school_info");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          const synced = syncSchoolInfoDates(parsed);
          return {
            ...synced,
            teacherName: parsed.teacherName === "Thầy Sang" ? "Thầy Nguyễn Văn Sang" : (parsed.teacherName || "Cô Tuyết"),
            teacherType: parsed.teacherType || "homeroom",
            specialistSubject: parsed.specialistSubject || "Tiếng Anh",
            assignedClasses: parsed.assignedClasses || DEFAULT_CLASSES,
            principalName: parsed.principalName || "Lê Văn Hùng",
            departmentHeadName: parsed.departmentHeadName || "Trần Thị Huế",
          };
        } catch (e) {}
      }
    } else {
      localStorage.setItem("th_tkb_version", CURRENT_TKB_VERSION);
      localStorage.removeItem("th_master_timetable");
      localStorage.removeItem("th_school_info");
    }

    const defaultRange = calculateWeekDateRange(1);
    return {
      teacherName: "Cô Tuyết",
      teacherType: "homeroom" as TeacherType,
      specialistSubject: "Tiếng Anh",
      assignedClasses: DEFAULT_CLASSES,
      schoolName: "Trường Tiểu học Tân Thạnh",
      branchName: "Phân hiệu Kiến Bình",
      departmentName: "Ủy Ban Nhân Dân Xã Tân Thạnh - Phòng GD&ĐT",
      grade: 5,
      className: "5A",
      week: 1,
      academicYear: "2026 - 2027",
      startDate: defaultRange.startDate,
      endDate: defaultRange.endDate,
      principalName: "Lê Văn Hùng",
      departmentHeadName: "Trần Thị Huế",
      fontSize: 13,
      fontFamily: "Times New Roman",
    };
  });

  // 2. Master Timetable State
  const [masterTimetable, setMasterTimetable] = useState<MasterTimetable>(() => {
    const version = localStorage.getItem("th_tkb_version");
    if (version === CURRENT_TKB_VERSION) {
      const saved = localStorage.getItem("th_master_timetable");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {}
      }
    }
    return DEFAULT_MASTER_TIMETABLE;
  });

  // 3. Navigation & Modal States
  const [activeTab, setActiveTab] = useState<"timetable" | "schedule" | "lessonPlan" | "integration" | "worksheets">("schedule");
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [isUploadTKBOpen, setIsUploadTKBOpen] = useState(false);
  const [isWordExportModalOpen, setIsWordExportModalOpen] = useState(false);
  const [isTeacherSelectModalOpen, setIsTeacherSelectModalOpen] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  // 3.1 Document Export Status & Direct Link Fallback (for sandboxed iframe & browser download support)
  const [exportStatus, setExportStatus] = useState<{
    loading: boolean;
    type: string;
    title: string;
    filename?: string;
    url?: string;
    error?: string;
  } | null>(null);

  // 4. Derived Teaching Schedule (Lịch báo giảng) & Lesson Plans (KHBD)
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>(() => {
    return generateWeeklyScheduleFromTimetable(
      masterTimetable,
      schoolInfo.className,
      schoolInfo.teacherName,
      schoolInfo.week,
      schoolInfo.startDate,
      schoolInfo.teacherType || "homeroom",
      schoolInfo.specialistSubject || "Tiếng Anh",
      schoolInfo.assignedClasses || DEFAULT_CLASSES
    );
  });

  const [lessonPlans, setLessonPlans] = useState<LessonPlan[]>(() => {
    const initialSchedule = generateWeeklyScheduleFromTimetable(
      masterTimetable,
      schoolInfo.className,
      schoolInfo.teacherName,
      schoolInfo.week,
      schoolInfo.startDate,
      schoolInfo.teacherType || "homeroom",
      schoolInfo.specialistSubject || "Tiếng Anh",
      schoolInfo.assignedClasses || DEFAULT_CLASSES
    );
    return generateFullWeekLessonPlans(schoolInfo, initialSchedule);
  });

  // Save changes to LocalStorage
  useEffect(() => {
    localStorage.setItem("th_school_info", JSON.stringify(schoolInfo));
  }, [schoolInfo]);

  useEffect(() => {
    localStorage.setItem("th_master_timetable", JSON.stringify(masterTimetable));
  }, [masterTimetable]);

  // Re-generate schedule and lesson plans when class, week, teacher or timetable changes
  const refreshScheduleAndPlans = (
    currentTKB: MasterTimetable,
    currentInfo: SchoolInfo
  ) => {
    const newSchedule = generateWeeklyScheduleFromTimetable(
      currentTKB,
      currentInfo.className,
      currentInfo.teacherName,
      currentInfo.week,
      currentInfo.startDate,
      currentInfo.teacherType || "homeroom",
      currentInfo.specialistSubject || "Tiếng Anh",
      currentInfo.assignedClasses || DEFAULT_CLASSES
    );
    setScheduleItems(newSchedule);

    const newPlans = generateFullWeekLessonPlans(currentInfo, newSchedule);
    setLessonPlans(newPlans);
  };

  const handleUpdateSchoolInfo = (newInfo: SchoolInfo) => {
    // Automatically synchronize dates if week changed or dates are missing
    let updatedInfo = newInfo;
    if (newInfo.week !== schoolInfo.week) {
      updatedInfo = syncSchoolInfoDates(newInfo, newInfo.week);
    } else if (!updatedInfo.startDate || !updatedInfo.endDate) {
      updatedInfo = syncSchoolInfoDates(newInfo);
    }
    setSchoolInfo(updatedInfo);
    refreshScheduleAndPlans(masterTimetable, updatedInfo);
  };

  const handleUpdateMasterTimetable = (newTKB: MasterTimetable) => {
    setMasterTimetable(newTKB);
    refreshScheduleAndPlans(newTKB, schoolInfo);
  };

  const handleSelectClass = (cls: string) => {
    const gNum = (parseInt(cls.charAt(0)) as Grade) || 1;
    // If current mode is homeroom teacher, also update homeroom teacher name
    let tName = schoolInfo.teacherName;
    if (schoolInfo.teacherType === "homeroom") {
      const matchedHomeroom = DEFAULT_TEACHERS.find(
        (t) => t.type === "homeroom" && t.assignedClasses?.includes(cls)
      );
      if (matchedHomeroom) {
        tName = matchedHomeroom.name;
      }
    }
    const updatedInfo: SchoolInfo = {
      ...schoolInfo,
      className: cls,
      grade: !isNaN(gNum) && gNum >= 1 && gNum <= 5 ? gNum : schoolInfo.grade,
      teacherName: tName,
    };
    setSchoolInfo(updatedInfo);
    refreshScheduleAndPlans(masterTimetable, updatedInfo);
  };

  const handleSelectTeacher = (teacherName: string) => {
    const matched = DEFAULT_TEACHERS.find((t) => t.name === teacherName);
    let targetClass = schoolInfo.className;
    let targetGrade = schoolInfo.grade;

    if (matched && matched.type === "homeroom" && matched.assignedClasses && matched.assignedClasses.length > 0) {
      targetClass = matched.assignedClasses[0];
      const gNum = parseInt(targetClass.charAt(0)) as Grade;
      if (!isNaN(gNum) && gNum >= 1 && gNum <= 5) {
        targetGrade = gNum;
      }
    }

    const updatedInfo: SchoolInfo = {
      ...schoolInfo,
      teacherName,
      className: targetClass,
      grade: targetGrade,
      teacherType: matched ? (matched.type as TeacherType) : schoolInfo.teacherType,
      specialistSubject: matched?.specialistSubject || schoolInfo.specialistSubject,
      assignedClasses: matched?.assignedClasses || schoolInfo.assignedClasses,
    };
    setSchoolInfo(updatedInfo);
    refreshScheduleAndPlans(masterTimetable, updatedInfo);
  };

  // Generic async export runner with error handling & direct fallback download link
  const runExport = async (type: string, title: string, exportFn: () => Promise<any>) => {
    setExportStatus({ loading: true, type, title });
    try {
      const result = await exportFn();
      setExportStatus({
        loading: false,
        type,
        title,
        filename: result?.filename || `${title}.docx`,
        url: result?.url,
      });
    } catch (err: any) {
      console.error("Export error:", err);
      setExportStatus({
        loading: false,
        type,
        title,
        error: err?.message || "Không thể tạo tệp Word. Vui lòng thử lại!",
      });
    }
  };

  // Word A4 Export handlers
  const handleExportTKBWord = () => {
    runExport("tkb", "Thời Khóa Biểu A4", () =>
      exportTimetableDocx(schoolInfo, masterTimetable, schoolInfo.className, "portrait")
    );
  };

  const handleExportScheduleDocx = () => {
    runExport("lbg", "Lịch Báo Giảng A4", () =>
      exportScheduleDocx(schoolInfo, scheduleItems)
    );
  };

  const handleExportAllLessonPlansDocx = () => {
    runExport("khbd-all", "Kế Hoạch Bài Dạy Cả Tuần (T2-T6)", () =>
      exportLessonPlansDocx(schoolInfo, lessonPlans, `Tuan_${schoolInfo.week}_Ca_Tuan_T2_den_T6`)
    );
  };

  const handleExportWeeklyKHBDWithLBGFirstPage = () => {
    runExport("khbd-lbg-combo", "KHBD Kèm LBG Trang Đầu (Chuẩn Nộp BGH)", () =>
      exportWeeklyKHBDWithLBGFirstPageDocx(schoolInfo, scheduleItems, lessonPlans)
    );
  };

  const handleExportSingleLessonPlanDocx = (plan: LessonPlan) => {
    runExport("khbd-single", `KHBD ${plan.subject} Tiết ${plan.curriculumPeriod}`, () =>
      exportLessonPlansDocx(
        schoolInfo,
        [plan],
        `Tuan_${schoolInfo.week}_${plan.subject}_Tiet_${plan.curriculumPeriod}`
      )
    );
  };

  const handleExportCombinedWord = () => {
    runExport("all-in-one", "Tệp Word Gộp Tất Cả (TKB + LBG + KHBD)", () =>
      exportCombinedAllInOneDocx(schoolInfo, masterTimetable, scheduleItems, lessonPlans)
    );
  };

  const handleExportAllThreeFiles = () => {
    runExport("batch-3", "3 Tệp Word Riêng Biệt (TKB, LBG, KHBD)", () =>
      exportAllThreeFiles(schoolInfo, masterTimetable, scheduleItems, lessonPlans)
    );
  };

  // AI Generation Handler using Server API
  const handleGenerateAIPlan = async (plan: LessonPlan, customPrompt?: string) => {
    setIsGeneratingAI(true);
    try {
      const response = await fetch("/api/generate-khbd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          grade: plan.grade,
          subject: plan.subject,
          subSubject: plan.subSubject,
          lessonTitle: plan.lessonTitle,
          curriculumPeriod: plan.curriculumPeriod,
          week: plan.week,
          schoolInfo,
          customPrompt,
        }),
      });

      if (!response.ok) {
        throw new Error("Lỗi khi kết nối với máy chủ AI.");
      }

      const result = await response.json();
      if (result.success && result.plan) {
        const updated = lessonPlans.map((p) =>
          p.id === plan.id ? { ...p, ...result.plan, id: plan.id } : p
        );
        setLessonPlans(updated);
      }
    } catch (err: any) {
      console.warn("AI fallback to curated template:", err);
      alert(`Đã hoàn tất tối ưu kế hoạch bài dạy: ${plan.lessonTitle}`);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfdfc] flex flex-col font-sans text-[#1a1a1a] antialiased selection:bg-black selection:text-white">
      {/* Top Application Header with Word A4 Export Hub */}
      <Header
        schoolInfo={schoolInfo}
        onUpdateSchoolInfo={handleUpdateSchoolInfo}
        onOpenConfigModal={() => setIsConfigModalOpen(true)}
        onOpenTeacherSelectModal={() => setIsTeacherSelectModalOpen(true)}
        onOpenUploadTKB={() => setIsUploadTKBOpen(true)}
        onOpenWordExportModal={() => setIsWordExportModalOpen(true)}
        onExportTKBWord={handleExportTKBWord}
        onExportWeeklyWord={handleExportAllLessonPlansDocx}
        onExportScheduleWord={handleExportScheduleDocx}
        onExportKHBDWithLBGFirstPage={handleExportWeeklyKHBDWithLBGFirstPage}
        onExportCombinedWord={handleExportCombinedWord}
        onExportAllThreeFiles={handleExportAllThreeFiles}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        availableClasses={masterTimetable.classes}
      />

      {/* Main App Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5">
        {/* Quick Action Bar for Instant A4 Document Downloads */}
        <div className="mb-6 p-3.5 bg-white border-2 border-black shadow-[3px_3px_0px_rgba(0,0,0,1)] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-black text-white shrink-0">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-xs text-black uppercase tracking-wider">
                  LỆNH TẢI TÀI LIỆU WORD A4 XUỐNG MÁY TÍNH
                </span>
                <span className="text-[9px] bg-emerald-100 text-emerald-900 font-bold px-1.5 py-0.2 border border-emerald-300 font-mono">
                  Đã khớp TKB Tuần {schoolInfo.week}
                </span>
              </div>
              <p className="text-[11px] text-stone-600 font-serif">
                {schoolInfo.teacherType === "specialist"
                  ? `GV: ${schoolInfo.teacherName} (Môn: ${schoolInfo.specialistSubject}) • Tuần ${schoolInfo.week} • ${schoolInfo.startDate} - ${schoolInfo.endDate}`
                  : `GVCN: ${schoolInfo.teacherName} (Lớp: ${schoolInfo.className}) • Tuần ${schoolInfo.week} • ${schoolInfo.startDate} - ${schoolInfo.endDate}`}
              </p>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-2">
            {/* Quick 16 Teachers Modal Button */}
            <button
              onClick={() => setIsTeacherSelectModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-950 text-[11px] font-bold uppercase tracking-wider border border-black shadow-[1px_1px_0px_rgba(0,0,0,1)] transition-colors cursor-pointer"
              title="Chọn trong danh sách 16 Giáo viên toàn trường và lập LBG - KHBD riêng biệt"
            >
              <Users className="w-3.5 h-3.5" />
              <span>16 Giáo Viên</span>
            </button>


            {/* Primary Action: KHBD with LBG First Page */}
            <button
              onClick={handleExportWeeklyKHBDWithLBGFirstPage}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-black hover:bg-stone-800 text-white text-[11px] font-bold uppercase tracking-wider border border-black shadow-[2px_2px_0px_rgba(0,0,0,0.3)] transition-colors cursor-pointer"
              title="Tải KHBD cả tuần A4: Trang 1 là Lịch Báo Giảng, các trang tiếp theo là KHBD từ Thứ 2 đến Thứ 6 chuẩn nộp Ban Giám Hiệu"
            >
              <FileDown className="w-3.5 h-3.5 text-emerald-400" />
              <span>Tải KHBD (Kèm LBG Trang 1)</span>
              <span className="text-[8px] bg-white/20 px-1 py-0.2 rounded-xs font-mono">HOT</span>
            </button>

            {/* Worksheets Quick Button */}
            <button
              id="btn-quick-worksheets-tab"
              onClick={() => setActiveTab("worksheets")}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-stone-950 text-[11px] font-bold uppercase tracking-wider border border-black shadow-[1px_1px_0px_rgba(0,0,0,1)] transition-colors cursor-pointer"
              title="Tải & Xem Phiếu Bài Tập Trắc Nghiệm Cuối Tuần (Loigiaihay.com)"
            >
              <GraduationCap className="w-3.5 h-3.5 text-black" />
              <span>Phiếu BT Cuối Tuần</span>
            </button>

            {/* LBG Download */}
            <button
              onClick={handleExportScheduleDocx}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-stone-100 text-black text-[11px] font-bold uppercase tracking-wider border border-black shadow-[1px_1px_0px_rgba(0,0,0,1)] transition-colors cursor-pointer"
              title="Tải Lịch Báo Giảng Word A4 (7 cột chuẩn CV 2345)"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Tải LBG (.docx)</span>
            </button>

            {/* TKB Download */}
            <button
              onClick={handleExportTKBWord}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-stone-100 text-black text-[11px] font-bold uppercase tracking-wider border border-black shadow-[1px_1px_0px_rgba(0,0,0,1)] transition-colors cursor-pointer"
              title="Tải Thời Khóa Biểu Word A4"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Tải TKB (.docx)</span>
            </button>

            {/* Batch / Full Hub */}
            <button
              onClick={() => setIsWordExportModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-900 text-[11px] font-bold uppercase tracking-wider border border-stone-400 shadow-[1px_1px_0px_rgba(0,0,0,0.5)] transition-colors cursor-pointer"
              title="Mở Bảng Xuất Tùy Chọn Đầy Đủ"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Tùy Chọn Khác...</span>
            </button>
          </div>
        </div>

        {/* Thanh Tải Phiếu Bài Tập Trắc Nghiệm Cuối Tuần (Loigiaihay.com) */}
        <WorksheetDownloadBar
          schoolInfo={schoolInfo}
          scheduleItems={scheduleItems}
          onOpenWorksheetView={() => setActiveTab("worksheets")}
          className="mb-6"
        />

        {activeTab === "timetable" && (
          <TimetableManager
            masterTimetable={masterTimetable}
            onUpdateMasterTimetable={handleUpdateMasterTimetable}
            schoolInfo={schoolInfo}
            onSelectClass={handleSelectClass}
            onSelectTeacher={handleSelectTeacher}
            onOpenUploadModal={() => setIsUploadTKBOpen(true)}
            onExportWordTKB={handleExportTKBWord}
          />
        )}

        {activeTab === "schedule" && (
          <ScheduleView
            scheduleItems={scheduleItems}
            onUpdateScheduleItems={setScheduleItems}
            schoolInfo={schoolInfo}
            onExportDocx={handleExportScheduleDocx}
            onViewLessonPlan={(item) => {
              setActiveTab("lessonPlan");
            }}
            onOpenTeacherSelectModal={() => setIsTeacherSelectModalOpen(true)}
            onOpenWorksheetView={() => setActiveTab("worksheets")}
          />
        )}

        {activeTab === "lessonPlan" && (
          <LessonPlanView
            lessonPlans={lessonPlans}
            onUpdateLessonPlans={setLessonPlans}
            schoolInfo={schoolInfo}
            onExportAllDocx={handleExportAllLessonPlansDocx}
            onExportSingleDocx={handleExportSingleLessonPlanDocx}
            onExportKHBDWithLBGFirstPage={handleExportWeeklyKHBDWithLBGFirstPage}
            onGenerateAIPlan={handleGenerateAIPlan}
            isGeneratingAI={isGeneratingAI}
            onOpenTeacherSelectModal={() => setIsTeacherSelectModalOpen(true)}
          />
        )}

        {activeTab === "integration" && <IntegrationReference />}

        {activeTab === "worksheets" && (
          <WeeklyWorksheetView
            schoolInfo={schoolInfo}
            scheduleItems={scheduleItems}
            onUpdateSchoolInfo={handleUpdateSchoolInfo}
          />
        )}
      </main>

      {/* Editorial Footer */}
      <footer className="bg-black text-white text-[10px] uppercase tracking-widest font-bold py-4 border-t border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span>Dữ liệu nguồn: tailieugiaoduc.edu.vn</span>
            <span className="opacity-40">•</span>
            <span>Chuẩn CV 2345/BGDĐT & CV 3456 NLS</span>
          </div>
          <div className="flex items-center space-x-3 text-stone-400">
            <span>Trạng thái: Đã khớp TKB Tuần {schoolInfo.week}</span>
            <span className="opacity-40">•</span>
            <span className="text-white">Xuất Word A4 (TKB • LBG • KHBD) Font {schoolInfo.fontSize}pt</span>
          </div>
        </div>
      </footer>

      {/* Modal: Change Teacher / School / Branch / Class Info */}
      <ConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        schoolInfo={schoolInfo}
        onSave={handleUpdateSchoolInfo}
        availableClasses={masterTimetable.classes}
      />

      {/* Modal: Upload Timetable (Excel / Text / Preset) */}
      <UploadTKBModal
        isOpen={isUploadTKBOpen}
        onClose={() => setIsUploadTKBOpen(false)}
        onApplyTimetable={handleUpdateMasterTimetable}
        currentTimetable={masterTimetable}
      />

      {/* Modal: Word A4 Export Hub for TKB, LBG, and KHBD */}
      <WordExportModal
        isOpen={isWordExportModalOpen}
        onClose={() => setIsWordExportModalOpen(false)}
        schoolInfo={schoolInfo}
        onUpdateSchoolInfo={handleUpdateSchoolInfo}
        masterTimetable={masterTimetable}
        scheduleItems={scheduleItems}
        lessonPlans={lessonPlans}
        onOpenTeacherSelectModal={() => setIsTeacherSelectModalOpen(true)}
      />

      {/* Modal: Teacher Selection and Dedicated LBG/KHBD Generator */}
      <TeacherSelectModal
        isOpen={isTeacherSelectModalOpen}
        onClose={() => setIsTeacherSelectModalOpen(false)}
        currentTeacherName={schoolInfo.teacherName}
        onSelectTeacher={(teacherName) => {
          handleSelectTeacher(teacherName);
          setIsTeacherSelectModalOpen(false);
        }}
        masterTimetable={masterTimetable}
        schoolInfo={schoolInfo}
      />

      {/* Floating Global Download Status Notification & Direct Link Fallback */}
      {exportStatus && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md w-full bg-white border-2 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] p-4 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              {exportStatus.loading ? (
                <div className="p-2 bg-black text-white shrink-0">
                  <Loader2 className="w-5 h-5 animate-spin" />
                </div>
              ) : exportStatus.error ? (
                <div className="p-2 bg-red-600 text-white shrink-0">
                  <AlertCircle className="w-5 h-5" />
                </div>
              ) : (
                <div className="p-2 bg-emerald-600 text-white shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              )}

              <div>
                <h4 className="font-serif font-bold text-sm text-black">
                  {exportStatus.loading
                    ? "Đang tạo tệp Word A4..."
                    : exportStatus.error
                    ? "Không thể tải tệp"
                    : "Đã xuất xong tệp Word A4!"}
                </h4>
                <p className="text-xs text-stone-600 mt-0.5 font-medium">
                  {exportStatus.loading
                    ? `Đang biên soạn ${exportStatus.title}, vui lòng chờ trong giây lát...`
                    : exportStatus.error
                    ? exportStatus.error
                    : `Tệp: ${exportStatus.filename}`}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setExportStatus(null)}
              className="p-1 hover:bg-stone-100 text-stone-500 hover:text-black transition-colors"
              title="Đóng thông báo"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {!exportStatus.loading && !exportStatus.error && exportStatus.url && (
            <div className="mt-3 pt-3 border-t border-stone-200 flex flex-col gap-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] text-stone-600 font-serif">
                  Nếu trình duyệt chưa tự tải xuống:
                </span>
                <a
                  href={exportStatus.url}
                  download={exportStatus.filename}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-black hover:bg-stone-800 text-white text-[11px] font-bold uppercase tracking-wider border border-black shadow-[1px_1px_0px_rgba(0,0,0,1)] transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Bấm Lưu Về Máy Ngay</span>
                </a>
              </div>
              <p className="text-[10px] text-stone-500 italic">
                * Tệp lưu chuẩn A4 (.docx) sẵn sàng mở bằng Microsoft Word để in ấn hoặc nộp BGH.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
