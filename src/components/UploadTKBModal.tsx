import React, { useState } from "react";
import { MasterTimetable } from "../types";
import { DEFAULT_MASTER_TIMETABLE, DAYS_OF_WEEK } from "../data/defaultTimetables";
import { 
  X, 
  UploadCloud, 
  FileSpreadsheet, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  FileText
} from "lucide-react";
import * as XLSX from "xlsx";

interface UploadTKBModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyTimetable: (newTKB: MasterTimetable) => void;
  currentTimetable: MasterTimetable;
}

export const UploadTKBModal: React.FC<UploadTKBModalProps> = ({
  isOpen,
  onClose,
  onApplyTimetable,
  currentTimetable,
}) => {
  const [activeMode, setActiveMode] = useState<"file" | "paste" | "preset">("file");
  const [pastedText, setPastedText] = useState("");
  const [schoolTitle] = useState(currentTimetable.schoolName || "Trường Tiểu học");
  const [effectiveDate] = useState("Áp dụng từ Tuần 1");
  const [parseStatus, setParseStatus] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  // Handle Excel File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        const wsName = wb.SheetNames[0];
        const ws = wb.Sheets[wsName];
        const data: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1 });

        // Parse matrix or table
        const newSlots: Record<string, Record<string, string>> = { ...currentTimetable.slots };
        let detectedClasses = [...currentTimetable.classes];

        // Process rows to extract timetable
        data.forEach((row) => {
          if (!row || row.length < 3) return;
          const dayMatch = DAYS_OF_WEEK.find(d => String(row[0] || "").toLowerCase().includes(d.toLowerCase()) || String(row[1] || "").toLowerCase().includes(d.toLowerCase()));
          // If valid row
          if (dayMatch) {
            const session = String(row[1] || "").includes("Chiều") || String(row[2] || "").includes("Chiều") ? "Chiều" : "Sáng";
            const period = parseInt(String(row[2] || row[3] || "1")) || 1;
            const slotKey = `${dayMatch}_${session}_${period}`;
            if (!newSlots[slotKey]) newSlots[slotKey] = {};

            // Map columns to classes
            detectedClasses.forEach((cls, cIdx) => {
              const cellVal = row[cIdx + 3];
              if (cellVal !== undefined && cellVal !== null && String(cellVal).trim() !== "") {
                newSlots[slotKey][cls] = String(cellVal).trim();
              }
            });
          }
        });

        setParseStatus(`Đã đọc thành công tệp Excel: "${file.name}" với ${detectedClasses.length} lớp học.`);
        setIsSuccess(true);

        onApplyTimetable({
          schoolName: schoolTitle,
          effectiveDate,
          classes: detectedClasses,
          slots: newSlots,
        });
      } catch (err: any) {
        setParseStatus(`Lỗi đọc tệp Excel: ${err.message}`);
        setIsSuccess(false);
      }
    };
    reader.readAsBinaryString(file);
  };

  // Handle Pasting raw table text
  const handleProcessPastedText = () => {
    if (!pastedText.trim()) return;

    try {
      const lines = pastedText.split("\n").map(l => l.trim()).filter(Boolean);
      const newSlots = { ...currentTimetable.slots };
      let currentDay: any = "Thứ Hai";
      let currentSession: any = "Sáng";

      lines.forEach((line) => {
        const foundDay = DAYS_OF_WEEK.find(d => line.includes(d));
        if (foundDay) currentDay = foundDay;
        if (line.toLowerCase().includes("chiều")) currentSession = "Chiều";
        if (line.toLowerCase().includes("sáng")) currentSession = "Sáng";

        const parts = line.split(/[\t,|;]+/).map(p => p.trim());
        if (parts.length >= 2) {
          const period = parseInt(parts[0]) || 1;
          const slotKey = `${currentDay}_${currentSession}_${period}`;
          if (!newSlots[slotKey]) newSlots[slotKey] = {};

          currentTimetable.classes.forEach((cls, idx) => {
            if (parts[idx + 1]) {
              newSlots[slotKey][cls] = parts[idx + 1];
            }
          });
        }
      });

      setParseStatus("Đã xử lý và cập nhật thời khóa biểu từ văn bản dán.");
      setIsSuccess(true);

      onApplyTimetable({
        schoolName: schoolTitle,
        effectiveDate,
        classes: currentTimetable.classes,
        slots: newSlots,
      });
    } catch (err: any) {
      setParseStatus(`Lỗi phân tích văn bản: ${err.message}`);
      setIsSuccess(false);
    }
  };

  // Load Presets
  const handleLoadPreset = (presetName: string) => {
    if (presetName === "tanthanh" || presetName === "kienbinh") {
      onApplyTimetable({
        ...DEFAULT_MASTER_TIMETABLE,
        schoolName: "Trường Tiểu học Tân Thạnh",
        branchName: "Phân hiệu Kiến Bình",
        effectiveDate: "Áp dụng từ ngày 07/09/2026 (Tuần 01) - NH 2026-2027",
      });
      setParseStatus("Đã tải thành công TKB chuẩn: Trường TH Tân Thạnh - Phân hiệu Kiến Bình (19 Lớp - 31 Giáo viên)");
      setIsSuccess(true);
    } else if (presetName === "quangtrung") {
      onApplyTimetable({
        ...DEFAULT_MASTER_TIMETABLE,
        schoolName: "Trường TH&THCS Quang Trung",
      });
      setParseStatus("Đã tải thành công TKB chuẩn: Trường TH&THCS Quang Trung (Khối 1 -> 5)");
      setIsSuccess(true);
    } else if (presetName === "chibi") {
      onApplyTimetable({
        ...DEFAULT_MASTER_TIMETABLE,
        schoolName: "Trường Tiểu học Chibi",
      });
      setParseStatus("Đã tải thành công TKB chuẩn: Trường Tiểu học Chibi (2 buổi/ngày)");
      setIsSuccess(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 font-serif">
      <div className="bg-white border-2 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] w-full max-w-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-black text-white flex items-center justify-between border-b-2 border-black">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 bg-white text-black border border-white">
              <UploadCloud className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white uppercase tracking-wider">
                Đưa Thời Khóa Biểu Nhà Trường Lên Hệ Thống
              </h3>
              <p className="text-[11px] text-stone-400 font-serif">
                Hỗ trợ tải file Excel, dán bảng hoặc nạp mẫu TKB nhà trường
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Mode Switcher */}
          <div className="flex border border-black bg-white overflow-hidden shadow-[1px_1px_0px_rgba(0,0,0,1)] text-xs font-bold uppercase tracking-wider">
            <button
              onClick={() => setActiveMode("file")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 transition-colors border-r border-black ${
                activeMode === "file" ? "bg-black text-white" : "bg-white text-stone-700 hover:bg-stone-100"
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>1. Tải Tệp Excel</span>
            </button>

            <button
              onClick={() => setActiveMode("paste")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 transition-colors border-r border-black ${
                activeMode === "paste" ? "bg-black text-white" : "bg-white text-stone-700 hover:bg-stone-100"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>2. Dán Bảng TKB</span>
            </button>

            <button
              onClick={() => setActiveMode("preset")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 transition-colors ${
                activeMode === "preset" ? "bg-black text-white" : "bg-white text-stone-700 hover:bg-stone-100"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>3. Mẫu Chuẩn Có Sẵn</span>
            </button>
          </div>

          {/* Mode 1: File Upload */}
          {activeMode === "file" && (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-black bg-stone-50 p-8 text-center hover:bg-stone-100 transition-colors cursor-pointer relative">
                <input
                  type="file"
                  accept=".xlsx, .xls, .csv"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="w-10 h-10 bg-white border border-black flex items-center justify-center mx-auto mb-3 shadow-[1px_1px_0px_rgba(0,0,0,1)] text-black">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-black mb-1 uppercase tracking-tight">
                  Nhấp hoặc Kéo thả tệp Excel TKB vào đây
                </h4>
                <p className="text-xs text-stone-600 max-w-sm mx-auto font-serif">
                  Hệ thống hỗ trợ tệp bảng tính thời khóa biểu toàn trường hoặc từng khối lớp
                </p>
              </div>
            </div>
          )}

          {/* Mode 2: Paste Raw Data */}
          {activeMode === "paste" && (
            <div className="space-y-3 font-serif">
              <label className="block text-[10px] uppercase font-bold tracking-wider text-black">
                Dán các dòng hoặc bảng thời khóa biểu vào đây:
              </label>
              <textarea
                rows={6}
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                placeholder="Ví dụ:&#10;Thứ Hai	Sáng	1	HĐTN	HĐTN	HĐTN...&#10;Thứ Hai	Sáng	2	Tiếng Việt	Tiếng Việt..."
                className="w-full px-3 py-2 text-xs font-mono border border-black bg-stone-50 focus:outline-none focus:bg-white"
              />
              <button
                type="button"
                onClick={handleProcessPastedText}
                className="w-full py-2.5 bg-black hover:bg-stone-800 text-white text-xs font-bold uppercase tracking-wider border border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Phân Tích & Cập Nhật TKB</span>
              </button>
            </div>
          )}

          {/* Mode 3: Presets */}
          {activeMode === "preset" && (
            <div className="space-y-3 font-serif">
              <label className="block text-[10px] uppercase font-bold tracking-wider text-black">
                Chọn mẫu Thời khóa biểu nhà trường đã số hóa từ tài liệu:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => handleLoadPreset("kienbinh")}
                  className="p-3.5 border border-black bg-white hover:bg-stone-100 text-left transition-all shadow-[2px_2px_0px_rgba(0,0,0,1)] cursor-pointer group"
                >
                  <div className="font-bold text-xs text-black group-hover:underline">
                    TH Tân Thạnh - PH Kiến Bình
                  </div>
                  <div className="text-[11px] text-stone-600 mt-1 font-serif">
                    Đầy đủ 19 lớp (1A1 - 5C), 31 Giáo viên, chuẩn TKB NH 2026-2027.
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleLoadPreset("quangtrung")}
                  className="p-3.5 border border-black bg-white hover:bg-stone-100 text-left transition-all shadow-[2px_2px_0px_rgba(0,0,0,1)] cursor-pointer group"
                >
                  <div className="font-bold text-xs text-black group-hover:underline">
                    Trường TH&THCS Quang Trung
                  </div>
                  <div className="text-[11px] text-stone-600 mt-1 font-serif">
                    Khung giáo dục tiểu học 2 buổi/ngày kèm các tiết tăng cường.
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleLoadPreset("chibi")}
                  className="p-3.5 border border-black bg-white hover:bg-stone-100 text-left transition-all shadow-[2px_2px_0px_rgba(0,0,0,1)] cursor-pointer group"
                >
                  <div className="font-bold text-xs text-black group-hover:underline">
                    Trường Tiểu học Chibi
                  </div>
                  <div className="text-[11px] text-stone-600 mt-1 font-serif">
                    Định mức 25 tiết chính khóa + 6 tiết tăng cường / bồi dưỡng.
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Status Message */}
          {parseStatus && (
            <div
              className={`p-3 text-xs flex items-center gap-2 border border-black ${
                isSuccess
                  ? "bg-stone-100 text-black shadow-[1px_1px_0px_rgba(0,0,0,1)]"
                  : "bg-stone-200 text-black shadow-[1px_1px_0px_rgba(0,0,0,1)]"
              }`}
            >
              {isSuccess ? (
                <CheckCircle2 className="w-4 h-4 text-black shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-black shrink-0" />
              )}
              <span className="font-serif">{parseStatus}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-stone-100 border-t-2 border-black flex items-center justify-between font-serif">
          <span className="text-[11px] text-stone-600">
            TKB thay đổi liên tục sẽ được lưu trữ cục bộ an toàn.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-bold uppercase tracking-wider bg-black text-white hover:bg-stone-800 border border-black transition-colors cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

