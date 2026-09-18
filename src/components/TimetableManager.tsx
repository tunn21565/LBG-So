import React, { useState } from "react";
import { DayOfWeek, MasterTimetable, SchoolInfo, SessionType } from "../types";
import { DAYS_OF_WEEK, DEFAULT_TEACHERS, isSlotMatchingTeacherOrSubject } from "../data/defaultTimetables";
import { 
  Calendar, 
  UploadCloud, 
  Download, 
  Printer, 
  Users, 
  GraduationCap, 
  Grid, 
  Sparkles,
  Edit3,
  CheckCircle2,
  FileSpreadsheet,
  FileDown
} from "lucide-react";
import * as XLSX from "xlsx";
import { exportTimetableDocx, exportTeacherTimetableDocx } from "../utils/docxExporter";
import { getDayDateMapForWeek } from "../utils/dateHelper";

interface TimetableManagerProps {
  masterTimetable: MasterTimetable;
  onUpdateMasterTimetable: (newTKB: MasterTimetable) => void;
  schoolInfo: SchoolInfo;
  onSelectClass: (className: string) => void;
  onSelectTeacher: (teacherName: string) => void;
  onOpenUploadModal: () => void;
  onExportWordTKB?: () => void;
}

export const TimetableManager: React.FC<TimetableManagerProps> = ({
  masterTimetable,
  onUpdateMasterTimetable,
  schoolInfo,
  onSelectClass,
  onSelectTeacher,
  onOpenUploadModal,
}) => {
  const [viewMode, setViewMode] = useState<"class" | "master" | "teacher">("class");
  const [selectedTeacher, setSelectedTeacher] = useState<string>(schoolInfo.teacherName || "Nguyễn Hoàng Tuấn");
  const [editingCell, setEditingCell] = useState<{ slotKey: string; className: string } | null>(null);
  const [editValue, setEditValue] = useState("");

  const selectedClass = schoolInfo.className;
  const dayDateMap = getDayDateMapForWeek(schoolInfo.week || 1);

  // Export current class or teacher timetable to Excel
  const handleExportExcel = () => {
    const data: any[] = [];
    if (viewMode === "teacher") {
      const matchedT = DEFAULT_TEACHERS.find((t) => t.name === selectedTeacher);
      data.push([`THỜI KHÓA BIỂU CÁ NHÂN GIÁO VIÊN: ${selectedTeacher.toUpperCase()}`]);
      data.push([`Nhiệm vụ: ${matchedT?.role || "Giáo viên"} - Trường: ${schoolInfo.schoolName}`]);
      data.push([`Năm học: ${schoolInfo.academicYear} - Áp dụng từ tuần ${schoolInfo.week}`]);
      data.push([]);
      data.push(["Buổi", "Tiết", ...DAYS_OF_WEEK]);

      // Morning
      for (let p = 1; p <= 5; p++) {
        const row = ["Sáng", `Tiết ${p}`];
        DAYS_OF_WEEK.forEach((d) => {
          const key = `${d}_Sáng_${p}`;
          const taught: string[] = [];
          masterTimetable.classes.forEach((cls) => {
            const val = masterTimetable.slots[key]?.[cls] || "";
            if (
              val &&
              (isSlotMatchingTeacherOrSubject(val, selectedTeacher, matchedT?.specialistSubject) ||
                (matchedT?.assignedClasses?.includes(cls) && matchedT?.type === "homeroom" && !val.includes("(")) ||
                val.toLowerCase().includes(selectedTeacher.toLowerCase().split(" ").pop() || ""))
            ) {
              taught.push(`Lớp ${cls}: ${val}`);
            }
          });
          row.push(taught.join(" | ") || "—");
        });
        data.push(row);
      }

      // Afternoon
      for (let p = 1; p <= 3; p++) {
        const row = ["Chiều", `Tiết ${p}`];
        DAYS_OF_WEEK.forEach((d) => {
          if (d === "Thứ Năm") {
            row.push("SHCM");
            return;
          }
          const key = `${d}_Chiều_${p}`;
          const taught: string[] = [];
          masterTimetable.classes.forEach((cls) => {
            const val = masterTimetable.slots[key]?.[cls] || "";
            if (
              val && val !== "SHCM" &&
              (isSlotMatchingTeacherOrSubject(val, selectedTeacher, matchedT?.specialistSubject) ||
                (matchedT?.assignedClasses?.includes(cls) && matchedT?.type === "homeroom" && !val.includes("(")) ||
                val.toLowerCase().includes(selectedTeacher.toLowerCase().split(" ").pop() || ""))
            ) {
              taught.push(`Lớp ${cls}: ${val}`);
            }
          });
          row.push(taught.join(" | ") || "—");
        });
        data.push(row);
      }

      const ws = XLSX.utils.aoa_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, `TKB_GV_${selectedTeacher.replace(/\s+/g, "_")}`);
      XLSX.writeFile(wb, `TKB_GiaoVien_${selectedTeacher.replace(/\s+/g, "_")}_${schoolInfo.schoolName}.xlsx`);
      return;
    }

    data.push([`THỜI KHÓA BIỂU CHI TIẾT - LỚP ${selectedClass}`]);
    data.push([`${schoolInfo.schoolName} - Năm học: ${schoolInfo.academicYear}`]);
    data.push([`Giáo viên: ${schoolInfo.teacherName}`]);
    data.push([]);
    data.push(["Buổi", "Tiết", ...DAYS_OF_WEEK]);

    // Morning
    for (let p = 1; p <= 5; p++) {
      const row = ["Sáng", `Tiết ${p}`];
      DAYS_OF_WEEK.forEach((d) => {
        const key = `${d}_Sáng_${p}`;
        row.push(masterTimetable.slots[key]?.[selectedClass] || "");
      });
      data.push(row);
    }

    // Afternoon
    for (let p = 1; p <= 3; p++) {
      const row = ["Chiều", `Tiết ${p}`];
      DAYS_OF_WEEK.forEach((d) => {
        const key = `${d}_Chiều_${p}`;
        row.push(masterTimetable.slots[key]?.[selectedClass] || "");
      });
      data.push(row);
    }

    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `TKB_Lop_${selectedClass}`);
    XLSX.writeFile(wb, `TKB_Lop_${selectedClass}_${schoolInfo.schoolName}.xlsx`);
  };

  const handleCellClick = (slotKey: string, cls: string, currentValue: string) => {
    setEditingCell({ slotKey, className: cls });
    setEditValue(currentValue || "");
  };

  const handleSaveCell = () => {
    if (!editingCell) return;
    const { slotKey, className } = editingCell;
    const newSlots = { ...masterTimetable.slots };
    if (!newSlots[slotKey]) newSlots[slotKey] = {};
    newSlots[slotKey][className] = editValue.trim();

    onUpdateMasterTimetable({
      ...masterTimetable,
      slots: newSlots,
    });
    setEditingCell(null);
  };

  // Color helper for subjects with Editorial Aesthetic
  const getSubjectColor = (sub: string) => {
    if (!sub || sub.trim() === "") return "bg-stone-50/50 text-stone-400 border-dashed border-stone-300";
    if (sub.includes("TV") || sub.includes("Tiếng Việt") || sub.includes("Đọc") || sub.includes("Viết")) return "bg-stone-100 text-black border-black font-bold";
    if (sub.includes("Toán") || sub === "T") return "bg-[#faf7ee] text-stone-900 border-stone-800 font-bold";
    if (sub.includes("HĐTN") || sub.includes("HDTN")) return "bg-[#f4f7f4] text-stone-900 border-stone-700 font-semibold";
    if (sub.includes("Khoa học") || sub.includes("TNXH") || sub.includes("KH")) return "bg-[#f2f7f7] text-stone-900 border-stone-700";
    if (sub.includes("LS&ĐL") || sub.includes("Địa Sử")) return "bg-[#faf5f0] text-stone-900 border-stone-700";
    if (sub.includes("Đạo đức") || sub.includes("ĐĐ")) return "bg-[#f8f4fa] text-stone-900 border-stone-700";
    if (sub.includes("GDTC") || sub.includes("Thể chất")) return "bg-[#faf4f4] text-stone-900 border-stone-700";
    if (sub.includes("TA") || sub.includes("Anh văn") || sub.includes("Tiếng Anh")) return "bg-[#f0f6fa] text-stone-900 border-stone-700";
    if (sub.includes("MT") || sub.includes("Mĩ thuật") || sub.includes("BDMT")) return "bg-[#faf2f6] text-stone-900 border-stone-700";
    if (sub.includes("AN") || sub.includes("Âm nhạc") || sub.includes("BDAN")) return "bg-[#f4f2fa] text-stone-900 border-stone-700";
    if (sub.includes("CN") || sub.includes("Công nghệ") || sub.includes("TH") || sub.includes("TCTH")) return "bg-[#f4f4fa] text-stone-900 border-stone-700";
    if (sub.includes("SHCM")) return "bg-stone-200 text-stone-700 font-bold border-stone-400";
    return "bg-stone-50 text-stone-900 border-stone-400";
  };

  // Calculate stats for selected class
  let classPeriodCount = 0;
  DAYS_OF_WEEK.forEach((d) => {
    for (let p = 1; p <= 5; p++) {
      const v = masterTimetable.slots[`${d}_Sáng_${p}`]?.[selectedClass];
      if (v && v.trim() !== "") classPeriodCount++;
    }
    for (let p = 1; p <= 3; p++) {
      const v = masterTimetable.slots[`${d}_Chiều_${p}`]?.[selectedClass];
      if (v && v.trim() !== "" && v !== "SHCM") classPeriodCount++;
    }
  });

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="bg-white p-4 border border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* View Mode Switcher */}
        <div className="flex items-center border border-black overflow-hidden bg-white shadow-[1px_1px_0px_rgba(0,0,0,1)] text-xs">
          <button
            onClick={() => setViewMode("class")}
            className={`flex items-center gap-1.5 px-3 py-1.5 font-bold uppercase tracking-wider transition-colors border-r border-black ${
              viewMode === "class"
                ? "bg-black text-white"
                : "bg-white text-stone-800 hover:bg-stone-200"
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>TKB Lớp {selectedClass}</span>
          </button>

          <button
            onClick={() => setViewMode("master")}
            className={`flex items-center gap-1.5 px-3 py-1.5 font-bold uppercase tracking-wider transition-colors border-r border-black ${
              viewMode === "master"
                ? "bg-black text-white"
                : "bg-white text-stone-800 hover:bg-stone-200"
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>TKB Toàn Trường</span>
          </button>

          <button
            onClick={() => setViewMode("teacher")}
            className={`flex items-center gap-1.5 px-3 py-1.5 font-bold uppercase tracking-wider transition-colors ${
              viewMode === "teacher"
                ? "bg-black text-white"
                : "bg-white text-stone-800 hover:bg-stone-200"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>TKB Giáo Viên</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 flex-wrap gap-y-2">
          <button
            onClick={onOpenUploadModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 border border-dashed border-black bg-white hover:bg-stone-200 text-black text-[10px] font-bold uppercase tracking-wider shadow-[1px_1px_0px_rgba(0,0,0,1)] transition-colors cursor-pointer"
            title="Đưa tệp Excel thời khóa biểu mới hoặc dán TKB nhà trường"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Đưa TKB Lên</span>
          </button>

          {/* Word A4 Export Button */}
          <button
            onClick={() => {
              if (viewMode === "teacher") {
                exportTeacherTimetableDocx(schoolInfo, masterTimetable, selectedTeacher, "portrait");
              } else if (viewMode === "master") {
                exportTimetableDocx(schoolInfo, masterTimetable, "all", "landscape");
              } else {
                exportTimetableDocx(schoolInfo, masterTimetable, selectedClass, "portrait");
              }
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-black hover:bg-stone-800 text-white text-[10px] font-bold uppercase tracking-widest border border-black shadow-[2px_2px_0px_rgba(0,0,0,0.3)] transition-colors cursor-pointer"
            title={
              viewMode === "teacher"
                ? `Tải Thời khóa biểu cá nhân của thầy/cô ${selectedTeacher} (Word A4)`
                : viewMode === "master"
                ? "Tải Thời khóa biểu toàn trường (Word A4 Ngang)"
                : `Tải Thời khóa biểu Lớp ${selectedClass} (Word A4)`
            }
          >
            <FileDown className="w-3.5 h-3.5 text-emerald-400" />
            <span>
              {viewMode === "teacher"
                ? "Tải TKB Giáo Viên A4"
                : viewMode === "master"
                ? "Tải TKB Toàn Trường A4"
                : `Tải TKB Lớp ${selectedClass} A4`}
            </span>
          </button>

          <button
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white hover:bg-stone-100 text-black text-[10px] font-bold uppercase tracking-wider border border-black shadow-[1px_1px_0px_rgba(0,0,0,1)] transition-colors cursor-pointer"
            title="Tải bảng TKB ra định dạng Excel (.xlsx)"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Xuất Excel</span>
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white text-black hover:bg-stone-100 border border-black text-[10px] font-bold uppercase tracking-wider shadow-[1px_1px_0px_rgba(0,0,0,1)] transition-colors cursor-pointer"
            title="In bảng thời khóa biểu"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>In TKB</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: TKB RIÊNG THEO LỚP ĐƯỢC CHỌN (CLASS TIMETABLE) */}
      {viewMode === "class" && (
        <div className="bg-white border border-black p-6 sm:p-8 space-y-6 shadow-[4px_4px_0px_rgba(0,0,0,0.1)] relative">
          {/* Class Timetable Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between border-b border-black pb-4 gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="bg-black text-white text-[10px] font-mono font-bold uppercase px-2 py-0.5 tracking-wider">
                  KHỐI {schoolInfo.grade}
                </span>
                <h2 className="text-xl font-serif font-bold text-black uppercase tracking-tight">
                  THỜI KHÓA BIỂU CHI TIẾT LỚP {selectedClass}
                </h2>
              </div>
              <p className="text-xs text-stone-600 mt-1 font-serif">
                {schoolInfo.schoolName} {schoolInfo.branchName ? `— Phân hiệu ${schoolInfo.branchName}` : ""} | GVCN: <span className="font-semibold italic text-black">{schoolInfo.teacherName}</span> | Áp dụng: <strong>Tuần {schoolInfo.week} ({schoolInfo.startDate} - {schoolInfo.endDate})</strong> | Phân bổ: <strong className="font-mono">{classPeriodCount} tiết/tuần</strong>
              </p>
            </div>

            {/* Quick Class Switcher */}
            <div className="flex items-center space-x-1 overflow-x-auto">
              <span className="text-[10px] uppercase font-bold tracking-wider text-stone-600 mr-1">Đổi lớp:</span>
              <div className="flex border border-black overflow-hidden bg-white shadow-[1px_1px_0px_rgba(0,0,0,1)]">
                {masterTimetable.classes.map((cls) => (
                  <button
                    key={cls}
                    onClick={() => onSelectClass(cls)}
                    className={`px-2.5 py-1 text-xs font-bold border-r last:border-r-0 border-black transition-colors ${
                      selectedClass === cls
                        ? "bg-black text-white"
                        : "bg-white text-stone-800 hover:bg-stone-200"
                    }`}
                  >
                    {cls}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Timetable Table for Selected Class */}
          <div className="overflow-x-auto border border-black">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-100 text-black text-[10px] font-serif font-bold uppercase tracking-wider border-b border-black">
                  <th className="py-3 px-3 w-20 border-r border-black text-center">Buổi</th>
                  <th className="py-3 px-2 w-14 border-r border-black text-center">Tiết</th>
                  {DAYS_OF_WEEK.map((day) => {
                    const dateInfo = dayDateMap[day];
                    return (
                      <th key={day} className="py-2 px-3 border-r border-black text-center last:border-r-0">
                        <div>{day}</div>
                        {dateInfo && (
                          <div className="text-[10px] font-mono font-medium text-stone-600 mt-0.5">
                            ({dateInfo.shortDate})
                          </div>
                        )}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-black text-xs">
                {/* SÁNG (Tiết 1 -> 5) */}
                {([1, 2, 3, 4, 5] as const).map((period, idx) => (
                  <tr key={`sang-${period}`} className={period % 2 === 0 ? "bg-stone-50/60" : "bg-white"}>
                    {idx === 0 && (
                      <td
                        rowSpan={5}
                        className="py-3 px-3 font-serif font-bold text-center bg-stone-100 text-black border-r border-black align-middle uppercase text-xs"
                      >
                        SÁNG
                        <div className="text-[9px] font-mono font-normal text-stone-600 mt-1">7h15 - 11h15</div>
                      </td>
                    )}
                    <td className="py-2.5 px-2 text-center font-mono font-bold text-black border-r border-black">
                      {period}
                    </td>
                    {DAYS_OF_WEEK.map((day) => {
                      const slotKey = `${day}_Sáng_${period}`;
                      const val = masterTimetable.slots[slotKey]?.[selectedClass] || "";
                      const colorClass = getSubjectColor(val);

                      return (
                        <td
                          key={slotKey}
                          onClick={() => handleCellClick(slotKey, selectedClass, val)}
                          className="py-2 px-2 border-r border-black last:border-r-0 text-center cursor-pointer transition-colors hover:bg-stone-200/50"
                          title="Nhấp để chỉnh sửa tiết này"
                        >
                          <div className={`p-2 border text-center transition-transform hover:scale-[1.01] ${colorClass}`}>
                            {val ? (
                              <span className="font-serif font-semibold">{val}</span>
                            ) : (
                              <span className="text-stone-300 text-[11px] italic">—</span>
                            )}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}

                {/* CHIỀU (Tiết 1 -> 3) */}
                {([1, 2, 3] as const).map((period, idx) => (
                  <tr key={`chieu-${period}`} className={period % 2 === 0 ? "bg-stone-50/60" : "bg-white"}>
                    {idx === 0 && (
                      <td
                        rowSpan={3}
                        className="py-3 px-3 font-serif font-bold text-center bg-stone-100 text-black border-r border-black align-middle uppercase text-xs"
                      >
                        CHIỀU
                        <div className="text-[9px] font-mono font-normal text-stone-600 mt-1">13h30 - 16h00</div>
                      </td>
                    )}
                    <td className="py-2.5 px-2 text-center font-mono font-bold text-black border-r border-black">
                      {period}
                    </td>
                    {DAYS_OF_WEEK.map((day) => {
                      const slotKey = `${day}_Chiều_${period}`;
                      const val = masterTimetable.slots[slotKey]?.[selectedClass] || "";
                      const colorClass = getSubjectColor(val);

                      return (
                        <td
                          key={slotKey}
                          onClick={() => handleCellClick(slotKey, selectedClass, val)}
                          className="py-2 px-2 border-r border-black last:border-r-0 text-center cursor-pointer transition-colors hover:bg-stone-200/50"
                          title="Nhấp để chỉnh sửa tiết này"
                        >
                          <div className={`p-2 border text-center transition-transform hover:scale-[1.01] ${colorClass}`}>
                            {val ? (
                              <span className="font-serif font-semibold">{val}</span>
                            ) : (
                              <span className="text-stone-300 text-[11px] italic">—</span>
                            )}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-stone-50 p-3 border border-black text-xs text-stone-700 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span className="flex items-center gap-1.5 font-medium">
              <Edit3 className="w-3.5 h-3.5 text-black" />
              Mẹo: Nhấp trực tiếp vào bất kỳ ô nào trên bảng TKB để chỉnh sửa nhanh môn học / phân công giáo viên.
            </span>
            <span className="text-stone-500 text-[10px] uppercase font-bold tracking-wider">Tự động đồng bộ sang Lịch Báo Giảng</span>
          </div>
        </div>
      )}

      {/* VIEW 2: TKB TOÀN TRƯỜNG (MASTER MATRIX) */}
      {viewMode === "master" && (
        <div className="bg-white border border-black p-6 sm:p-8 space-y-4 shadow-[4px_4px_0px_rgba(0,0,0,0.1)]">
          <div className="border-b border-black pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-serif font-bold text-black uppercase tracking-tight flex items-center gap-2">
                <Grid className="w-4 h-4 text-black" />
                THỜI KHÓA BIỂU TOÀN TRƯỜNG (MA TRẬN CÁC KHỐI 1 - 5)
              </h2>
              <p className="text-xs text-stone-600 font-serif">
                Hiển thị phân bổ tất cả các lớp: {masterTimetable.classes.join(", ")}
              </p>
            </div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-stone-500">
              Nhấp ô bất kỳ để chỉnh sửa trực tiếp
            </div>
          </div>

          <div className="overflow-x-auto max-h-[650px] overflow-y-auto border border-black">
            <table className="w-full text-left border-collapse text-[11px]">
              <thead className="sticky top-0 z-20">
                <tr className="bg-stone-100 text-black font-serif font-bold uppercase tracking-wider text-[10px] border-b border-black">
                  <th className="py-2.5 px-2 border-r border-black text-center sticky left-0 z-30 bg-stone-100 w-16">Thứ</th>
                  <th className="py-2.5 px-2 border-r border-black text-center sticky left-16 z-30 bg-stone-100 w-12">Buổi</th>
                  <th className="py-2.5 px-1 border-r border-black text-center sticky left-28 z-30 bg-stone-100 w-10">Tiết</th>
                  {masterTimetable.classes.map((cls) => (
                    <th key={cls} className="py-2.5 px-2 border-r border-black last:border-r-0 text-center min-w-[90px]">
                      Lớp {cls}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-black">
                {DAYS_OF_WEEK.map((day) => (
                  <React.Fragment key={day}>
                    {/* Sáng 1-5 */}
                    {[1, 2, 3, 4, 5].map((period, pIdx) => {
                      const slotKey = `${day}_Sáng_${period}`;
                      return (
                        <tr key={slotKey} className={pIdx % 2 === 0 ? "bg-white" : "bg-stone-50/60"}>
                          {pIdx === 0 && (
                            <td rowSpan={8} className="py-2 px-2 text-center font-bold bg-stone-100 border-r border-black sticky left-0 z-10 font-serif">
                              {day}
                            </td>
                          )}
                          {pIdx === 0 && (
                            <td rowSpan={5} className="py-2 px-1 text-center font-bold bg-stone-50 text-black border-r border-black sticky left-16 z-10 text-[10px] uppercase font-mono">
                              Sáng
                            </td>
                          )}
                          <td className="py-1 px-1 text-center font-bold text-black border-r border-black sticky left-28 z-10 bg-white font-mono">
                            {period}
                          </td>
                          {masterTimetable.classes.map((cls) => {
                            const val = masterTimetable.slots[slotKey]?.[cls] || "";
                            const colorClass = getSubjectColor(val);
                            return (
                              <td
                                key={`${slotKey}_${cls}`}
                                onClick={() => handleCellClick(slotKey, cls, val)}
                                className="py-1 px-1 border-r border-black last:border-r-0 text-center cursor-pointer hover:bg-stone-200"
                              >
                                <div className={`px-1.5 py-1 text-[11px] truncate ${colorClass}`}>
                                  {val || "—"}
                                </div>
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}

                    {/* Chiều 1-3 */}
                    {[1, 2, 3].map((period, pIdx) => {
                      const slotKey = `${day}_Chiều_${period}`;
                      return (
                        <tr key={slotKey} className="bg-stone-50/30">
                          {pIdx === 0 && (
                            <td rowSpan={3} className="py-2 px-1 text-center font-bold bg-stone-200/60 text-black border-r border-black sticky left-16 z-10 text-[10px] uppercase font-mono">
                              Chiều
                            </td>
                          )}
                          <td className="py-1 px-1 text-center font-bold text-black border-r border-black sticky left-28 z-10 bg-white font-mono">
                            {period}
                          </td>
                          {masterTimetable.classes.map((cls) => {
                            const val = masterTimetable.slots[slotKey]?.[cls] || "";
                            const colorClass = getSubjectColor(val);
                            return (
                              <td
                                key={`${slotKey}_${cls}`}
                                onClick={() => handleCellClick(slotKey, cls, val)}
                                className="py-1 px-1 border-r border-black last:border-r-0 text-center cursor-pointer hover:bg-stone-200"
                              >
                                <div className={`px-1.5 py-1 text-[11px] truncate ${colorClass}`}>
                                  {val || "—"}
                                </div>
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 3: TKB THEO GIÁO VIÊN */}
      {viewMode === "teacher" && (() => {
        const matchedTeacher = DEFAULT_TEACHERS.find((t) => t.name === selectedTeacher);
        const specialistSub = matchedTeacher?.specialistSubject || (schoolInfo.teacherType === "specialist" ? schoolInfo.specialistSubject : undefined);

        // Helper to find taught classes and subjects for this teacher at a slot
        const getTaughtClasses = (slotKey: string, isAfternoonThursday: boolean = false) => {
          if (isAfternoonThursday) return [];
          const taught: { cls: string; sub: string }[] = [];
          masterTimetable.classes.forEach((cls) => {
            const val = (masterTimetable.slots[slotKey]?.[cls] || "").trim();
            if (!val || val === "SHCM") return;
            if (
              isSlotMatchingTeacherOrSubject(val, selectedTeacher, specialistSub) ||
              (matchedTeacher?.assignedClasses?.includes(cls) && matchedTeacher?.type === "homeroom" && !val.includes("(")) ||
              (selectedTeacher.includes("Tuấn") && cls === "5A" && !val.includes("(")) ||
              (selectedTeacher.includes("Huế") && cls === "5B" && !val.includes("(")) ||
              (selectedTeacher.includes("Hằng") && cls === "4A" && !val.includes("(")) ||
              (selectedTeacher.includes("Yến") && cls === "4B" && !val.includes("(")) ||
              (selectedTeacher.includes("Dương") && cls === "3A" && !val.includes("(")) ||
              (selectedTeacher.includes("Đạt") && cls === "3B" && !val.includes("(")) ||
              (selectedTeacher.includes("Chinh") && cls === "2A" && !val.includes("(")) ||
              (selectedTeacher.includes("Phước") && cls === "2B" && !val.includes("(")) ||
              (selectedTeacher.includes("Chi") && cls === "1A" && !val.includes("(")) ||
              (selectedTeacher.includes("Năm") && cls === "1B" && !val.includes("(")) ||
              val.toLowerCase().includes(selectedTeacher.toLowerCase().split(" ").pop() || "")
            ) {
              taught.push({ cls, sub: val });
            }
          });
          return taught;
        };

        // Calculate total teaching periods in week for this teacher
        let totalTeacherPeriods = 0;
        DAYS_OF_WEEK.forEach((day) => {
          for (let p = 1; p <= 5; p++) {
            totalTeacherPeriods += getTaughtClasses(`${day}_Sáng_${p}`).length;
          }
          for (let p = 1; p <= 3; p++) {
            totalTeacherPeriods += getTaughtClasses(`${day}_Chiều_${p}`, day === "Thứ Năm").length;
          }
        });

        return (
          <div className="bg-white border border-black p-6 sm:p-8 space-y-6 shadow-[4px_4px_0px_rgba(0,0,0,0.1)]">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-black pb-4 gap-4">
              <div>
                <h2 className="text-xl font-serif font-bold text-black uppercase tracking-tight flex items-center gap-2">
                  <Users className="w-4 h-4 text-black" />
                  THỜI KHÓA BIỂU CÁ NHÂN GIÁO VIÊN
                </h2>
                <p className="text-xs text-stone-600 mt-1 font-serif">
                  {matchedTeacher?.role || "Giáo viên"} • Trường: <span className="font-semibold text-black">{schoolInfo.schoolName}</span> • Áp dụng: <strong>Tuần {schoolInfo.week} ({schoolInfo.startDate} - {schoolInfo.endDate})</strong> • Phân bổ: <strong className="font-mono bg-stone-100 px-1.5 py-0.5 border border-stone-300">{totalTeacherPeriods} tiết dạy / tuần</strong>
                </p>
              </div>

              {/* Select Teacher and Direct Download */}
              <div className="flex items-center flex-wrap gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-stone-700">Chọn GV:</span>
                  <select
                    value={selectedTeacher}
                    onChange={(e) => {
                      setSelectedTeacher(e.target.value);
                      onSelectTeacher(e.target.value);
                    }}
                    className="px-3 py-1.5 bg-white border border-black text-xs font-serif font-bold text-black focus:outline-none shadow-[1px_1px_0px_rgba(0,0,0,1)] cursor-pointer"
                  >
                    {DEFAULT_TEACHERS.map((t) => (
                      <option key={t.id} value={t.name}>
                        {t.name} ({t.role})
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  onClick={() => exportTeacherTimetableDocx(schoolInfo, masterTimetable, selectedTeacher, "portrait")}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-black hover:bg-stone-800 text-white text-[10px] font-bold uppercase tracking-wider border border-black shadow-[2px_2px_0px_rgba(0,0,0,0.3)] transition-colors cursor-pointer"
                  title={`Tải Thời khóa biểu Word A4 cho thầy/cô ${selectedTeacher}`}
                >
                  <FileDown className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Tải TKB {selectedTeacher.split(" ").pop()} (.docx)</span>
                </button>

                <button
                  type="button"
                  onClick={handleExportExcel}
                  className="flex items-center gap-1 px-2.5 py-1.5 bg-white hover:bg-stone-100 text-black text-[10px] font-bold uppercase tracking-wider border border-black shadow-[1px_1px_0px_rgba(0,0,0,1)] transition-colors cursor-pointer"
                  title="Tải bảng TKB giáo viên ra file Excel (.xlsx)"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Excel</span>
                </button>
              </div>
            </div>

            {/* Teacher Timetable Grid */}
            <div className="overflow-x-auto border border-black">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-stone-100 text-black font-serif font-bold uppercase tracking-wider text-[10px] border-b border-black">
                    <th className="py-3 px-3 w-20 border-r border-black text-center">Buổi</th>
                    <th className="py-3 px-2 w-14 border-r border-black text-center">Tiết</th>
                    {DAYS_OF_WEEK.map((day) => {
                      const dateInfo = dayDateMap[day];
                      return (
                        <th key={day} className="py-2 px-3 border-r border-black last:border-r-0 text-center">
                          <div>{day}</div>
                          {dateInfo && (
                            <div className="text-[10px] font-mono font-medium text-stone-600 mt-0.5">
                              ({dateInfo.shortDate})
                            </div>
                          )}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody className="divide-y divide-black">
                  {/* Sáng */}
                  {[1, 2, 3, 4, 5].map((period, idx) => (
                    <tr key={`t-sang-${period}`} className={period % 2 === 0 ? "bg-stone-50/60" : "bg-white"}>
                      {idx === 0 && (
                        <td rowSpan={5} className="py-3 px-3 font-serif font-bold text-center bg-stone-100 text-black border-r border-black uppercase">
                          SÁNG
                        </td>
                      )}
                      <td className="py-2.5 px-2 text-center font-mono font-bold text-black border-r border-black">
                        {period}
                      </td>
                      {DAYS_OF_WEEK.map((day) => {
                        const slotKey = `${day}_Sáng_${period}`;
                        const taughtClasses = getTaughtClasses(slotKey);

                        return (
                          <td key={slotKey} className="py-2 px-2 border-r border-black last:border-r-0 text-center">
                            {taughtClasses.length > 0 ? (
                              <div className="space-y-1">
                                {taughtClasses.map((tc, i) => (
                                  <div key={i} className="p-1.5 border border-black bg-stone-50 text-black text-xs font-semibold">
                                    Lớp <span className="font-bold">{tc.cls}</span>: {tc.sub}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <span className="text-stone-300 italic text-[11px]">—</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}

                  {/* Chiều */}
                  {[1, 2, 3].map((period, idx) => (
                    <tr key={`t-chieu-${period}`} className={period % 2 === 0 ? "bg-stone-50/60" : "bg-white"}>
                      {idx === 0 && (
                        <td rowSpan={3} className="py-3 px-3 font-serif font-bold text-center bg-stone-100 text-black border-r border-black uppercase">
                          CHIỀU
                        </td>
                      )}
                      <td className="py-2.5 px-2 text-center font-mono font-bold text-black border-r border-black">
                        {period}
                      </td>
                      {DAYS_OF_WEEK.map((day) => {
                        const slotKey = `${day}_Chiều_${period}`;
                        const isThuNam = day === "Thứ Năm";
                        const taughtClasses = getTaughtClasses(slotKey, isThuNam);

                        return (
                          <td key={slotKey} className="py-2 px-2 border-r border-black last:border-r-0 text-center">
                            {isThuNam ? (
                              <span className="text-stone-600 font-bold bg-stone-200 px-2 py-1 border border-stone-400 text-[10px] uppercase">SHCM</span>
                            ) : taughtClasses.length > 0 ? (
                              <div className="space-y-1">
                                {taughtClasses.map((tc, i) => (
                                  <div key={i} className="p-1.5 border border-black bg-stone-50 text-black text-xs font-semibold">
                                    Lớp <span className="font-bold">{tc.cls}</span>: {tc.sub}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <span className="text-stone-300 italic text-[11px]">—</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })()}

      {/* Editing Cell Inline Modal */}
      {editingCell && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-2 border-black p-6 shadow-[8px_8px_0px_rgba(0,0,0,1)] max-w-md w-full space-y-4">
            <h4 className="font-serif font-bold text-base text-black flex items-center gap-2 uppercase tracking-tight">
              <Edit3 className="w-4 h-4 text-black" />
              Sửa Tiết Học: Lớp {editingCell.className} ({editingCell.slotKey.replace(/_/g, " - ")})
            </h4>
            <div>
              <label className="block text-[10px] uppercase font-bold tracking-wider text-stone-700 mb-1">
                Nhập tên môn học / phân môn / GV:
              </label>
              <input
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                placeholder="Ví dụ: Tiếng Việt, Toán, Đạo đức, TA (Nương)..."
                className="w-full px-3 py-2 text-sm border border-black focus:outline-none font-serif font-semibold"
                autoFocus
              />
            </div>

            {/* Quick Suggestions */}
            <div className="flex flex-wrap gap-1.5 text-xs">
              {["Tiếng Việt", "Toán", "HĐTN", "Khoa học", "TNXH", "Đạo đức", "LS&ĐL", "Công nghệ", "Tin học", "Thể chất", "Âm nhạc", "Mĩ thuật", "TA (Nương)", "TCTV", "TCT"].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setEditValue(s)}
                  className="px-2 py-1 bg-stone-100 hover:bg-black hover:text-white border border-stone-300 text-stone-800 text-[10px] font-bold uppercase transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-black">
              <button
                type="button"
                onClick={() => setEditingCell(null)}
                className="px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-stone-700 hover:bg-stone-200 border border-stone-300"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSaveCell}
                className="px-4 py-1.5 text-xs font-bold uppercase tracking-wider bg-black text-white hover:bg-stone-800 border border-black shadow-[2px_2px_0px_rgba(0,0,0,0.4)] flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Cập nhật</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
