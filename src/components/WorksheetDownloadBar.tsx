import React, { useState } from "react";
import { SchoolInfo, ScheduleItem, Grade } from "../types";
import {
  generateWeeklyWorksheets,
  SubjectWorksheet,
  getRequiredSubjectsForGrade,
  LOIGIAIHAY_CATEGORY_LINKS,
  getLoigiaihaySubjectUrl
} from "../data/weeklyWorksheetsData";
import {
  exportSubjectWorksheetDocx,
  exportAllSubjectsWeeklyWorksheetDocx
} from "../utils/worksheetDocxExporter";
import {
  FileDown,
  Download,
  ExternalLink,
  BookOpen,
  CheckCircle,
  Sparkles,
  Layers,
  GraduationCap,
  Loader2
} from "lucide-react";

interface WorksheetDownloadBarProps {
  schoolInfo: SchoolInfo;
  scheduleItems: ScheduleItem[];
  onOpenWorksheetView?: () => void;
  className?: string;
}

export const WorksheetDownloadBar: React.FC<WorksheetDownloadBarProps> = ({
  schoolInfo,
  scheduleItems,
  onOpenWorksheetView,
  className = "",
}) => {
  const currentGrade = (schoolInfo.grade || 5) as Grade;
  const currentWeek = schoolInfo.week || 1;

  const [downloadingSubject, setDownloadingSubject] = useState<string | null>(null);
  const [downloadAllState, setDownloadAllState] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Generate worksheets dynamically based on current grade, week and schedule
  const worksheets = generateWeeklyWorksheets(currentGrade, currentWeek, scheduleItems);
  const requiredSubjects = getRequiredSubjectsForGrade(currentGrade);

  const showToast = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 3500);
  };

  const handleDownloadSingle = async (ws: SubjectWorksheet) => {
    try {
      setDownloadingSubject(ws.subject);
      await exportSubjectWorksheetDocx(ws, schoolInfo, true);
      showToast(`Đã tải Phiếu trắc nghiệm môn ${ws.subject} (Tuần ${currentWeek})!`);
    } catch (err) {
      console.error("Export worksheet error:", err);
      alert("Có lỗi khi tạo file Word, vui lòng thử lại.");
    } finally {
      setDownloadingSubject(null);
    }
  };

  const handleDownloadAll = async () => {
    try {
      setDownloadAllState(true);
      await exportAllSubjectsWeeklyWorksheetDocx(worksheets, schoolInfo);
      showToast(`Đã tải thành công trọn bộ tất cả các môn Tuần ${currentWeek} (Khối ${currentGrade})!`);
    } catch (err) {
      console.error("Export all worksheets error:", err);
      alert("Có lỗi khi tạo bộ file Word, vui lòng thử lại.");
    } finally {
      setDownloadAllState(false);
    }
  };

  return (
    <div
      id="worksheet-download-bar"
      className={`bg-amber-50/90 border-2 border-amber-500 rounded-lg p-3.5 sm:p-4 shadow-[3px_3px_0px_rgba(217,119,6,1)] text-stone-900 transition-all ${className}`}
    >
      {/* Top Banner Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5 pb-2.5 border-b border-amber-200">
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="w-8 h-8 rounded bg-amber-600 text-white flex items-center justify-center font-bold shadow-sm shrink-0">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-extrabold text-sm sm:text-base text-amber-950 uppercase tracking-wide">
                Thanh Tải Phiếu Bài Tập Trắc Nghiệm Cuối Tuần
              </span>
              <span className="bg-amber-200 text-amber-900 text-xs font-bold px-2 py-0.5 rounded border border-amber-400">
                Tuần {currentWeek} • Khối {currentGrade} ({schoolInfo.className})
              </span>
            </div>
            <p className="text-xs text-stone-600 mt-0.5 flex items-center gap-1.5 flex-wrap">
              <span>Bám sát Lịch báo giảng KHBD của lớp</span>
              <span className="text-stone-400">•</span>
              <span className="flex items-center gap-1 font-medium text-amber-800">
                <span>Nguồn tham khảo:</span>
                <a
                  href="https://loigiaihay.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-amber-950 font-bold inline-flex items-center gap-0.5"
                  title="Truy cập trang web Loigiaihay.com"
                >
                  https://loigiaihay.com/
                  <ExternalLink className="w-3 h-3" />
                </a>
              </span>
            </p>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <button
            type="button"
            id="btn-download-all-worksheets"
            onClick={handleDownloadAll}
            disabled={downloadAllState}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white text-xs sm:text-sm font-bold rounded shadow border border-emerald-900 transition-all disabled:opacity-50 cursor-pointer"
            title="Tải toàn bộ phiếu bài tập tất cả các môn của tuần này đóng gói thành 1 file Word duy nhất"
          >
            {downloadAllState ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Layers className="w-4 h-4 text-emerald-200" />
            )}
            <span>TẢI TRỌN BỘ TẤT CẢ MÔN TUẦN {currentWeek} (.DOCX)</span>
          </button>

          {onOpenWorksheetView && (
            <button
              type="button"
              id="btn-open-worksheet-manager"
              onClick={onOpenWorksheetView}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-white hover:bg-stone-100 text-stone-800 text-xs font-semibold rounded border border-stone-300 shadow-sm transition-all cursor-pointer"
              title="Mở giao diện đầy đủ xem trước câu hỏi và làm thử trắc nghiệm"
            >
              <BookOpen className="w-3.5 h-3.5 text-stone-600" />
              <span>Xem / Làm thử</span>
            </button>
          )}
        </div>
      </div>

      {/* Grade Subject Download Buttons Bar */}
      <div className="pt-2.5">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1">
            <span>Tải riêng từng môn ({requiredSubjects.length} môn theo quy định khối {currentGrade}):</span>
          </span>
          <span className="text-[11px] text-stone-500 italic hidden sm:inline">
            {currentGrade <= 3
              ? "Toán, Tiếng Việt, Đạo đức, HĐTN, TNXH (Khối 1, 2, 3)"
              : "Toán, Tiếng Việt, Đạo đức, HĐTN, Khoa học, LS & Địa lí (Khối 4, 5)"}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {worksheets.map((ws) => {
            const isDownloading = downloadingSubject === ws.subject;
            const searchUrl = getLoigiaihaySubjectUrl(currentGrade, ws.subject, currentWeek);

            return (
              <div
                key={ws.id}
                className="bg-white border border-amber-300 hover:border-amber-500 rounded p-2 flex flex-col justify-between shadow-xs transition-all group"
              >
                <div className="mb-1.5">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-bold text-xs text-stone-900 truncate" title={ws.subject}>
                      {ws.subject}
                    </span>
                    <a
                      href={searchUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-600 hover:text-amber-800 p-0.5"
                      title={`Xem bài tập ${ws.subject} Tuần ${currentWeek} trên Loigiaihay.com`}
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div className="text-[11px] text-stone-500">
                    {ws.multipleChoiceQuestions.length} câu TN + {ws.essayQuestions.length} TL
                  </div>
                </div>

                <button
                  type="button"
                  id={`btn-download-ws-${ws.subject}`}
                  onClick={() => handleDownloadSingle(ws)}
                  disabled={isDownloading}
                  className="w-full flex items-center justify-center gap-1 py-1 px-1.5 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white text-[11px] font-bold rounded transition-colors disabled:opacity-50 cursor-pointer"
                  title={`Tải phiếu bài tập môn ${ws.subject} Tuần ${currentWeek} (Word A4)`}
                >
                  {isDownloading ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Download className="w-3 h-3" />
                  )}
                  <span>Tải Word A4</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Success Notification Toast */}
      {successMessage && (
        <div className="mt-2.5 p-2 bg-emerald-100 border border-emerald-400 text-emerald-800 text-xs font-semibold rounded flex items-center gap-2 animate-fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}
    </div>
  );
};
