import React, { useState } from "react";
import { SchoolInfo, ScheduleItem, Grade } from "../types";
import {
  generateWeeklyWorksheets,
  SubjectWorksheet,
  getRequiredSubjectsForGrade,
  getLoigiaihaySubjectUrl,
  MultipleChoiceQuestion
} from "../data/weeklyWorksheetsData";
import {
  exportSubjectWorksheetDocx,
  exportAllSubjectsWeeklyWorksheetDocx
} from "../utils/worksheetDocxExporter";
import { ALL_ACADEMIC_WEEKS } from "../utils/dateHelper";
import {
  FileDown,
  Download,
  ExternalLink,
  BookOpen,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Layers,
  GraduationCap,
  Loader2,
  Printer,
  ChevronRight,
  HelpCircle,
  RefreshCw
} from "lucide-react";

interface WeeklyWorksheetViewProps {
  schoolInfo: SchoolInfo;
  scheduleItems: ScheduleItem[];
  onUpdateSchoolInfo?: (info: SchoolInfo) => void;
}

export const WeeklyWorksheetView: React.FC<WeeklyWorksheetViewProps> = ({
  schoolInfo,
  scheduleItems,
  onUpdateSchoolInfo,
}) => {
  const [selectedGrade, setSelectedGrade] = useState<Grade>((schoolInfo.grade || 5) as Grade);
  const [selectedWeek, setSelectedWeek] = useState<number>(schoolInfo.week || 1);
  const [activeSubjectTab, setActiveSubjectTab] = useState<string>("all");
  
  // Interactive quiz test state: { [questionId]: selectedOptionKey }
  const [userAnswers, setUserAnswers] = useState<Record<string, "A" | "B" | "C" | "D">>({});
  const [showExplanations, setShowExplanations] = useState<Record<string, boolean>>({});

  const [downloadingSubject, setDownloadingSubject] = useState<string | null>(null);
  const [downloadAllState, setDownloadAllState] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Generate worksheets for selected grade & week
  const worksheets = generateWeeklyWorksheets(selectedGrade, selectedWeek, scheduleItems);
  const requiredSubjects = getRequiredSubjectsForGrade(selectedGrade);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleDownloadSingle = async (ws: SubjectWorksheet) => {
    try {
      setDownloadingSubject(ws.subject);
      await exportSubjectWorksheetDocx(ws, schoolInfo, true);
      showToast(`Đã tải Phiếu bài tập môn ${ws.subject} Tuần ${selectedWeek} (Khối ${selectedGrade})!`);
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
      await exportAllSubjectsWeeklyWorksheetDocx(worksheets, {
        ...schoolInfo,
        grade: selectedGrade,
        week: selectedWeek,
      });
      showToast(`Đã tải trọn bộ tất cả các môn Tuần ${selectedWeek} (Khối ${selectedGrade})!`);
    } catch (err) {
      console.error("Export all worksheets error:", err);
      alert("Có lỗi khi tạo file Word trọn bộ, vui lòng thử lại.");
    } finally {
      setDownloadAllState(false);
    }
  };

  const handleSelectAnswer = (qId: string, optKey: "A" | "B" | "C" | "D") => {
    setUserAnswers((prev) => ({ ...prev, [qId]: optKey }));
    setShowExplanations((prev) => ({ ...prev, [qId]: true }));
  };

  const handleResetQuiz = () => {
    setUserAnswers({});
    setShowExplanations({});
  };

  const filteredWorksheets = activeSubjectTab === "all"
    ? worksheets
    : worksheets.filter((ws) => ws.subject === activeSubjectTab);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border-2 border-stone-800 rounded-lg p-4 sm:p-5 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded bg-amber-600 text-white flex items-center justify-center shrink-0 shadow">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-extrabold text-lg sm:text-xl text-stone-900 tracking-tight">
                  PHIẾU BÀI TẬP TRẮC NGHIỆM CUỐI TUẦN
                </h2>
                <span className="bg-amber-100 text-amber-900 border border-amber-400 text-xs font-bold px-2 py-0.5 rounded">
                  Chương trình GDPT 2018
                </span>
              </div>
              <p className="text-xs sm:text-sm text-stone-600 mt-1">
                Phiếu bài tập trắc nghiệm và tự luận cuối tuần tương ứng theo <strong>Lịch báo giảng KHBD</strong> của từng tuần theo khối lớp.
                Tất cả câu hỏi và lời giải chi tiết được tham khảo trực tiếp từ website giáo dục uy tín:{" "}
                <a
                  href="https://loigiaihay.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-amber-700 underline hover:text-amber-900 inline-flex items-center gap-0.5"
                >
                  https://loigiaihay.com/
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </p>
            </div>
          </div>

          {/* Quick Bulk Download Button */}
          <div className="flex items-center gap-2 flex-wrap shrink-0">
            <button
              type="button"
              id="btn-worksheet-view-download-all"
              onClick={handleDownloadAll}
              disabled={downloadAllState}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm rounded border-2 border-emerald-900 shadow-[2px_2px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50 cursor-pointer"
            >
              {downloadAllState ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Layers className="w-4 h-4" />
              )}
              <span>TẢI TRỌN BỘ TẤT CẢ MÔN TUẦN {selectedWeek} (.DOCX)</span>
            </button>

            <a
              href="https://loigiaihay.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs sm:text-sm rounded border border-stone-400 shadow-sm transition-all"
            >
              <span>Mở Loigiaihay.com</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Filter Bar: Grade & Week & Subject */}
        <div className="mt-4 pt-3 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
          {/* Grade selector */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-stone-700 uppercase">Khối Lớp:</span>
            {([1, 2, 3, 4, 5] as Grade[]).map((g) => (
              <button
                key={g}
                type="button"
                id={`btn-select-grade-${g}`}
                onClick={() => {
                  setSelectedGrade(g);
                  setActiveSubjectTab("all");
                  handleResetQuiz();
                }}
                className={`px-3 py-1 text-xs font-bold rounded border transition-all cursor-pointer ${
                  selectedGrade === g
                    ? "bg-amber-600 text-white border-amber-800 shadow-sm"
                    : "bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-300"
                }`}
              >
                Khối {g}
              </button>
            ))}
          </div>

          {/* Week selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-stone-700 uppercase">Tuần Học:</span>
            <select
              id="select-worksheet-week"
              value={selectedWeek}
              onChange={(e) => {
                setSelectedWeek(parseInt(e.target.value));
                handleResetQuiz();
              }}
              className="px-2.5 py-1 text-xs font-bold border border-stone-400 rounded bg-white text-stone-900 cursor-pointer"
            >
              {ALL_ACADEMIC_WEEKS.map((w) => (
                <option key={w.week} value={w.week}>
                  {w.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Grade Subjects Notice */}
        <div className="mt-2 text-xs text-stone-600 bg-stone-50 p-2 rounded border border-stone-200 flex items-center gap-1.5 flex-wrap">
          <span className="font-bold text-amber-900">Danh mục môn quy định:</span>
          {selectedGrade <= 3 ? (
            <span>Toán, Tiếng Việt, Đạo đức, Hoạt động trải nghiệm (HĐTN), Tự nhiên và Xã hội (TNXH)</span>
          ) : (
            <span>Toán, Tiếng Việt, Đạo đức, Hoạt động trải nghiệm (HĐTN), Khoa học, Lịch sử và Địa lí</span>
          )}
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-3 bg-emerald-100 border-2 border-emerald-500 text-emerald-900 text-sm font-bold rounded-lg shadow flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-emerald-700 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Subject Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setActiveSubjectTab("all")}
          className={`px-3 py-1.5 text-xs font-bold rounded-t-md border-t-2 border-x-2 transition-all cursor-pointer whitespace-nowrap ${
            activeSubjectTab === "all"
              ? "bg-amber-600 text-white border-amber-700 shadow"
              : "bg-white hover:bg-stone-100 text-stone-700 border-stone-300"
          }`}
        >
          Tất cả môn ({requiredSubjects.length})
        </button>
        {worksheets.map((ws) => (
          <button
            key={ws.subject}
            type="button"
            onClick={() => setActiveSubjectTab(ws.subject)}
            className={`px-3 py-1.5 text-xs font-bold rounded-t-md border-t-2 border-x-2 transition-all cursor-pointer whitespace-nowrap ${
              activeSubjectTab === ws.subject
                ? "bg-amber-600 text-white border-amber-700 shadow"
                : "bg-white hover:bg-stone-100 text-stone-700 border-stone-300"
            }`}
          >
            {ws.subject}
          </button>
        ))}
      </div>

      {/* Worksheet Cards */}
      <div className="space-y-6">
        {filteredWorksheets.map((ws) => {
          const isDownloading = downloadingSubject === ws.subject;
          const searchUrl = getLoigiaihaySubjectUrl(selectedGrade, ws.subject, selectedWeek);

          return (
            <div
              key={ws.id}
              className="bg-white border-2 border-stone-800 rounded-lg p-4 sm:p-6 shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-all"
            >
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-extrabold text-base sm:text-lg text-stone-900">
                      MÔN: {ws.subject.toUpperCase()} - TUẦN {ws.week} (KHỐI {ws.grade})
                    </span>
                    <span className="bg-stone-100 text-stone-700 text-xs font-semibold px-2 py-0.5 rounded border border-stone-300">
                      Lớp {schoolInfo.className}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Thời lượng chuẩn: 40 phút • {ws.multipleChoiceQuestions.length} câu trắc nghiệm + {ws.essayQuestions.length} bài tự luận
                  </p>
                </div>

                {/* Card Action Buttons */}
                <div className="flex items-center gap-2 flex-wrap">
                  <a
                    href={searchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold rounded border border-amber-400 transition-colors"
                    title={`Mở bài tập tuần ${ws.week} môn ${ws.subject} trên Loigiaihay.com`}
                  >
                    <span>Mở Loigiaihay.com</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    type="button"
                    onClick={() => handleDownloadSingle(ws)}
                    disabled={isDownloading}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white text-xs font-bold rounded shadow border border-amber-800 transition-all disabled:opacity-50 cursor-pointer"
                    title={`Tải file Word A4 môn ${ws.subject}`}
                  >
                    {isDownloading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Download className="w-3.5 h-3.5" />
                    )}
                    <span>TẢI PHIẾU WORD A4 (.DOCX)</span>
                  </button>
                </div>
              </div>

              {/* Focus lessons according to Lịch báo giảng KHBD */}
              {ws.focusLessons && ws.focusLessons.length > 0 && (
                <div className="mt-3 bg-amber-50/70 border border-amber-200 rounded p-3 text-xs">
                  <div className="font-bold text-amber-900 mb-1 flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 text-amber-700" />
                    <span>Nội dung bài học bám sát Lịch báo giảng KHBD trong tuần:</span>
                  </div>
                  <ul className="list-disc list-inside text-stone-700 space-y-0.5">
                    {ws.focusLessons.map((lesson, idx) => (
                      <li key={idx}>
                        <span className="font-medium">{lesson}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Part I: Multiple Choice Questions */}
              <div className="mt-5">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wide flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-stone-900 text-white text-xs flex items-center justify-center font-extrabold">
                      I
                    </span>
                    <span>Phần Trắc Nghiệm (Khoanh tròn câu trả lời đúng)</span>
                  </h3>
                  <span className="text-xs text-stone-500 italic">
                    (Click vào đáp án để kiểm tra kết quả ngay)
                  </span>
                </div>

                <div className="space-y-4">
                  {ws.multipleChoiceQuestions.map((q, qIndex) => {
                    const selected = userAnswers[q.id];
                    const isAnswered = selected !== undefined;
                    const isCorrect = selected === q.correctAnswer;
                    const showExp = showExplanations[q.id];

                    return (
                      <div
                        key={q.id}
                        className={`p-3.5 rounded-lg border transition-all ${
                          isAnswered
                            ? isCorrect
                              ? "bg-emerald-50/60 border-emerald-300"
                              : "bg-rose-50/60 border-rose-300"
                            : "bg-stone-50/50 border-stone-200 hover:border-stone-300"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <p className="font-bold text-xs sm:text-sm text-stone-900">
                            <span className="text-amber-700 font-extrabold mr-1">
                              Câu {qIndex + 1}:
                            </span>
                            {q.question}
                          </p>

                          {isAnswered && (
                            <span
                              className={`text-[11px] font-bold px-2 py-0.5 rounded shrink-0 ${
                                isCorrect
                                  ? "bg-emerald-200 text-emerald-900 border border-emerald-400"
                                  : "bg-rose-200 text-rose-900 border border-rose-400"
                              }`}
                            >
                              {isCorrect ? "Chính xác!" : `Chưa đúng (Đáp án: ${q.correctAnswer})`}
                            </span>
                          )}
                        </div>

                        {/* Options */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                          {q.options.map((opt) => {
                            const isChosen = selected === opt.key;
                            const isCorrectOpt = opt.key === q.correctAnswer;

                            let optClasses =
                              "flex items-center gap-2 p-2 rounded border text-xs text-left transition-all cursor-pointer ";
                            if (isAnswered) {
                              if (isChosen && isCorrect) {
                                optClasses += "bg-emerald-100 border-emerald-500 text-emerald-950 font-bold";
                              } else if (isChosen && !isCorrect) {
                                optClasses += "bg-rose-100 border-rose-500 text-rose-950 font-bold";
                              } else if (isCorrectOpt) {
                                optClasses += "bg-emerald-50 border-emerald-400 text-emerald-900 font-bold";
                              } else {
                                optClasses += "bg-white border-stone-200 text-stone-500 opacity-60";
                              }
                            } else {
                              optClasses += "bg-white hover:bg-amber-50 border-stone-300 text-stone-800";
                            }

                            return (
                              <button
                                key={opt.key}
                                type="button"
                                onClick={() => handleSelectAnswer(q.id, opt.key)}
                                className={optClasses}
                              >
                                <span
                                  className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[11px] shrink-0 border ${
                                    isChosen
                                      ? "bg-stone-900 text-white border-stone-900"
                                      : "bg-stone-100 text-stone-700 border-stone-300"
                                  }`}
                                >
                                  {opt.key}
                                </span>
                                <span>{opt.text}</span>
                              </button>
                            );
                          })}
                        </div>

                        {/* Explanation Toggle & Content */}
                        {isAnswered && (
                          <div className="mt-3 pt-2 border-t border-stone-200 text-xs text-stone-700">
                            <div className="flex items-center gap-1.5 font-bold text-amber-800 mb-0.5">
                              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                              <span>Lời giải chi tiết (Nguồn: Loigiaihay.com):</span>
                            </div>
                            <p className="italic text-stone-800 bg-white/80 p-2 rounded border border-stone-200">
                              {q.explanation}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Part II: Essay / Practice Questions */}
              {ws.essayQuestions && ws.essayQuestions.length > 0 && (
                <div className="mt-6 pt-4 border-t border-stone-200">
                  <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wide flex items-center gap-1.5 mb-3">
                    <span className="w-5 h-5 rounded-full bg-stone-900 text-white text-xs flex items-center justify-center font-extrabold">
                      II
                    </span>
                    <span>Phần Tự Luận & Vận Dụng Thực Hành</span>
                  </h3>

                  <div className="space-y-3">
                    {ws.essayQuestions.map((eq, eIndex) => (
                      <div
                        key={eq.id}
                        className="bg-stone-50 border border-stone-200 rounded-lg p-3 text-xs"
                      >
                        <p className="font-bold text-stone-900 mb-1.5">
                          <span className="text-amber-700 mr-1">Bài {eIndex + 1}:</span>
                          {eq.question}
                        </p>
                        <div className="bg-white border border-stone-200 rounded p-2.5">
                          <span className="font-bold text-stone-600 block mb-1">
                            Gợi ý giải bài tập (Loigiaihay.com):
                          </span>
                          <p className="text-stone-800">{eq.sampleAnswer}</p>
                          {eq.guide && (
                            <p className="text-stone-500 italic mt-1">Lưu ý: {eq.guide}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
