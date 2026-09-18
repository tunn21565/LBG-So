import React, { useState } from "react";
import { LessonPlan, SchoolInfo, DayOfWeek } from "../types";
import { DAYS_OF_WEEK } from "../data/defaultTimetables";
import { 
  FileDown, 
  Sparkles, 
  Edit3, 
  Check, 
  Printer, 
  BookOpen, 
  Layers, 
  ChevronRight,
  RefreshCw,
  Plus,
  Trash2,
  Cpu,
  Search,
  Sliders,
  User,
  Presentation,
  ExternalLink,
  Globe,
  Download,
  Eye,
  Loader2,
  CheckCircle2,
  CheckCircle
} from "lucide-react";
import { buildSearchQueries } from "../utils/lectureResourceHelper";
import { downloadLessonPresentationPptx } from "../utils/pptxExportHelper";
import { PresentationViewerModal } from "./PresentationViewerModal";
import {
  isAuthenticLectureAvailable,
  getAuthenticDeckSummary
} from "../utils/classroomSlideDataHelper";

interface LessonPlanViewProps {
  lessonPlans: LessonPlan[];
  onUpdateLessonPlans: (plans: LessonPlan[]) => void;
  schoolInfo: SchoolInfo;
  onExportAllDocx: () => void;
  onExportSingleDocx: (plan: LessonPlan) => void;
  onExportKHBDWithLBGFirstPage?: () => void;
  onGenerateAIPlan: (plan: LessonPlan, customPrompt?: string) => Promise<void>;
  isGeneratingAI: boolean;
  onOpenTeacherSelectModal?: () => void;
}

