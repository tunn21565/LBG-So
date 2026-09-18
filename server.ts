import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Lazy initialization of Gemini client
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// API Health Check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// API Generate / Enrich Lesson Plan (KHBD) with AI & Competencies
app.post("/api/generate-khbd", async (req, res) => {
  try {
    const { grade, subject, lessonTitle, period, week, teacherName, schoolName, integrations, customPrompt } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(200).json({
        success: false,
        isFallback: true,
        message: "Chưa cấu hình GEMINI_API_KEY, hệ thống sẽ sử dụng mẫu chuẩn giáo án và tích hợp từ kho dữ liệu.",
      });
    }

    const ai = getAIClient();
    const prompt = `Bạn là chuyên gia sư phạm tiểu học Việt Nam. Hãy soạn Kế hoạch bài dạy (Giáo án) chi tiết theo chuẩn Công văn 2345/BGDĐT cho:
Khối lớp: Lớp ${grade}
Môn học: ${subject}
Tên bài dạy: ${lessonTitle}
Tiết PPCT / Tiết theo tuần: ${period || 1} (Tuần ${week || 1})
Giáo viên: ${teacherName || "Giáo viên"} - Trường: ${schoolName || "Trường Tiểu học"}

Yêu cầu tích hợp bắt buộc cần có:
${integrations?.ai ? `- Tích hợp Trí tuệ nhân tạo (AI) theo Khung Năng lực số Bộ GD&ĐT (vd: mã 1.A1.1, 1.A2.2, 2.A1.1, 4.A1.1...)` : ""}
${integrations?.digitalCompetence ? `- Tích hợp Năng lực số (NLS) theo Công văn 3456/BGDĐT-GDPT (Duyệt tìm kiếm 1.1, Đánh giá 1.2, Quản lý 1.3, Giao tiếp 2.1, An toàn 4.1/4.2...)` : ""}
${integrations?.humanRights ? `- Tích hợp Giáo dục Quyền con người (QCN) & Quyền trẻ em` : ""}
${integrations?.defense ? `- Tích hợp Giáo dục Quốc phòng và An ninh (GDQPAN theo TT 08/2024)` : ""}
${integrations?.nutrition ? `- Tích hợp Giáo dục Dinh dưỡng (GDDD) / Vệ sinh an toàn thực phẩm` : ""}
${integrations?.stem ? `- Tích hợp Giáo dục STEM / Học thông qua chơi` : ""}
${customPrompt ? `Ghi chú bổ sung của giáo viên: ${customPrompt}` : ""}

Hãy trả về định dạng JSON thuần túy theo cấu trúc:
{
  "subject": "${subject}",
  "lessonTitle": "${lessonTitle}",
  "period": "${period || 1}",
  "week": ${week || 1},
  "grade": ${grade},
  "objectives": {
    "specificCompetencies": ["..."],
    "generalCompetencies": ["Tự chủ và tự học: ...", "Giao tiếp và hợp tác: ...", "Giải quyết vấn đề và sáng tạo: ..."],
    "qualities": ["Yêu nước: ...", "Nhân ái: ...", "Chăm chỉ: ...", "Trung thực: ...", "Trách nhiệm: ..."],
    "integratedContents": ["Tích hợp AI: ...", "Tích hợp Năng lực số: ...", "Tích hợp Quyền con người: ...", "Tích hợp GDQPAN: ...", "Tích hợp Dinh dưỡng: ..."]
  },
  "materials": {
    "teacher": ["..."],
    "student": ["..."]
  },
  "activities": [
    {
      "name": "1. Khởi động",
      "objective": "...",
      "teacherActivity": "...",
      "studentActivity": "..."
    },
    {
      "name": "2. Khám phá",
      "objective": "...",
      "teacherActivity": "...",
      "studentActivity": "..."
    },
    {
      "name": "3. Luyện tập / Thực hành",
      "objective": "...",
      "teacherActivity": "...",
      "studentActivity": "..."
    },
    {
      "name": "4. Vận dụng",
      "objective": "...",
      "teacherActivity": "...",
      "studentActivity": "..."
    }
  ],
  "postLessonAdjustment": ""
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text || "{}";
    const parsed = JSON.parse(text);
    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error("Gemini KHBD Generation Error:", error);
    return res.status(500).json({ success: false, error: error.message || "Lỗi tạo bài giảng từ AI" });
  }
});

// Vite Middleware for development / static files for production
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Primary School Teaching Plan & Timetable Server running on port ${PORT}`);
  });
}

setupVite();
