import React, { useState } from "react";
import { ScheduleItem, SchoolInfo, DayOfWeek } from "../types";
import { DAYS_OF_WEEK } from "../data/defaultTimetables";
import { 
  FileDown, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  Printer, 
  BookOpen, 
  Filter,
  CalendarDays,
  User,
  Sparkles,
  ChevronRight,
  Presentation,
  ExternalLink,
  GraduationCap
} from "lucide-react";
import { buildSearchQueries } from "../utils/lectureResourceHelper";
import { isAuthenticLectureAvailable } from "../utils/classroomSlideDataHelper";

interface ScheduleViewProps {
  scheduleItems: ScheduleItem[];
  onUpdateScheduleItems: (items: ScheduleItem[]) => void;
  schoolInfo: SchoolInfo;
  onExportDocx: () => void;
  onViewLessonPlan: (item: ScheduleItem) => void;
  onOpenTeacherSelectModal?: () => void;
  onOpenWorksheetView?: () => void;
}

export const ScheduleView: React.FC<ScheduleViewProps> = ({
  scheduleItems,
  onUpdateScheduleItems,
  schoolInfo,
  onExportDocx,
  onViewLessonPlan,
  onOpenTeacherSelectModal,
  onOpenWorksheetView,
}) => {
  const [selectedDay, setSelectedDay] = useState<string>("all");
  const [viewScope, setViewScope] = useState<"personal" | "all">("personal");
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<ScheduleItem>>({});
  const [editingDayDate, setEditingDayDate] = useState<string | null>(null);
  const [dayDateValue, setDayDateValue] = useState<string>("");

  const isHomeroom = schoolInfo.teacherType === "homeroom";
  const personalItems = isHomeroom
    ? scheduleItems.filter((it) => !it.note || !it.note.includes("GV Chuyên"))
    : scheduleItems;

  const baseItems = isHomeroom && viewScope === "personal" ? personalItems : scheduleItems;

  const filteredItems = selectedDay === "all" 
    ? baseItems 
    : baseItems.filter(item => item.day === selectedDay);

  // Group items by day for 1 thứ - 1 ngày cho 7 tiết
  const groupedDays: { day: string; dateStr: string; items: ScheduleItem[] }[] = [];
  const dayOrder = ["Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy", "Chủ Nhật"];

  const activeDays = selectedDay === "all" ? dayOrder : [selectedDay];

  activeDays.forEach((d) => {
    const items = filteredItems.filter((it) => it.day === d);
    if (items.length > 0) {
      groupedDays.push({
        day: d,
        dateStr: items[0]?.dateStr || "",
        items,
      });
    }
  });

  // Handle saving date for all periods in a day (1 thứ, 1 ngày cho cả ngày/7 tiết)
  const handleSaveDayDate = (day: string) => {
    if (!dayDateValue.trim()) {
      setEditingDayDate(null);
      return;
    }
    const updated = scheduleItems.map((it) => 
      it.day === day ? { ...it, dateStr: dayDateValue.trim() } : it
    );
    onUpdateScheduleItems(updated);
    setEditingDayDate(null);
  };

  const handleStartEdit = (item: ScheduleItem) => {
    setEditingItemId(item.id);
    setEditForm({ ...item });
  };

  const handleSaveEdit = () => {
    if (!editingItemId) return;
    const updated = scheduleItems.map(it => it.id === editingItemId ? { ...it, ...editForm } as ScheduleItem : it);
    onUpdateScheduleItems(updated);
    setEditingItemId(null);
  };

  const handleDeleteItem = (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa tiết học này khỏi Lịch báo giảng?")) {
      onUpdateScheduleItems(scheduleItems.filter(it => it.id !== id));
    }
  };

  const handleAddNewItem = (day: DayOfWeek) => {
    // Find existing date for this day if any
    const existingDate = scheduleItems.find(it => it.day === day)?.dateStr || schoolInfo.startDate.split("/").slice(0, 2).join("/");
    const existingCount = scheduleItems.filter(it => it.day === day).length;

    const newItem: ScheduleItem = {
      id: `custom-${Date.now()}`,
      day: day,
      dateStr: existingDate,
      session: existingCount >= 4 ? "Chiều" : "Sáng",
      period: (existingCount % 4) + 1,
      subject: "Tiếng Việt",
      curriculumPeriod: 1,
      lessonTitle: "Bài dạy mới",
      integrationNotes: "",
      className: schoolInfo.className,
      teacherName: schoolInfo.teacherName,
    };
    onUpdateScheduleItems([...scheduleItems, newItem]);
    handleStartEdit(newItem);
  };

  return (
    <div className="space-y-6">
      {/* Teacher Status & Quick Switch Banner */}
      <div className="bg-stone-50 border-2 border-black p-3.5 sm:p-4 shadow-[3px_3px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 border border-black bg-black text-white flex items-center justify-center shrink-0">
            <User className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-sm text-black">
                {schoolInfo.teacherName}
              </span>
              <span className="text-[10px] font-mono font-bold bg-white px-2 py-0.5 border border-black text-stone-900">
                {schoolInfo.teacherType === "specialist"
                  ? `GV Chuyên ${schoolInfo.specialistSubject} (${schoolInfo.assignedClasses?.length || 10} Lớp)`
                  : `GVCN Lớp ${schoolInfo.className} (Khối ${schoolInfo.grade})`}
              </span>
              <span className="text-[10px] font-mono bg-stone-200 px-1.5 py-0.5 text-stone-800 border border-stone-300">
                {baseItems.length} tiết giảng dạy
              </span>
            </div>
            <p className="text-[11px] text-stone-600 font-serif mt-0.5">
              {isHomeroom
                ? "Lịch báo giảng tự động cập nhật môn dạy & đồng bộ theo phân phối chương trình tuần " + schoolInfo.week
                : `Lịch báo giảng chuyên trách môn ${schoolInfo.specialistSubject} phủ khắp các lớp tuần ` + schoolInfo.week}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap w-full md:w-auto justify-end">
          {/* Homeroom View Scope Toggle */}
          {isHomeroom && (
            <div className="flex border border-black overflow-hidden bg-white shadow-[1px_1px_0px_rgba(0,0,0,1)] text-[10px]">
              <button
                type="button"
                onClick={() => setViewScope("personal")}
                className={`px-2.5 py-1.5 font-bold uppercase tracking-wider border-r border-black transition-colors cursor-pointer ${
                  viewScope === "personal"
                    ? "bg-black text-white"
                    : "bg-white text-stone-800 hover:bg-stone-200"
                }`}
                title="Chỉ hiển thị các tiết do GVCN trực tiếp giảng dạy"
              >
                Tiết GV Dạy ({personalItems.length})
              </button>
              <button
                type="button"
                onClick={() => setViewScope("all")}
                className={`px-2.5 py-1.5 font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                  viewScope === "all"
                    ? "bg-black text-white"
                    : "bg-white text-stone-800 hover:bg-stone-200"
                }`}
                title="Hiển thị toàn bộ các tiết của lớp (bao gồm tiết GV Chuyên)"
              >
                Cả Lớp ({scheduleItems.length})
              </button>
            </div>
          )}

          {onOpenTeacherSelectModal && (
            <button
              type="button"
              onClick={onOpenTeacherSelectModal}
              className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-950 text-[10px] font-bold uppercase tracking-wider border border-black transition-colors shadow-[1px_1px_0px_rgba(0,0,0,1)] flex items-center gap-1.5 cursor-pointer"
            >
              <User className="w-3 h-3" />
              <span>Đổi Giáo Viên / Lập Riêng</span>
            </button>
          )}
        </div>
      </div>

      {/* Top Bar with Filter & Export */}
      <div className="bg-white p-4 border border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Day Filter Tabs */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 md:pb-0">
          <span className="text-[10px] uppercase font-bold tracking-wider text-stone-600 mr-1 whitespace-nowrap flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-black" />
            Lọc ngày:
          </span>
          <button
            onClick={() => setSelectedDay("all")}
            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider border border-black transition-colors ${
              selectedDay === "all"
                ? "bg-black text-white"
                : "bg-stone-100 text-stone-800 hover:bg-stone-200"
            }`}
          >
            Cả Tuần (T2 - T6)
          </button>
          {DAYS_OF_WEEK.map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-2.5 py-1.5 text-xs font-bold uppercase tracking-wider border border-black transition-colors ${
                selectedDay === day
                  ? "bg-black text-white"
                  : "bg-white text-stone-800 hover:bg-stone-200"
              }`}
            >
              {day}
            </button>
          ))}
        </div>

        {/* Action Export Button */}
        <div className="flex items-center space-x-2 flex-wrap gap-y-2">
          {onOpenWorksheetView && (
            <button
              type="button"
              onClick={onOpenWorksheetView}
              className="flex items-center gap-1.5 px-3 py-2 bg-amber-100 hover:bg-amber-200 text-amber-950 text-[10px] font-bold uppercase tracking-wider border border-black shadow-[1px_1px_0px_rgba(0,0,0,1)] transition-colors cursor-pointer"
              title="Tải & Xem Phiếu Bài Tập Trắc Nghiệm Cuối Tuần theo Lịch Báo Giảng (Loigiaihay.com)"
            >
              <GraduationCap className="w-3.5 h-3.5 text-amber-800" />
              <span>Phiếu BT Cuối Tuần</span>
            </button>
          )}

          <button
            onClick={onExportDocx}
            className="flex items-center gap-1.5 px-4 py-2 bg-black hover:bg-stone-800 text-white text-[10px] font-bold uppercase tracking-widest border border-black shadow-[2px_2px_0px_rgba(0,0,0,0.3)] transition-colors active:translate-y-0.5 cursor-pointer"
            title="Tải file Word A4 Lịch báo giảng 7 cột chuẩn"
          >
            <FileDown className="w-4 h-4" />
            <span>Tải LBG Word A4</span>
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-stone-100 text-black border border-black text-[10px] font-bold uppercase tracking-wider transition-colors shadow-[1px_1px_0px_rgba(0,0,0,1)]"
            title="In lịch báo giảng"
          >
            <Printer className="w-4 h-4" />
            <span>In Bảng</span>
          </button>
        </div>
      </div>

      {/* Main Schedule Table Paper */}
      <div className="bg-white border border-black p-6 sm:p-8 space-y-6 shadow-[4px_4px_0px_rgba(0,0,0,0.1)] relative">
        <div className="absolute top-0 right-0 p-4 opacity-5 font-serif text-7xl font-bold pointer-events-none select-none">
          LBG
        </div>

        {/* Official Header */}
        <div className="border-b border-black pb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="text-center md:text-left space-y-1">
              <p className="font-semibold text-stone-600 uppercase tracking-wider text-[11px]">
                {schoolInfo.departmentName || "ỦY BAN NHÂN DÂN / PHÒNG GD&ĐT"}
              </p>
              <p className="font-serif font-bold text-black text-base uppercase tracking-tight">
                {schoolInfo.schoolName}
              </p>
              {schoolInfo.branchName && (
                <p className="text-stone-700">Phân hiệu: <span className="font-serif font-bold italic">{schoolInfo.branchName}</span></p>
              )}
              <p className="text-stone-900 font-medium">
                {schoolInfo.teacherType === "specialist"
                  ? <>Môn chuyên: <strong className="font-mono bg-stone-100 px-1.5 py-0.5 border border-stone-300">{schoolInfo.specialistSubject}</strong> | Giáo viên: <span className="font-serif italic font-semibold">{schoolInfo.teacherName}</span></>
                  : <>Lớp: <strong className="font-mono bg-stone-100 px-1.5 py-0.5 border border-stone-300">{schoolInfo.className}</strong> | Giáo viên: <span className="font-serif italic font-semibold">{schoolInfo.teacherName}</span></>}
              </p>
            </div>

            <div className="text-center md:text-right space-y-1">
              <p className="font-bold text-black uppercase tracking-wider text-[11px]">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
              <p className="font-serif italic font-semibold text-stone-800">Độc lập - Tự do - Hạnh phúc</p>
              <p className="text-stone-400 font-mono text-[10px]">---------------------------</p>
              <p className="text-stone-600 text-[11px] uppercase tracking-wider">Năm học: <b>{schoolInfo.academicYear}</b></p>
            </div>
          </div>

          <div className="text-center mt-6 pt-4 border-t border-dashed border-stone-300">
            <h2 className="text-2xl font-serif font-bold text-black tracking-tight uppercase">
              LỊCH BÁO GIẢNG TUẦN {schoolInfo.week}
            </h2>
            <p className="text-xs text-stone-600 mt-1 font-serif italic">
              Từ ngày <strong>{schoolInfo.startDate}</strong> đến ngày <strong>{schoolInfo.endDate}</strong> — Năm học: <strong>{schoolInfo.academicYear}</strong>
            </p>
            <div className="inline-flex items-center gap-3 mt-2 px-3 py-1 border border-black bg-stone-100 text-stone-900 text-[10px] font-bold uppercase tracking-wider">
              <span>TUẦN THỨ: {schoolInfo.week}</span>
              <span className="opacity-40">|</span>
              {schoolInfo.teacherType === "specialist" ? (
                <span>MÔN CHUYÊN: {schoolInfo.specialistSubject?.toUpperCase()}</span>
              ) : (
                <>
                  <span>KHỐI: {schoolInfo.grade}</span>
                  <span className="opacity-40">|</span>
                  <span>LỚP: {schoolInfo.className}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Schedule Table (1 Thứ, 1 Ngày cho tất cả 7 tiết / ngày; Chỉ tên bài dạy; Ghi chú để trống) */}
        <div className="overflow-x-auto border-2 border-black">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-stone-100 text-black font-serif uppercase tracking-wider text-[11px] font-bold border-b-2 border-black">
                <th className="py-3 px-3 border-r border-black text-center w-32">Thứ / Ngày</th>
                <th className="py-3 px-2 border-r border-black text-center w-16">Buổi</th>
                <th className="py-3 px-2 border-r border-black text-center w-12">Tiết</th>
                <th className="py-3 px-3 border-r border-black text-left w-40">Môn / Phân môn</th>
                <th className="py-3 px-2 border-r border-black text-center w-20">Tiết PPCT</th>
                <th className="py-3 px-4 border-r border-black text-left">Tên bài dạy</th>
                <th className="py-3 px-3 border-r border-black text-center w-24">Ghi chú</th>
                <th className="py-3 px-2 text-center w-20">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black">
              {groupedDays.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-stone-500 font-serif italic">
                    Chưa có dữ liệu tiết dạy cho ngày này. Hãy bấm "Thêm tiết học" hoặc chọn TKB nhà trường.
                  </td>
                </tr>
              ) : (
                groupedDays.map((group) => {
                  // Calculate session spans for each session block in the day
                  const sessionSpans: number[] = [];
                  let i = 0;
                  while (i < group.items.length) {
                    let count = 1;
                    while (i + count < group.items.length && group.items[i + count].session === group.items[i].session) {
                      count++;
                    }
                    for (let c = 0; c < count; c++) {
                      sessionSpans.push(c === 0 ? count : 0);
                    }
                    i += count;
                  }

                  return group.items.map((item, itemIdx) => {
                    const isEditing = editingItemId === item.id;
                    const isFirstInDay = itemIdx === 0;
                    const sessionSpan = sessionSpans[itemIdx];

                    return (
                      <tr
                        key={item.id}
                        className={`hover:bg-stone-100/70 transition-colors ${
                          itemIdx % 2 === 0 ? "bg-white" : "bg-stone-50/60"
                        }`}
                      >
                        {/* Day & Date: Gộp 1 Thứ, 1 Ngày cho tất cả các tiết trong ngày */}
                        {isFirstInDay && (
                          <td
                            rowSpan={group.items.length}
                            className="py-3 px-2 border-r-2 border-black text-center align-middle bg-stone-50/80 font-bold text-black border-b border-black"
                          >
                            <div className="font-serif text-sm font-bold text-black">{group.day}</div>
                            
                            {editingDayDate === group.day ? (
                              <div className="mt-1.5 flex items-center justify-center gap-1">
                                <input
                                  type="text"
                                  value={dayDateValue}
                                  onChange={(e) => setDayDateValue(e.target.value)}
                                  placeholder="dd/mm"
                                  className="w-16 px-1 py-0.5 text-[10px] font-mono border border-black bg-white text-center focus:outline-none"
                                  autoFocus
                                />
                                <button
                                  type="button"
                                  onClick={() => handleSaveDayDate(group.day)}
                                  className="p-1 bg-black text-white hover:bg-stone-800 text-[9px] border border-black cursor-pointer"
                                  title="Lưu ngày cho cả ngày"
                                >
                                  <Check className="w-3 h-3" />
                                </button>
                              </div>
                            ) : (
                              <div
                                onClick={() => {
                                  setEditingDayDate(group.day);
                                  setDayDateValue(group.dateStr || "");
                                }}
                                className="mt-1 text-[11px] font-mono font-medium text-stone-600 hover:text-black hover:bg-stone-200 px-1 py-0.5 border border-dashed border-stone-300 cursor-pointer rounded-xs inline-flex items-center gap-1"
                                title="Bấm để sửa ngày cho tất cả các tiết trong ngày này"
                              >
                                <CalendarDays className="w-3 h-3 text-stone-500" />
                                <span>{group.dateStr || "Nhập ngày"}</span>
                              </div>
                            )}
                            <div className="text-[9px] text-stone-400 font-mono mt-1">({group.items.length} tiết)</div>
                          </td>
                        )}

                        {/* Session: Gộp hiển thị 1 lần cho Sáng / Chiều */}
                        {sessionSpan > 0 && (
                          <td
                            rowSpan={sessionSpan}
                            className="py-2 px-2 border-r border-black text-center align-middle bg-stone-50/50"
                          >
                            <span className={`px-1.5 py-0.5 border text-[10px] font-bold uppercase tracking-wider inline-block ${
                              item.session === "Sáng" ? "bg-stone-100 border-stone-400 text-stone-900" : "bg-stone-200 border-stone-500 text-stone-900"
                            }`}>
                              {item.session}
                            </span>
                          </td>
                        )}

                        {/* Period */}
                        <td className="py-2 px-2 border-r border-black text-center font-mono font-bold text-black">
                          {item.period}
                        </td>

                        {/* Subject */}
                        <td className="py-2 px-3 border-r border-black font-semibold text-black">
                          {isEditing ? (
                            <input
                              type="text"
                              value={editForm.subject || ""}
                              onChange={(e) => setEditForm({ ...editForm, subject: e.target.value })}
                              className="w-full px-2 py-1 border border-black bg-white text-xs font-semibold focus:outline-none"
                            />
                          ) : (
                            <div className="flex items-center flex-wrap gap-1">
                              <span className="font-serif">{item.subject}</span>
                              {(schoolInfo.teacherType === "specialist" || (item.className && item.className !== schoolInfo.className)) && (
                                <span className="text-[9px] bg-black text-white px-1.5 py-0.2 font-mono font-bold">
                                  {item.className}
                                </span>
                              )}
                            </div>
                          )}
                        </td>

                        {/* Curriculum Period (Tiết PPCT) */}
                        <td className="py-2 px-2 border-r border-black text-center font-mono font-bold text-black">
                          {isEditing ? (
                            <input
                              type="text"
                              value={editForm.curriculumPeriod || ""}
                              onChange={(e) => setEditForm({ ...editForm, curriculumPeriod: e.target.value })}
                              className="w-full px-1 py-1 border border-black bg-white text-xs text-center font-bold font-mono focus:outline-none"
                            />
                          ) : (
                            item.curriculumPeriod || "-"
                          )}
                        </td>

                        {/* Lesson Title (Chỉ tên bài dạy, không nêu nội dung tích hợp) */}
                        <td className="py-2.5 px-4 border-r border-black">
                          {isEditing ? (
                            <input
                              type="text"
                              value={editForm.lessonTitle || ""}
                              onChange={(e) => setEditForm({ ...editForm, lessonTitle: e.target.value })}
                              placeholder="Tên bài dạy..."
                              className="w-full px-2 py-1 border border-black text-xs font-semibold focus:outline-none"
                              autoFocus
                            />
                          ) : (
                            <div className="font-semibold text-black leading-snug">{item.lessonTitle || "Bài học"}</div>
                          )}
                        </td>

                        {/* Note (Phần ghi chú bỏ trống) */}
                        <td className="py-2 px-2 border-r border-black text-center text-stone-500">
                          {isEditing ? (
                            <input
                              type="text"
                              value={editForm.note || ""}
                              onChange={(e) => setEditForm({ ...editForm, note: e.target.value })}
                              placeholder="Ghi chú..."
                              className="w-full px-1 py-1 border border-stone-400 text-xs text-center focus:outline-none"
                            />
                          ) : (
                            item.note || ""
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-2 px-2 text-center space-x-1 whitespace-nowrap">
                          {isEditing ? (
                            <button
                              onClick={handleSaveEdit}
                              className="p-1 bg-black text-white hover:bg-stone-800 transition-colors border border-black"
                              title="Lưu dòng"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <>
                              <button
                                onClick={() => handleStartEdit(item)}
                                className="p-1 text-stone-700 hover:text-black hover:bg-stone-200 border border-stone-300 transition-colors"
                                title="Sửa thông tin tiết"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => onViewLessonPlan(item)}
                                className="p-1 text-stone-700 hover:text-black hover:bg-stone-200 border border-stone-300 transition-colors"
                                title="Xem Kế hoạch bài dạy chi tiết (CV 2345)"
                              >
                                <BookOpen className="w-3.5 h-3.5" />
                              </button>
                              {/* Chỉ hiển thị biểu tượng Bài giảng cho các bài có tệp slide mẫu chuẩn */}
                              {isAuthenticLectureAvailable(item.lessonTitle, item.subject) && (
                                <button
                                  type="button"
                                  onClick={() => onViewLessonPlan(item)}
                                  className="p-1 text-emerald-800 hover:text-white hover:bg-emerald-700 bg-emerald-50 border border-emerald-400 transition-colors inline-flex items-center"
                                  title={`Bài giảng PowerPoint (.pptx) chuẩn có sẵn cho: "${item.lessonTitle}"`}
                                >
                                  <Presentation className="w-3.5 h-3.5" />
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteItem(item.id)}
                                className="p-1 text-stone-400 hover:text-red-600 hover:bg-stone-100 border border-stone-200 transition-colors"
                                title="Xóa tiết"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    );
                  });
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Quick Add Button & Clean Note */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <button
            onClick={() => handleAddNewItem(selectedDay !== "all" ? (selectedDay as DayOfWeek) : "Thứ Hai")}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-black border border-black hover:bg-stone-100 text-[10px] font-bold uppercase tracking-wider shadow-[1px_1px_0px_rgba(0,0,0,1)] transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Tiết Học Vào {selectedDay !== "all" ? selectedDay : "Thứ Hai"}</span>
          </button>
          
          <div className="text-[10px] uppercase font-bold tracking-wider text-stone-500 font-mono">
            * Cấu trúc: 1 Thứ, 1 Ngày gộp cho các tiết trong ngày • Tên bài dạy tinh gọn • Ghi chú để trống.
          </div>
        </div>
      </div>
    </div>
  );
};