export const LessonPlanView: React.FC<LessonPlanViewProps> = ({
  lessonPlans,
  onUpdateLessonPlans,
  schoolInfo,
  onExportAllDocx,
  onExportSingleDocx,
  onExportKHBDWithLBGFirstPage,
  onGenerateAIPlan,
  isGeneratingAI,
  onOpenTeacherSelectModal,
}) => {
  const [selectedPlanId, setSelectedPlanId] = useState<string>(lessonPlans[0]?.id || "");
  const [selectedDayFilter, setSelectedDayFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editFormData, setEditFormData] = useState<LessonPlan | null>(null);
  const [aiCustomPrompt, setAiCustomPrompt] = useState<string>("");
  const [showAiPanel, setShowAiPanel] = useState<boolean>(false);
  const [isDownloadingPptx, setIsDownloadingPptx] = useState<boolean>(false);
  const [downloadSuccessMsg, setDownloadSuccessMsg] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);

  const filteredPlans = lessonPlans.filter((p) => {
    const matchesDay = selectedDayFilter === "all" || p.dayOfWeek === selectedDayFilter;
    const matchesQuery = !searchQuery || 
      p.lessonTitle.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.subject.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDay && matchesQuery;
  });

  const activePlan = lessonPlans.find((p) => p.id === selectedPlanId) || filteredPlans[0] || lessonPlans[0];

  const handleStartEdit = () => {
    if (activePlan) {
      setEditFormData(JSON.parse(JSON.stringify(activePlan)));
      setIsEditing(true);
    }
  };

  const handleSaveEdit = () => {
    if (!editFormData) return;
    const updated = lessonPlans.map((p) => (p.id === editFormData.id ? editFormData : p));
    onUpdateLessonPlans(updated);
    setIsEditing(false);
  };

  const handleActivityChange = (index: number, field: "name" | "objective" | "teacherActivity" | "studentActivity", value: string) => {
    if (!editFormData) return;
    const newActs = [...editFormData.activities];
    newActs[index] = { ...newActs[index], [field]: value };
    setEditFormData({ ...editFormData, activities: newActs });
  };

  return (
    <div className="space-y-6">
      {/* Teacher Status & Isolation Banner */}
      <div className="bg-stone-50 border-2 border-black p-3.5 sm:p-4 shadow-[3px_3px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 border border-black bg-black text-white flex items-center justify-center shrink-0">
            <User className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-sm text-black">
                KHBD Giáo Viên: {schoolInfo.teacherName}
              </span>
              <span className="text-[10px] font-mono font-bold bg-white px-2 py-0.5 border border-black text-stone-900">
                {schoolInfo.teacherType === "specialist"
                  ? `GV Chuyên ${schoolInfo.specialistSubject}`
                  : `GVCN Lớp ${schoolInfo.className} (Khối ${schoolInfo.grade})`}
              </span>
              <span className="text-[10px] font-mono bg-stone-200 px-1.5 py-0.5 text-stone-800 border border-stone-300">
                {lessonPlans.length} kế hoạch bài dạy chuẩn CV 2345
              </span>
            </div>
            <p className="text-[11px] text-stone-600 font-serif mt-0.5">
              {schoolInfo.teacherType === "homeroom"
                ? "Tự động phân tách nội dung: Chỉ gồm các môn GVCN trực tiếp giảng dạy (đã lọc các tiết chuyên Tiếng Anh, Tin học, Âm nhạc, Mĩ thuật, Thể chất)."
                : `Giáo án chuyên sâu môn ${schoolInfo.specialistSubject} được lập cho các lớp phụ trách giảng dạy trong tuần ${schoolInfo.week}.`}
            </p>
          </div>
        </div>

        {onOpenTeacherSelectModal && (
          <button
            type="button"
            onClick={onOpenTeacherSelectModal}
            className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-950 text-[10px] font-bold uppercase tracking-wider border border-black transition-colors shadow-[1px_1px_0px_rgba(0,0,0,1)] flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <User className="w-3 h-3" />
            <span>Đổi Giáo Viên / Soạn Cho GV Khác</span>
          </button>
        )}
      </div>

      {/* Top Controls Bar */}
      <div className="bg-white p-4 border border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        {/* Filters */}
        <div className="flex items-center space-x-2 flex-wrap gap-y-2">
          {/* Day Filter */}
          <div className="flex items-center border border-black overflow-hidden bg-white shadow-[1px_1px_0px_rgba(0,0,0,1)]">
            <button
              onClick={() => setSelectedDayFilter("all")}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider border-r border-black transition-colors ${
                selectedDayFilter === "all"
                  ? "bg-black text-white"
                  : "bg-white text-stone-800 hover:bg-stone-200"
              }`}
            >
              Cả Tuần ({lessonPlans.length})
            </button>
            {DAYS_OF_WEEK.map((d) => (
              <button
                key={d}
                onClick={() => setSelectedDayFilter(d)}
                className={`px-2.5 py-1.5 text-xs font-bold uppercase tracking-wider border-r last:border-r-0 border-black transition-colors ${
                  selectedDayFilter === d
                    ? "bg-black text-white"
                    : "bg-white text-stone-800 hover:bg-stone-200"
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          {/* Search box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-stone-500 absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm môn hoặc bài..."
              className="pl-8 pr-3 py-1.5 text-xs bg-stone-50 border border-black focus:outline-none w-36 sm:w-48 font-serif"
            />
          </div>
        </div>

        {/* Global Action Export Buttons */}
        <div className="flex items-center space-x-2 flex-wrap gap-y-2">

          {/* AI Generation Trigger */}
          <button
            onClick={() => setShowAiPanel(!showAiPanel)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-black border border-black text-[10px] font-bold uppercase tracking-wider shadow-[1px_1px_0px_rgba(0,0,0,1)] transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Soạn & Tích Hợp</span>
          </button>

          {/* Download Single Docx */}
          {activePlan && (
            <button
              onClick={() => onExportSingleDocx(activePlan)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-stone-100 text-black text-[10px] font-bold uppercase tracking-wider border border-black shadow-[1px_1px_0px_rgba(0,0,0,1)] transition-colors cursor-pointer"
              title="Tải bài học này ra Word A4 (.docx)"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Tải Word (Tiết Này)</span>
            </button>
          )}

          {/* Download Full Week Docx */}
          <button
            onClick={onExportAllDocx}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-black text-[10px] font-bold uppercase tracking-wider border border-black shadow-[1px_1px_0px_rgba(0,0,0,1)] transition-colors cursor-pointer"
            title="Tải trọn bộ KHBD Word A4 tuần từ Thứ 2 đến Thứ 6"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>Tải KHBD Tách Rời (T2-T6)</span>
          </button>

          {/* Download KHBD Full Week (First Page is LBG, next is KHBD Mon-Fri) */}
          {onExportKHBDWithLBGFirstPage && (
            <button
              onClick={onExportKHBDWithLBGFirstPage}
              className="flex items-center gap-2 px-4 py-1.5 bg-black hover:bg-stone-800 text-white text-[10px] font-bold uppercase tracking-wider border border-black shadow-[2px_2px_0px_rgba(0,0,0,0.3)] transition-colors cursor-pointer"
              title="Tải KHBD cả tuần A4: Trang 1 là Lịch Báo Giảng, các trang tiếp theo là KHBD từ Thứ 2 đến Thứ 6 chuẩn CV 2345/BGDĐT"
            >
              <FileDown className="w-4 h-4 text-emerald-400" />
              <span className="font-extrabold">Tải KHBD (Kèm LBG Trang 1)</span>
              <span className="bg-white/20 text-[9px] px-1.5 py-0.2 rounded-xs font-mono font-normal">T2-T6</span>
            </button>
          )}
        </div>
      </div>

      {/* AI Assistant Drawer / Generator Box */}
      {showAiPanel && activePlan && (
        <div className="bg-stone-900 text-white p-6 border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] space-y-4">
          <div className="flex items-center justify-between border-b border-stone-800 pb-3">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-white text-black border border-white">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-sm text-white uppercase tracking-wider">
                  Trợ Lý AI Soạn Bài & Tích Hợp (Mô Hình Giáo Dục Tiểu Học)
                </h4>
                <p className="text-xs text-stone-400 font-serif">
                  Tự động soạn chi tiết theo Công văn 2345/BGDĐT, lồng ghép AI, Năng lực số, Quyền con người, QPAN, STEM
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowAiPanel(false)}
              className="text-[10px] uppercase font-bold tracking-wider text-stone-400 hover:text-white px-2 py-1 border border-stone-700 bg-stone-800"
            >
              Đóng
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <label className="block text-[10px] uppercase font-bold tracking-wider text-stone-300 mb-1">
                Yêu cầu bổ sung cho bài dạy: <strong className="text-stone-100">{activePlan.lessonTitle}</strong> ({activePlan.subject} - Khối {activePlan.grade})
              </label>
              <input
                type="text"
                value={aiCustomPrompt}
                onChange={(e) => setAiCustomPrompt(e.target.value)}
                placeholder="Ví dụ: Tăng cường hoạt động nhóm, lồng ghép sâu Năng lực số và trò chơi khởi động Quizizz..."
                className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-700 text-white placeholder:text-stone-500 focus:outline-none focus:border-stone-400 font-serif"
              />
            </div>
            <div className="flex items-end">
              <button
                type="button"
                disabled={isGeneratingAI}
                onClick={() => onGenerateAIPlan(activePlan, aiCustomPrompt)}
                className="w-full py-2.5 bg-white text-black hover:bg-stone-200 border border-white disabled:opacity-50 text-[10px] font-bold uppercase tracking-wider shadow-[2px_2px_0px_rgba(255,255,255,0.3)] transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                {isGeneratingAI ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Đang AI Soạn Bài...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Tạo KHBD Chi Tiết Bằng AI</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main 2-Column Layout: Sidebar Plan List + Active Plan Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Sidebar: Lesson Plan Selector */}
        <div className="lg:col-span-4 space-y-3">
          <div className="bg-white border border-black p-4 shadow-[2px_2px_0px_rgba(0,0,0,1)]">
            <h3 className="font-serif font-bold text-xs uppercase tracking-wider text-black mb-3 flex items-center justify-between border-b border-black pb-2">
              <span>Danh Sách Bài Dạy ({filteredPlans.length})</span>
              <span className="text-[10px] font-mono text-stone-600 font-normal">Tuần {schoolInfo.week}</span>
            </h3>

            <div className="space-y-2 max-h-[700px] overflow-y-auto pr-1">
              {filteredPlans.map((plan) => {
                const isSelected = plan.id === (activePlan?.id || "");
                return (
                  <button
                    key={plan.id}
                    onClick={() => {
                      setSelectedPlanId(plan.id);
                      setIsEditing(false);
                    }}
                    className={`w-full text-left p-3 border transition-colors ${
                      isSelected
                        ? "bg-stone-100 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                        : "bg-white border-stone-300 hover:bg-stone-50 hover:border-black"
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1 font-serif">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-black uppercase text-[11px]">{plan.dayOfWeek}</span>
                        <span className="text-[10px] bg-stone-100 text-stone-700 px-1 border border-stone-300 font-sans font-medium">
                          {plan.session === "afternoon" ? "Chiều" : "Sáng"} • T{plan.periodNumber}
                        </span>
                        {plan.className && (
                          <span className="text-[9px] bg-black text-white px-1 font-mono font-bold">
                            {plan.className}
                          </span>
                        )}
                        {isAuthenticLectureAvailable(plan.lessonTitle, plan.subject) && (
                          <span className="text-[9px] bg-emerald-100 text-emerald-800 border border-emerald-300 px-1 font-mono font-bold">
                            Slide PPTX
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] bg-stone-200 px-1.5 py-0.2 font-mono font-bold text-black" title="Tiết phân phối chương trình">
                        PPCT: {plan.curriculumPeriod || 1}
                      </span>
                    </div>
                    <div className="font-serif font-bold text-xs text-black line-clamp-1">
                      {plan.subject}: {plan.lessonTitle}
                    </div>
                    {plan.objectives?.integrations && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {plan.objectives.integrations.ai && (
                          <span className="text-[9px] border border-stone-400 bg-stone-50 text-black px-1 font-mono uppercase">AI</span>
                        )}
                        {plan.objectives.integrations.digitalCompetence && (
                          <span className="text-[9px] border border-stone-400 bg-stone-50 text-black px-1 font-mono uppercase">NLS</span>
                        )}
                        {plan.objectives.integrations.humanRights && (
                          <span className="text-[9px] border border-stone-400 bg-stone-50 text-black px-1 font-mono uppercase">QCN</span>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Area: Detailed Lesson Plan (CV 2345 Standard View) */}
        <div className="lg:col-span-8">
          {activePlan ? (
            <div className="bg-white border border-black p-6 sm:p-8 space-y-6 shadow-[4px_4px_0px_rgba(0,0,0,0.1)] font-serif">
              {/* Top Document Header & Editor Toggle */}
              <div className="flex items-center justify-between border-b border-black pb-4">
                <div>
                  <span className="bg-black text-white text-[10px] font-mono font-bold px-2 py-0.5 uppercase tracking-wider">
                    Chuẩn Mẫu Công Văn 2345/BGDĐT
                  </span>
                  <p className="text-xs text-stone-600 mt-1 font-serif">
                    {activePlan.dayOfWeek} ({activePlan.session === "afternoon" ? "Buổi Chiều" : "Buổi Sáng"} - Tiết {activePlan.periodNumber}) • Tiết PPCT: {activePlan.curriculumPeriod} • Khối {activePlan.grade} - Lớp {activePlan.className}
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  {isEditing ? (
                    <button
                      onClick={handleSaveEdit}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 bg-black text-white text-[10px] font-bold uppercase tracking-wider border border-black shadow-[2px_2px_0px_rgba(0,0,0,0.3)] transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Lưu Thay Đổi</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleStartEdit}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-black text-[10px] font-bold uppercase tracking-wider border border-black shadow-[1px_1px_0px_rgba(0,0,0,1)] transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Chỉnh Sửa Bài Này</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Official Header Table 2-Columns */}
              <div className="grid grid-cols-2 gap-4 text-xs pb-3 border-b border-black">
                <div className="text-center space-y-0.5">
                  <p className="uppercase text-stone-700">{schoolInfo.departmentName || "PHÒNG GD&ĐT"}</p>
                  <p className="font-bold text-black uppercase">{schoolInfo.schoolName}</p>
                  <p className="text-stone-700">TỔ CHUYÊN MÔN KHỐI {activePlan.grade}</p>
                </div>
                <div className="text-center space-y-0.5">
                  <p className="font-bold text-black uppercase">LỚP: {activePlan.className}</p>
                  <p className="text-stone-700">Năm học: {schoolInfo.academicYear}</p>
                  <p className="text-stone-600">Thời gian: {schoolInfo.startDate} - {schoolInfo.endDate}</p>
                </div>
              </div>

              {/* Title & Subject Banner */}
              <div className="text-center space-y-1">
                <h2 className="text-xl font-serif font-black text-black uppercase tracking-tight">
                  KẾ HOẠCH BÀI DẠY TUẦN {activePlan.week}
                </h2>
                <p className="text-xs text-stone-700">
                  Giáo viên giảng dạy: <strong className="text-black">{activePlan.teacherName}</strong> | Lớp: <strong className="text-black">{activePlan.className}</strong>
                </p>
              </div>

              {/* Lesson Specific Info */}
              <div className="bg-stone-50 p-4 border border-black space-y-1 text-xs">
                <p className="font-bold text-black uppercase">
                  ★ {activePlan.dayOfWeek.toUpperCase()}, NGÀY {activePlan.dateStr || schoolInfo.startDate}
                </p>
                <p className="font-bold text-blue-900 text-sm uppercase">
                  MÔN: {activePlan.subject.toUpperCase()} {activePlan.subSubject ? `(${activePlan.subSubject.toUpperCase()})` : ""} - TIẾT PPCT: {activePlan.curriculumPeriod}
                </p>
                <p className="font-bold text-black text-base">
                  BÀI HỌC: {activePlan.lessonTitle}
                </p>

                {/* Direct download buttons strictly for lessons with authentic presentation files */}
                {(() => {
                  const deckSummary = getAuthenticDeckSummary(activePlan.lessonTitle, activePlan.subject);
                  const q = buildSearchQueries(activePlan.lessonTitle, activePlan.subject, activePlan.grade, "kntt", "powerpoint");
                  
                  const handleDownloadThisPptx = async () => {
                    try {
                      setIsDownloadingPptx(true);
                      const res = await downloadLessonPresentationPptx(activePlan, schoolInfo);
                      setDownloadSuccessMsg(`Đã tải xuống máy: ${res.filename}`);
                      setTimeout(() => setDownloadSuccessMsg(null), 4000);
                    } catch (err) {
                      console.error(err);
                      alert("Đã xảy ra lỗi khi tạo tệp PowerPoint. Vui lòng thử lại!");
                    } finally {
                      setIsDownloadingPptx(false);
                    }
                  };

                  return (
                    <div className="pt-2.5 mt-2 border-t border-stone-300 space-y-2">
                      {deckSummary.available && (
                        /* Chỉ hiển thị cho các bài có tệp slide mẫu chuẩn gửi lên */
                        <div className="bg-emerald-50/90 border border-emerald-500 p-2.5 space-y-2 rounded-xs">
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[10px] bg-emerald-800 text-white font-mono font-bold px-2 py-0.5 uppercase tracking-wider">
                                {deckSummary.badge}
                              </span>
                              <span className="text-xs font-serif font-bold text-emerald-950">
                                {deckSummary.description}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-emerald-200">
                            {/* 1. DIRECT DOWNLOAD BUTTON */}
                            <button
                              type="button"
                              onClick={handleDownloadThisPptx}
                              disabled={isDownloadingPptx}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-black text-xs font-black uppercase tracking-wider border border-black shadow-[1px_1px_0px_rgba(0,0,0,1)] transition-transform active:translate-y-0.5 cursor-pointer disabled:opacity-50"
                              title="Tải tệp PowerPoint (.pptx) chuẩn trực tiếp về máy tính để giảng dạy"
                            >
                              {isDownloadingPptx ? (
                                <>
                                  <Loader2 className="w-3.5 h-3.5 animate-spin text-black" />
                                  <span>Đang Tạo File...</span>
                                </>
                              ) : (
                                <>
                                  <Download className="w-3.5 h-3.5 text-black" />
                                  <span>Tải PowerPoint (.PPTX)</span>
                                </>
                              )}
                            </button>

                            {/* 2. Slide Show / Preview */}
                            <button
                              type="button"
                              onClick={() => setIsPreviewOpen(true)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-stone-100 text-stone-900 text-xs font-bold uppercase tracking-wider border border-black shadow-[1px_1px_0px_rgba(0,0,0,1)] transition-colors cursor-pointer"
                              title="Xem trước các slide bài giảng hoặc trình chiếu toàn màn hình"
                            >
                              <Eye className="w-3.5 h-3.5 text-stone-800" />
                              <span>Xem Thử / Chiếu Slide</span>
                            </button>
                          </div>
                        </div>
                      )}

                      {downloadSuccessMsg && (
                        <div className="p-2 bg-emerald-100 border border-emerald-500 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                          <span>{downloadSuccessMsg}</span>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>

              {/* SECTION I: YÊU CẦU CẦN ĐẠT */}
              <div className="space-y-3 text-xs">
                <h3 className="font-serif font-bold text-sm text-black border-b border-black pb-1 uppercase tracking-wide">
                  I. YÊU CẦU CẦN ĐẠT
                </h3>

                <div className="space-y-2 pl-2">
                  {/* 1. Năng lực đặc thù */}
                  <div>
                    <h4 className="font-bold text-black">1. Năng lực đặc thù:</h4>
                    <p className="text-stone-800 mt-0.5 leading-relaxed">
                      {activePlan.objectives.specificCompetencies.join(" ")}
                    </p>
                  </div>

                  {/* 2. Năng lực chung */}
                  <div>
                    <h4 className="font-bold text-black">2. Năng lực chung:</h4>
                    <p className="text-stone-800 mt-0.5 leading-relaxed">
                      {activePlan.objectives.generalCompetencies.join(" ")}
                    </p>
                  </div>

                  {/* 3. Phẩm chất */}
                  <div>
                    <h4 className="font-bold text-black">3. Phẩm chất:</h4>
                    <p className="text-stone-800 mt-0.5 leading-relaxed">
                      {activePlan.objectives.qualities.join(" ")}
                    </p>
                  </div>

                  {/* 4. Tích hợp lồng ghép */}
                  {activePlan.objectives.integrations && (
                    <div className="bg-stone-50 p-3.5 border border-black space-y-1.5 mt-2">
                      <h4 className="font-bold text-black flex items-center gap-1.5 uppercase text-[11px] tracking-wide">
                        <Sparkles className="w-3.5 h-3.5 text-black" />
                        4. Nội dung tích hợp lồng ghép trong bài dạy:
                      </h4>
                      <ul className="space-y-1 text-xs text-stone-800 pl-4 list-disc">
                        {activePlan.objectives.integrations.ai && (
                          <li><strong>Trí tuệ nhân tạo (AI):</strong> {activePlan.objectives.integrations.ai}</li>
                        )}
                        {activePlan.objectives.integrations.digitalCompetence && (
                          <li><strong>Năng lực số (CV 3456/BGDĐT):</strong> {activePlan.objectives.integrations.digitalCompetence}</li>
                        )}
                        {activePlan.objectives.integrations.humanRights && (
                          <li><strong>Giáo dục Quyền con người:</strong> {activePlan.objectives.integrations.humanRights}</li>
                        )}
                        {activePlan.objectives.integrations.defense && (
                          <li><strong>GD Quốc phòng & An ninh (TT 08/2024):</strong> {activePlan.objectives.integrations.defense}</li>
                        )}
                        {activePlan.objectives.integrations.nutrition && (
                          <li><strong>Giáo dục Dinh dưỡng:</strong> {activePlan.objectives.integrations.nutrition}</li>
                        )}
                        {activePlan.objectives.integrations.stem && (
                          <li><strong>Giáo dục STEM / Chơi để học:</strong> {activePlan.objectives.integrations.stem}</li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* SECTION II: ĐỒ DÙNG DẠY HỌC */}
              <div className="space-y-2 text-xs">
                <h3 className="font-serif font-bold text-sm text-black border-b border-black pb-1 uppercase tracking-wide">
                  II. ĐỒ DÙNG DẠY HỌC VÀ HỌC LIỆU
                </h3>
                <div className="space-y-1 pl-2">
                  <p className="text-stone-800">
                    <strong className="text-black">- Giáo viên:</strong> {activePlan.materials.teacher.join("; ")}
                  </p>
                  <p className="text-stone-800">
                    <strong className="text-black">- Học sinh:</strong> {activePlan.materials.student.join("; ")}
                  </p>
                </div>
              </div>

              {/* SECTION III: 2-COLUMN TEACHING ACTIVITIES TABLE */}
              <div className="space-y-3 text-xs">
                <h3 className="font-serif font-bold text-sm text-black border-b border-black pb-1 uppercase tracking-wide">
                  III. CÁC HOẠT ĐỘNG DẠY HỌC CHỦ YẾU (Bảng 2 cột Hoạt động GV - Hoạt động HS)
                </h3>

                <div className="overflow-x-auto border border-black">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-stone-100 text-black font-serif font-bold uppercase text-[10px] tracking-wider border-b border-black">
                        <th className="py-3 px-4 border-r border-black w-1/2 text-center">
                          HOẠT ĐỘNG CỦA GIÁO VIÊN
                        </th>
                        <th className="py-3 px-4 w-1/2 text-center">
                          HOẠT ĐỘNG CỦA HỌC SINH
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black">
                      {activePlan.activities.map((act, actIdx) => (
                        <tr key={act.id || actIdx} className={actIdx % 2 === 0 ? "bg-white" : "bg-stone-50/60"}>
                          {/* Teacher Column */}
                          <td className="py-3 px-4 border-r border-black align-top space-y-2">
                            <div className="font-bold text-black text-xs uppercase">
                              {act.name}
                            </div>
                            <div className="text-xs text-stone-700 bg-stone-100 p-2 border border-stone-300">
                              <strong>* Mục tiêu:</strong> {act.objective}
                            </div>
                            <div className="text-stone-900 leading-relaxed whitespace-pre-line text-xs">
                              <strong>* Cách tiến hành:</strong>
                              <br />
                              {act.teacherActivity}
                            </div>
                          </td>

                          {/* Student Column */}
                          <td className="py-3 px-4 align-top text-stone-900 leading-relaxed whitespace-pre-line text-xs">
                            <div className="font-bold text-stone-500 text-[11px] mb-2 uppercase">
                              (Phản hồi & Thực hiện của HS)
                            </div>
                            {act.studentActivity}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* SECTION IV: ĐIỀU CHỈNH SAU BÀI DẠY */}
              <div className="space-y-2 text-xs">
                <h3 className="font-serif font-bold text-sm text-black border-b border-black pb-1 uppercase tracking-wide">
                  IV. ĐIỀU CHỈNH SAU BÀI DẠY
                </h3>
                <p className="text-stone-500 italic pl-2">
                  {activePlan.postLessonAdjustment || "...................................................................................................................................................................................................."}
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-black p-12 text-center text-stone-400 font-serif shadow-[2px_2px_0px_rgba(0,0,0,1)]">
              Chưa có bài dạy nào được chọn.
            </div>
          )}
        </div>
      </div>

      {/* Slide Preview & Projection Modal */}
      {isPreviewOpen && activePlan && (
        <PresentationViewerModal
          isOpen={true}
          onClose={() => setIsPreviewOpen(false)}
          plan={activePlan}
          schoolInfo={schoolInfo}
        />
      )}
    </div>
  );
};
