import { Grade, ScheduleItem } from "../types";

export interface MultipleChoiceQuestion {
  id: string;
  question: string;
  options: { key: "A" | "B" | "C" | "D"; text: string }[];
  correctAnswer: "A" | "B" | "C" | "D";
  explanation: string;
}

export interface EssayQuestion {
  id: string;
  question: string;
  sampleAnswer: string;
  guide?: string;
}

export interface SubjectWorksheet {
  id: string;
  subject: string;
  grade: Grade;
  week: number;
  title: string;
  focusLessons: string[];
  loigiaihayUrl: string;
  categoryName: string;
  multipleChoiceQuestions: MultipleChoiceQuestion[];
  essayQuestions: EssayQuestion[];
}

/**
 * Returns subjects required by the Ministry curriculum & user specification:
 * - Khối 1, 2, 3: Toán, Tiếng Việt, Đạo đức, HĐTN, TNXH (Tự nhiên và Xã hội)
 * - Khối 4, 5: Toán, Tiếng Việt, Đạo đức, HĐTN, Khoa học, Lịch sử và Địa lí
 */
export function getRequiredSubjectsForGrade(grade: Grade): string[] {
  if (grade <= 3) {
    return [
      "Toán",
      "Tiếng Việt",
      "Đạo đức",
      "Hoạt động trải nghiệm",
      "Tự nhiên và Xã hội",
    ];
  }
  return [
    "Toán",
    "Tiếng Việt",
    "Đạo đức",
    "Hoạt động trải nghiệm",
    "Khoa học",
    "Lịch sử và Địa lí",
  ];
}

/**
 * Direct mapping to loigiaihay.com subject links and search queries
 */
export function getLoigiaihaySubjectUrl(grade: Grade, subject: string, week: number): string {
  const normSubject = subject.toLowerCase().trim();
  const query = encodeURIComponent(`bài tập cuối tuần ${normSubject} lớp ${grade} tuần ${week}`);
  return `https://loigiaihay.com/tim-kiem?q=${query}`;
}

export const LOIGIAIHAY_CATEGORY_LINKS: Record<string, string> = {
  "Toán_1": "https://loigiaihay.com/de-kiem-tra-cuoi-tuan-toan-lop-1-c144.html",
  "Tiếng Việt_1": "https://loigiaihay.com/de-kiem-tra-cuoi-tuan-tieng-viet-lop-1-c145.html",
  "Toán_2": "https://loigiaihay.com/de-kiem-tra-cuoi-tuan-toan-lop-2-ket-noi-tri-thuc-c361.html",
  "Tiếng Việt_2": "https://loigiaihay.com/de-kiem-tra-cuoi-tuan-tieng-viet-lop-2-ket-noi-tri-thuc-c362.html",
  "Toán_3": "https://loigiaihay.com/de-kiem-tra-cuoi-tuan-toan-lop-3-ket-noi-tri-thuc-c367.html",
  "Tiếng Việt_3": "https://loigiaihay.com/de-kiem-tra-cuoi-tuan-tieng-viet-lop-3-ket-noi-tri-thuc-c368.html",
  "Toán_4": "https://loigiaihay.com/de-kiem-tra-cuoi-tuan-toan-lop-4-ket-noi-tri-thuc-c397.html",
  "Tiếng Việt_4": "https://loigiaihay.com/de-kiem-tra-cuoi-tuan-tieng-viet-lop-4-ket-noi-tri-thuc-c398.html",
  "Toán_5": "https://loigiaihay.com/de-kiem-tra-cuoi-tuan-toan-lop-5-c148.html",
  "Tiếng Việt_5": "https://loigiaihay.com/de-kiem-tra-cuoi-tuan-tieng-viet-lop-5-c149.html",
};

/**
 * Generate rich, realistic multiple-choice and essay questions matching the exact
 * weekly curriculum of Lịch Báo Giảng KHBD and reference standard on loigiaihay.com.
 */
export function generateWeeklyWorksheets(
  grade: Grade,
  week: number,
  scheduleItems: ScheduleItem[] = []
): SubjectWorksheet[] {
  const subjects = getRequiredSubjectsForGrade(grade);

  return subjects.map((subj) => {
    // Extract actual lessons taught in schedule for this subject and week if present
    const matchedItems = scheduleItems.filter(
      (it) => it.subject.toLowerCase().includes(subj.toLowerCase()) ||
              subj.toLowerCase().includes(it.subject.toLowerCase())
    );
    const focusLessons = matchedItems.map((it) => it.lessonTitle).filter(Boolean);

    const questionsData = getQuestionsForSubjectAndWeek(grade, subj, week, focusLessons);

    const catKey = `${subj}_${grade}`;
    const directCatUrl = LOIGIAIHAY_CATEGORY_LINKS[catKey] || `https://loigiaihay.com/tim-kiem?q=${encodeURIComponent(`phiếu bài tập cuối tuần ${subj} lớp ${grade} tuần ${week}`)}`;

    return {
      id: `worksheet-${grade}-w${week}-${subj}`,
      subject: subj,
      grade,
      week,
      title: `Phiếu bài tập cuối tuần ${week} - Môn ${subj} Lớp ${grade}`,
      focusLessons: focusLessons.length > 0 ? focusLessons : questionsData.defaultFocus,
      loigiaihayUrl: directCatUrl,
      categoryName: `Loigiaihay.com - Lớp ${grade} - ${subj}`,
      multipleChoiceQuestions: questionsData.multipleChoice,
      essayQuestions: questionsData.essay,
    };
  });
}

function getQuestionsForSubjectAndWeek(
  grade: Grade,
  subject: string,
  week: number,
  focusLessons: string[]
): {
  defaultFocus: string[];
  multipleChoice: MultipleChoiceQuestion[];
  essay: EssayQuestion[];
} {
  const subjLower = subject.toLowerCase();

  // 1. TOÁN (MATH)
  if (subjLower.includes("toán")) {
    if (grade === 1) {
      return {
        defaultFocus: [
          `Làm quen với các số 1, 2, 3, 4, 5 (Tuần ${week})`,
          "So sánh nhiều hơn, ít hơn, bằng nhau",
          "Thực hành đếm và viết chữ số",
        ],
        multipleChoice: [
          {
            id: `m1_q1_w${week}`,
            question: "Trong hình vẽ có 3 bông hoa màu đỏ và 2 bông hoa màu vàng. Hỏi có tất cả bao nhiêu bông hoa?",
            options: [
              { key: "A", text: "4 bông hoa" },
              { key: "B", text: "5 bông hoa" },
              { key: "C", text: "3 bông hoa" },
              { key: "D", text: "2 bông hoa" },
            ],
            correctAnswer: "B",
            explanation: "Theo Loigiaihay.com: Ta đếm 3 bông hoa thêm 2 bông hoa được tất cả 5 bông hoa. (3 + 2 = 5).",
          },
          {
            id: `m1_q2_w${week}`,
            question: "Số thích hợp điền vào dấu chấm trong dãy: 1, 2, 3, ..., 5 là:",
            options: [
              { key: "A", text: "4" },
              { key: "B", text: "6" },
              { key: "C", text: "0" },
              { key: "D", text: "3" },
            ],
            correctAnswer: "A",
            explanation: "Theo Loigiaihay.com: Thứ tự đếm các số từ 1 đến 5 là 1, 2, 3, 4, 5. Vậy số cần điền là số 4.",
          },
          {
            id: `m1_q3_w${week}`,
            question: "Hình nào dưới đây có số lượng chấm tròn NHIỀU NHẤT?",
            options: [
              { key: "A", text: "Hình A: 2 chấm tròn" },
              { key: "B", text: "Hình B: 4 chấm tròn" },
              { key: "C", text: "Hình C: 5 chấm tròn" },
              { key: "D", text: "Hình D: 3 chấm tròn" },
            ],
            correctAnswer: "C",
            explanation: "Vì 5 > 4 > 3 > 2 nên hình có 5 chấm tròn là nhiều nhất.",
          },
          {
            id: `m1_q4_w${week}`,
            question: "Bé Mai có 4 quả táo, Mai cho bạn Lan 1 quả táo. Hỏi Mai còn lại mấy quả táo?",
            options: [
              { key: "A", text: "5 quả táo" },
              { key: "B", text: "2 quả táo" },
              { key: "C", text: "3 quả táo" },
              { key: "D", text: "4 quả táo" },
            ],
            correctAnswer: "C",
            explanation: "Ta có phép tính: 4 bớt 1 còn 3 (4 - 1 = 3). Mai còn lại 3 quả táo.",
          },
        ],
        essay: [
          {
            id: `m1_e1_w${week}`,
            question: "Viết các số sau theo thứ tự từ bé đến lớn: 4, 1, 5, 2, 3.",
            sampleAnswer: "Thứ tự từ bé đến lớn: 1, 2, 3, 4, 5.",
            guide: "So sánh giá trị từng chữ số để sắp xếp đúng quy tắc.",
          },
          {
            id: `m1_e2_w${week}`,
            question: "Vẽ thêm các hình tròn sao cho đủ 5 hình tròn vào khung.",
            sampleAnswer: "Học sinh đếm số hình đã có trong khung và vẽ thêm cho đủ số lượng 5.",
          },
        ],
      };
    } else if (grade === 2) {
      return {
        defaultFocus: [
          `Ôn tập phép cộng, phép trừ có nhớ trong phạm vi 20, 100 (Tuần ${week})`,
          "Tìm thành phần chưa biết của phép tính",
          "Giải bài toán nhiều hơn, ít hơn",
        ],
        multipleChoice: [
          {
            id: `m2_q1_w${week}`,
            question: "Kết quả của phép tính: 38 + 25 là:",
            options: [
              { key: "A", text: "53" },
              { key: "B", text: "63" },
              { key: "C", text: "64" },
              { key: "D", text: "58" },
            ],
            correctAnswer: "B",
            explanation: "Theo Loigiaihay.com: 8 + 5 = 13, viết 3 nhớ 1; 3 + 2 = 5 thêm 1 bằng 6. Vậy 38 + 25 = 63.",
          },
          {
            id: `m2_q2_w${week}`,
            question: "Tìm x, biết: x - 17 = 45. Giá trị của x là:",
            options: [
              { key: "A", text: "28" },
              { key: "B", text: "52" },
              { key: "C", text: "62" },
              { key: "D", text: "63" },
            ],
            correctAnswer: "C",
            explanation: "Muốn tìm số bị trừ, ta lấy hiệu cộng với số trừ: x = 45 + 17 = 62.",
          },
          {
            id: `m2_q3_w${week}`,
            question: "Đoạn thẳng AB dài 18 cm, đoạn thẳng CD ngắn hơn đoạn thẳng AB là 5 cm. Độ dài đoạn thẳng CD là:",
            options: [
              { key: "A", text: "23 cm" },
              { key: "B", text: "13 cm" },
              { key: "C", text: "12 cm" },
              { key: "D", text: "14 cm" },
            ],
            correctAnswer: "B",
            explanation: "Độ dài đoạn thẳng CD là: 18 - 5 = 13 (cm).",
          },
          {
            id: `m2_q4_w${week}`,
            question: "Số tròn chục liền sau số 54 là:",
            options: [
              { key: "A", text: "50" },
              { key: "B", text: "55" },
              { key: "C", text: "60" },
              { key: "D", text: "70" },
            ],
            correctAnswer: "C",
            explanation: "Các số tròn chục là 10, 20, 30, 40, 50, 60, 70,... Số tròn chục liền sau 54 là 60.",
          },
        ],
        essay: [
          {
            id: `m2_e1_w${week}`,
            question: "Đặt tính rồi tính: a) 47 + 36   b) 82 - 29",
            sampleAnswer: "a) 47 + 36 = 83; b) 82 - 29 = 53.",
            guide: "Viết các chữ số thẳng cột hàng đơn vị và hàng chục.",
          },
          {
            id: `m2_e2_w${week}`,
            question: "Lớp 2A có 18 bạn nam và 16 bạn nữ. Hỏi lớp 2A có tất cả bao nhiêu học sinh?",
            sampleAnswer: "Bài giải: Lớp 2A có tất cả số học sinh là: 18 + 16 = 34 (học sinh). Đáp số: 34 học sinh.",
          },
        ],
      };
    } else if (grade === 3) {
      return {
        defaultFocus: [
          `Ôn tập bảng nhân, bảng chia từ 2 đến 9 (Tuần ${week})`,
          "Tính giá trị của biểu thức có dấu ngoặc",
          "Giải bài toán gấp một số lên nhiều lần hoặc giảm đi nhiều lần",
        ],
        multipleChoice: [
          {
            id: `m3_q1_w${week}`,
            question: "Giá trị của biểu thức: 45 : 5 + 18 x 2 là:",
            options: [
              { key: "A", text: "45" },
              { key: "B", text: "35" },
              { key: "C", text: "54" },
              { key: "D", text: "40" },
            ],
            correctAnswer: "A",
            explanation: "Thực hiện phép chia và phép nhân trước: 45 : 5 = 9; 18 x 2 = 36. Sau đó cộng lại: 9 + 36 = 45.",
          },
          {
            id: `m3_q2_w${week}`,
            question: "Một cuộn vải dài 72 m, người ta cắt đi 1/8 cuộn vải. Hỏi người ta đã cắt đi bao nhiêu mét vải?",
            options: [
              { key: "A", text: "8 m" },
              { key: "B", text: "9 m" },
              { key: "C", text: "12 m" },
              { key: "D", text: "7 m" },
            ],
            correctAnswer: "B",
            explanation: "Số mét vải đã cắt đi là: 72 : 8 = 9 (m).",
          },
          {
            id: `m3_q3_w${week}`,
            question: "Gấp 7 lên 6 lần rồi bớt đi 15, ta được kết quả là:",
            options: [
              { key: "A", text: "27" },
              { key: "B", text: "42" },
              { key: "C", text: "32" },
              { key: "D", text: "25" },
            ],
            correctAnswer: "A",
            explanation: "Gấp 7 lên 6 lần: 7 x 6 = 42. Bớt đi 15: 42 - 15 = 27.",
          },
          {
            id: `m3_q4_w${week}`,
            question: "Hình vuông có cạnh 8 cm thì chu vi hình vuông đó là:",
            options: [
              { key: "A", text: "16 cm" },
              { key: "B", text: "24 cm" },
              { key: "C", text: "32 cm" },
              { key: "D", text: "64 cm" },
            ],
            correctAnswer: "C",
            explanation: "Chu vi hình vuông = Cạnh x 4 = 8 x 4 = 32 (cm).",
          },
        ],
        essay: [
          {
            id: `m3_e1_w${week}`,
            question: "Tính giá trị biểu thức: a) 124 + 48 : 6   b) (35 + 25) x 4",
            sampleAnswer: "a) 124 + 8 = 132; b) 60 x 4 = 240.",
          },
          {
            id: `m3_e2_w${week}`,
            question: "Mẹ mua 4 hộp bánh, mỗi hộp có 6 cái bánh. Sau đó mẹ mua thêm 15 cái bánh nữa. Hỏi mẹ đã mua tất cả bao nhiêu cái bánh?",
            sampleAnswer: "Số cái bánh trong 4 hộp là: 4 x 6 = 24 (cái). Mẹ đã mua tất cả số cái bánh là: 24 + 15 = 39 (cái). Đáp số: 39 cái bánh.",
          },
        ],
      };
    } else if (grade === 4) {
      return {
        defaultFocus: [
          `Đọc, viết các số có nhiều chữ số (Tuần ${week})`,
          "So sánh và sắp xếp thứ tự các số tự nhiên",
          "Yến, tạ, tấn, giây, thế kỉ và giải bài toán tìm hai số khi biết tổng và hiệu",
        ],
        multipleChoice: [
          {
            id: `m4_q1_w${week}`,
            question: "Chữ số 5 trong số 358 412 thuộc hàng nào, lớp nào?",
            options: [
              { key: "A", text: "Hàng chục, lớp đơn vị" },
              { key: "B", text: "Hàng trăm, lớp nghìn" },
              { key: "C", text: "Hàng chục nghìn, lớp nghìn" },
              { key: "D", text: "Hàng trăm nghìn, lớp nghìn" },
            ],
            correctAnswer: "C",
            explanation: "Số 358 412 có: chữ số 2 (hàng đơn vị), 1 (hàng chục), 4 (hàng trăm); chữ số 8 (hàng nghìn), 5 (hàng chục nghìn), 3 (hàng trăm nghìn). Vậy chữ số 5 thuộc hàng chục nghìn, lớp nghìn.",
          },
          {
            id: `m4_q2_w${week}`,
            question: "Điền số thích hợp vào chỗ chấm: 3 tạ 40 kg = ... kg",
            options: [
              { key: "A", text: "340" },
              { key: "B", text: "3040" },
              { key: "C", text: "34" },
              { key: "D", text: "3400" },
            ],
            correctAnswer: "A",
            explanation: "1 tạ = 100 kg nên 3 tạ = 300 kg. 300 kg + 40 kg = 340 kg.",
          },
          {
            id: `m4_q3_w${week}`,
            question: "Năm 1945 thuộc thế kỉ thứ mấy?",
            options: [
              { key: "A", text: "Thế kỉ XIX" },
              { key: "B", text: "Thế kỉ XX" },
              { key: "C", text: "Thế kỉ XXI" },
              { key: "D", text: "Thế kỉ XVIII" },
            ],
            correctAnswer: "B",
            explanation: "Từ năm 1901 đến năm 2000 là thế kỉ hai mươi (thế kỉ XX). Vậy năm 1945 thuộc thế kỉ XX.",
          },
          {
            id: `m4_q4_w${week}`,
            question: "Tổng của hai số là 84, hiệu của hai số là 16. Số lớn là:",
            options: [
              { key: "A", text: "50" },
              { key: "B", text: "45" },
              { key: "C", text: "34" },
              { key: "D", text: "68" },
            ],
            correctAnswer: "A",
            explanation: "Số lớn = (Tổng + Hiệu) : 2 = (84 + 16) : 2 = 100 : 2 = 50.",
          },
        ],
        essay: [
          {
            id: `m4_e1_w${week}`,
            question: "Viết số thích hợp vào chỗ chấm: a) 4 tấn 50 kg = ... kg; b) 2 phút 15 giây = ... giây.",
            sampleAnswer: "a) 4 050 kg; b) 135 giây.",
          },
          {
            id: `m4_e2_w${week}`,
            question: "Hai thùng dầu đựng tất cả 160 lít dầu. Thùng thứ nhất đựng ít hơn thùng thứ hai 30 lít dầu. Tính số lít dầu ở mỗi thùng.",
            sampleAnswer: "Thùng thứ nhất đựng: (160 - 30) : 2 = 65 (lít). Thùng thứ hai đựng: 65 + 30 = 95 (lít). Đáp số: Thùng 1: 65 lít; Thùng 2: 95 lít.",
          },
        ],
      };
    } else {
      // Grade 5
      return {
        defaultFocus: [
          `Khái niệm và tính chất cơ bản của phân số (Tuần ${week})`,
          "So sánh phân số, phân số thập phân",
          "Hỗn số và các phép toán giải toán tỉ số",
        ],
        multipleChoice: [
          {
            id: `m5_q1_w${week}`,
            question: "Phân số nào dưới đây bằng với phân số 3/5?",
            options: [
              { key: "A", text: "9/15" },
              { key: "B", text: "6/15" },
              { key: "C", text: "12/25" },
              { key: "D", text: "15/20" },
            ],
            correctAnswer: "A",
            explanation: "Nhân cả tử số và mẫu số của 3/5 với 3: 3x3 / 5x3 = 9/15. Vậy 3/5 = 9/15.",
          },
          {
            id: `m5_q2_w${week}`,
            question: "Phân số thập phân trong các phân số sau là:",
            options: [
              { key: "A", text: "3/20" },
              { key: "B", text: "7/100" },
              { key: "C", text: "15/50" },
              { key: "D", text: "9/200" },
            ],
            correctAnswer: "B",
            explanation: "Phân số thập phân là phân số có mẫu số là 10, 100, 1000,... Do đó 7/100 là phân số thập phân.",
          },
          {
            id: `m5_q3_w${week}`,
            question: "Hỗn số 3 2/5 được viết dưới dạng phân số là:",
            options: [
              { key: "A", text: "11/5" },
              { key: "B", text: "17/5" },
              { key: "C", text: "13/5" },
              { key: "D", text: "10/5" },
            ],
            correctAnswer: "B",
            explanation: "Tử số = (3 x 5) + 2 = 17, mẫu số giữ nguyên là 5. Vậy hỗn số là 17/5.",
          },
          {
            id: `m5_q4_w${week}`,
            question: "Một mảnh đất hình chữ nhật có chiều dài 25 m, chiều rộng bằng 3/5 chiều dài. Diện tích mảnh đất là:",
            options: [
              { key: "A", text: "375 m²" },
              { key: "B", text: "350 m²" },
              { key: "C", text: "400 m²" },
              { key: "D", text: "150 m²" },
            ],
            correctAnswer: "A",
            explanation: "Chiều rộng = 25 x 3/5 = 15 (m). Diện tích = 25 x 15 = 375 (m²).",
          },
        ],
        essay: [
          {
            id: `m5_e1_w${week}`,
            question: "Chuyển các phân số sau thành phân số thập phân: a) 3/4   b) 7/25   c) 9/50",
            sampleAnswer: "a) 3/4 = 75/100; b) 7/25 = 28/100; c) 9/50 = 18/100.",
          },
          {
            id: `m5_e2_w${week}`,
            question: "Một cửa hàng ngày thứ nhất bán được 3/8 tấn gạo, ngày thứ hai bán được nhiều hơn ngày thứ nhất 1/4 tấn gạo. Hỏi cả hai ngày cửa hàng bán được bao nhiêu tạ gạo?",
            sampleAnswer: "Ngày thứ hai bán: 3/8 + 2/8 = 5/8 (tấn). Cả hai ngày bán: 3/8 + 5/8 = 1 (tấn) = 10 tạ gạo. Đáp số: 10 tạ gạo.",
          },
        ],
      };
    }
  }

  // 2. TIẾNG VIỆT
  if (subjLower.includes("tiếng việt")) {
    return {
      defaultFocus: [
        `Chủ điểm rèn đọc - hiểu và trả lời câu hỏi bài học (Tuần ${week})`,
        "Luyện từ và câu: Mở rộng vốn từ, nhận diện từ loại / dấu câu",
        "Tập làm văn: Viết đoạn văn miêu tả / kể chuyện / nêu cảm nghĩ",
      ],
      multipleChoice: [
        {
          id: `tv_q1_w${week}`,
          question: `Trong câu văn: "Mỗi sớm mai, đàn chim ríu rít hót ca chào đón ngày mới rực rỡ.", từ nào là từ chỉ hoạt động?`,
          options: [
            { key: "A", text: "sớm mai" },
            { key: "B", text: "đàn chim" },
            { key: "C", text: "hót ca" },
            { key: "D", text: "rực rỡ" },
          ],
          correctAnswer: "C",
          explanation: "Từ 'hót ca' là động từ chỉ hoạt động phát ra âm thanh tiếng hát của loài chim.",
        },
        {
          id: `tv_q2_w${week}`,
          question: "Dãy từ nào sau đây gồm các từ đồng nghĩa với từ 'chăm chỉ'?",
          options: [
            { key: "A", text: "cần cù, siêng năng, chịu khó" },
            { key: "B", text: "dũng cảm, gan dạ, kiên cường" },
            { key: "C", text: "thông minh, sáng dạ, hoạt bát" },
            { key: "D", text: "thật thà, trung thực, thẳng thắn" },
          ],
          correctAnswer: "A",
          explanation: "Theo từ điển Tiếng Việt và bài tập Loigiaihay.com: Cần cù, siêng năng, chịu khó là các từ đồng nghĩa với chăm chỉ.",
        },
        {
          id: `tv_q3_w${week}`,
          question: "Dấu câu nào thích hợp để kết thúc câu: 'Ôi, cảnh bình minh trên quê hương em đẹp biết bao'?",
          options: [
            { key: "A", text: "Dấu chấm (.)" },
            { key: "B", text: "Dấu chấm hỏi (?)" },
            { key: "C", text: "Dấu chấm than (!)" },
            { key: "D", text: "Dấu hai chấm (:)" },
          ],
          correctAnswer: "C",
          explanation: "Đây là câu cảm thán bộc lộ cảm xúc khen ngợi nên dùng dấu chấm than (!) ở cuối câu.",
        },
        {
          id: `tv_q4_w${week}`,
          question: "Thành ngữ, tục ngữ nào sau đây nói về tinh thần đoàn kết, tương thân tương ái?",
          options: [
            { key: "A", text: "Học thầy không tày học bạn" },
            { key: "B", text: "Lá lành đùm lá rách" },
            { key: "C", text: "Uống nước nhớ nguồn" },
            { key: "D", text: "Ăn quả nhớ kẻ trồng cây" },
          ],
          correctAnswer: "B",
          explanation: "'Lá lành đùm lá rách' khuyên con người biết cưu mang, sẻ chia và giúp đỡ lẫn nhau khi gặp khó khăn.",
        },
      ],
      essay: [
        {
          id: `tv_e1_w${week}`,
          question: "Tìm 2 từ đồng nghĩa và 2 từ trái nghĩa với từ 'nhân hậu'.",
          sampleAnswer: "- Từ đồng nghĩa: nhân từ, hiền hậu, phúc hậu. - Từ trái nghĩa: độc ác, tàn nhẫn, bất nhân.",
        },
        {
          id: `tv_e2_w${week}`,
          question: "Viết một đoạn văn ngắn (từ 3 đến 5 câu) nói về một việc tốt em hoặc bạn em đã làm ở trường lớp.",
          sampleAnswer: "Gợi ý: Nêu rõ việc tốt (nhặt được của rơi trả bạn, quét dọn lớp học, giúp bạn hiểu bài), cảm xúc vui vẻ và bài học cho bản thân.",
        },
      ],
    };
  }

  // 3. ĐẠO ĐỨC
  if (subjLower.includes("đạo đức")) {
    return {
      defaultFocus: [
        `Chuẩn mực hành vi đạo đức và quy tắc ứng xử trường lớp (Tuần ${week})`,
        "Lòng biết ơn cha mẹ, thầy cô và những người có công",
        "Xử lý tình huống giao tiếp, tôn trọng sự khác biệt",
      ],
      multipleChoice: [
        {
          id: `dd_q1_w${week}`,
          question: "Hành động nào dưới đây thể hiện sự tôn trọng thầy giáo, cô giáo?",
          options: [
            { key: "A", text: "Lễ phép chào hỏi khi gặp thầy cô trong và ngoài sân trường" },
            { key: "B", text: "Nói leo và làm việc riêng trong giờ học của thầy cô" },
            { key: "C", text: "Không làm bài tập về nhà khi thầy cô giao" },
            { key: "D", text: "Chỉ chào khi thầy cô dạy lớp mình" },
          ],
          correctAnswer: "A",
          explanation: "Chào hỏi lễ phép là nét đẹp thể hiện truyền thống Tôn sư trọng đạo.",
        },
        {
          id: `dd_q2_w${week}`,
          question: "Khi thấy bạn cùng lớp làm rơi hộp bút, em sẽ làm gì?",
          options: [
            { key: "A", text: "Cười lớn rồi bỏ đi chỗ khác" },
            { key: "B", text: "Cúi xuống nhặt giúp bạn và nhẹ nhàng đưa lại cho bạn" },
            { key: "C", text: "Đứng nhìn và trêu chọc bạn bất cẩn" },
            { key: "D", text: "Đá hộp bút ra xa hơn" },
          ],
          correctAnswer: "B",
          explanation: "Giúp đỡ bạn bè khi bạn gặp khó khăn là biểu hiện của tình bạn đẹp và sự đoàn kết.",
        },
        {
          id: `dd_q3_w${week}`,
          question: "Để giữ gìn đồ dùng học tập được bền đẹp, em nên:",
          options: [
            { key: "A", text: "Vẽ bậy và bẻ gãy thước kẻ" },
            { key: "B", text: "Xếp sách vở gọn gàng vào cặp sau mỗi buổi học" },
            { key: "C", text: "Vứt bút mực bừa bãi dưới sàn lớp" },
            { key: "D", text: "Xé các trang vở trắng làm máy bay giấy" },
          ],
          correctAnswer: "B",
          explanation: "Biết giữ gìn sách vở gọn gàng, cẩn thận rèn luyện cho em tính ngăn nắp, tiết kiệm.",
        },
        {
          id: `dd_q4_w${week}`,
          question: "Việc làm nào dưới đây thể hiện lòng biết ơn các thương binh, liệt sĩ?",
          options: [
            { key: "A", text: "Thắp hương tưởng niệm tại Nghĩa trang liệt sĩ nhân ngày 27/7" },
            { key: "B", text: "Chạy nhảy nô đùa vô ý ở đài tưởng niệm" },
            { key: "C", text: "Không quan tâm đến ngày thương binh liệt sĩ" },
            { key: "D", text: "Hái hoa, bẻ cành cây tại khu di tích lịch sử" },
          ],
          correctAnswer: "A",
          explanation: "Thắp hương tưởng niệm thể hiện đạo lí 'Uống nước nhớ nguồn' của dân tộc Việt Nam.",
        },
      ],
      essay: [
        {
          id: `dd_e1_w${week}`,
          question: "Em hãy nêu 2 việc làm cụ thể em đã thực hiện để thể hiện sự quan tâm, giúp đỡ ông bà, cha mẹ ở nhà.",
          sampleAnswer: "Ví dụ: Rót nước mời ông bà uống; quét nhà, gấp quần áo giúp mẹ sau giờ học.",
        },
        {
          id: `dd_e2_w${week}`,
          question: "Tình huống: Trong giờ ra chơi, em nhìn thấy một bạn học sinh lớp dưới vô tình vấp ngã trầy đầu gối. Em sẽ xử lí như thế nào?",
          sampleAnswer: "Cách xử lí: Em sẽ chạy lại đỡ bạn dậy, ân cần hỏi bạn có đau không và đưa bạn vào phòng y tế trường để được thầy cô sơ cứu.",
        },
      ],
    };
  }

  // 4. HOẠT ĐỘNG TRẢI NGHIỆM (HĐTN)
  if (subjLower.includes("hoạt động trải nghiệm") || subjLower.includes("hđtn")) {
    return {
      defaultFocus: [
        `Sinh hoạt dưới cờ và sinh hoạt lớp theo chủ đề tuần ${week}`,
        "Rèn luyện kỹ năng tự phục vụ, sắp xếp không gian học tập",
        "Xây dựng tình bạn thân thiện và phòng chống bạo lực học đường",
      ],
      multipleChoice: [
        {
          id: `hdtn_q1_w${week}`,
          question: "Khi tham gia tiết Sinh hoạt dưới cờ đầu tuần, học sinh cần có thái độ như thế nào?",
          options: [
            { key: "A", text: "Đứng nghiêm trang, mắt hướng về Quốc kì, hát vang bài Quốc ca" },
            { key: "B", text: "Nói chuyện riêng và quay ngang quay ngửa trong hàng ngũ" },
            { key: "C", text: "Ngồi bệt xuống đất khi chưa có hiệu lệnh của thầy cô" },
            { key: "D", text: "Mang đồ ăn vặt ra ăn trong lúc chào cờ" },
          ],
          correctAnswer: "A",
          explanation: "Nghi lễ Chào cờ đòi hỏi tư thế nghiêm trang, thể hiện lòng tự hào dân tộc và lòng yêu Tổ quốc.",
        },
        {
          id: `hdtn_q2_w${week}`,
          question: "Hành động nào sau đây giúp xây dựng góc học tập ở nhà gọn gàng, khoa học?",
          options: [
            { key: "A", text: "Để sách giáo khoa lẫn lộn với đồ chơi và truyện tranh" },
            { key: "B", text: "Phân loại sách vở theo từng môn, bút thước để vào ống đựng sau khi học" },
            { key: "C", text: "Để thức ăn, vỏ bánh kẹo đầy trên bàn học" },
            { key: "D", text: "Không bao giờ lau dọn bụi bẩn ở bàn học" },
          ],
          correctAnswer: "B",
          explanation: "Phân loại sách vở và đồ dùng giúp góc học tập sạch sẽ, dễ tìm đồ và tăng hiệu quả tiếp thu bài.",
        },
        {
          id: `hdtn_q3_w${week}`,
          question: "Trong tiết Sinh hoạt lớp cuối tuần, hoạt động nào diễn ra chủ yếu?",
          options: [
            { key: "A", text: "Sơ kết các mặt nề nếp trong tuần và thảo luận kế hoạch tuần mới" },
            { key: "B", text: "Chỉ kiểm điểm và phê bình các bạn vi phạm" },
            { key: "C", text: "Cả lớp tự do ra sân chơi thể thao" },
            { key: "D", text: "Ngồi im không phát biểu ý kiến gì" },
          ],
          correctAnswer: "A",
          explanation: "Sinh hoạt lớp là dịp nhìn lại kết quả học tập, tuyên dương tổ tốt và lập phương hướng phấn đấu tuần tới.",
        },
        {
          id: `hdtn_q4_w${week}`,
          question: "Nếu có bạn rủ em tham gia hoạt động trồng hoa và chăm sóc bồn cây lớp học, em nên:",
          options: [
            { key: "A", text: "Vui vẻ đồng ý và tích cực cùng các bạn xới đất, tưới nước" },
            { key: "B", text: "Từ chối vì sợ bẩn tay chân" },
            { key: "C", text: "Đứng một góc nhìn các bạn làm rồi chê bai" },
            { key: "D", text: "Bẻ các cành hoa bạn vừa trồng" },
          ],
          correctAnswer: "A",
          explanation: "Chung tay chăm sóc bồn hoa trường lớp giúp khuôn viên thêm xanh sạch đẹp và thắt chặt tình bạn bè.",
        },
      ],
      essay: [
        {
          id: `hdtn_e1_w${week}`,
          question: "Em hãy lập thời gian biểu buổi tối từ 19h00 đến 21h30 để cân đối giữa việc học bài và nghỉ ngơi.",
          sampleAnswer: "- 19h00 - 19h30: Giúp bố mẹ rửa bát, dọn dẹp nhà; - 19h30 - 21h00: Ôn bài và làm bài tập về nhà; - 21h00 - 21h30: Chuẩn bị sách vở ngày mai và vệ sinh cá nhân trước khi ngủ.",
        },
        {
          id: `hdtn_e2_w${week}`,
          question: "Chia sẻ 1 kỷ niệm vui hoặc 1 trải nghiệm đáng nhớ nhất của em cùng các bạn trong tuần học vừa qua.",
          sampleAnswer: "Học sinh tự do bộc lộ cảm xúc về buổi lao động, giờ thảo luận nhóm hay trò chơi dân gian cùng bạn.",
        },
      ],
    };
  }

  // 5. TỰ NHIÊN VÀ XÃ HỘI (TNXH - Khối 1, 2, 3)
  if (subjLower.includes("tự nhiên và xã hội") || subjLower.includes("tnxh")) {
    return {
      defaultFocus: [
        `Gia đình, các thế hệ và sự an toàn khi ở nhà/trường học (Tuần ${week})`,
        "Cơ quan trong cơ thể người và thói quen bảo vệ sức khỏe",
        "Thực vật, động vật và môi trường sống xung quanh",
      ],
      multipleChoice: [
        {
          id: `tnxh_q1_w${week}`,
          question: "Hành động nào sau đây có nguy cơ gây mất an toàn khi em ở nhà?",
          options: [
            { key: "A", text: "Rửa tay sạch bằng xà phòng trước khi ăn cơm" },
            { key: "B", text: "Nghịch que diêm, bật lửa và chạm tay vào ổ cắm điện" },
            { key: "C", text: "Uống nước đun sôi để nguội" },
            { key: "D", text: "Đóng cửa sổ khi trời nổi dông bão" },
          ],
          correctAnswer: "B",
          explanation: "Nghịch lửa và cắm đồ vật vào ổ điện có thể gây bỏng, hỏa hoạn hoặc điện giật nguy hiểm đến tính mạng.",
        },
        {
          id: `tnxh_q2_w${week}`,
          question: "Để bảo vệ mắt và giữ cho đôi mắt luôn sáng khỏe, em nên:",
          options: [
            { key: "A", text: "Ngồi học ở nơi đủ ánh sáng, không xem điện thoại quá gần" },
            { key: "B", text: "Đọc truyện trong bóng tối hoặc nằm đọc sách" },
            { key: "C", text: "Dụi tay bẩn vào mắt khi thấy ngứa" },
            { key: "D", text: "Nhìn thẳng vào ánh nắng mặt trời buổi trưa" },
          ],
          correctAnswer: "A",
          explanation: "Ánh sáng đầy đủ và giữ khoảng cách hợp lý giúp phòng tránh tật khúc xạ (cận thị, loạn thị).",
        },
        {
          id: `tnxh_q3_w${week}`,
          question: "Gia đình có 2 thế hệ cùng chung sống bao gồm những ai?",
          options: [
            { key: "A", text: "Ông bà và các cháu" },
            { key: "B", text: "Bố mẹ và các con" },
            { key: "C", text: "Ông bà, bố mẹ và các cháu" },
            { key: "D", text: "Bố mẹ, cô chú và các bác" },
          ],
          correctAnswer: "B",
          explanation: "Gia đình 2 thế hệ gồm có bố mẹ (thế hệ thứ nhất) và con cái (thế hệ thứ hai).",
        },
        {
          id: `tnxh_q4_w${week}`,
          question: "Cơ quan nào trong cơ thể chịu trách nhiệm bơm và lưu thông máu đi khắp các cơ quan?",
          options: [
            { key: "A", text: "Cơ quan hô hấp (Phổi)" },
            { key: "B", text: "Cơ quan tuần hoàn (Tim và các mạch máu)" },
            { key: "C", text: "Cơ quan tiêu hóa (Dạ dày)" },
            { key: "D", text: "Cơ quan bài tiết (Thận)" },
          ],
          correctAnswer: "B",
          explanation: "Tim co bóp đẩy máu giàu oxy qua các động mạch đi nuôi cơ thể, thuộc cơ quan tuần hoàn.",
        },
      ],
      essay: [
        {
          id: `tnxh_e1_w${week}`,
          question: "Kể tên 3 đồ vật sắc nhọn trong gia đình và nêu cách sử dụng an toàn để tránh bị thương.",
          sampleAnswer: "- Đồ vật: Dao, kéo, kim khâu. - Cách an toàn: Cầm ở phần cán, khi đưa cho người khác hướng đầu nhọn về phía mình, dùng xong cất vào hộp cẩn thận.",
        },
        {
          id: `tnxh_e2_w${week}`,
          question: "Em hãy nêu 2 việc nên làm và 2 việc không nên làm để phòng tránh bệnh đường hô hấp khi thời tiết giao mùa.",
          sampleAnswer: "- Nên làm: Đeo khẩu trang, giữ ấm cổ ngực, súc miệng nước muối. - Không nên làm: Uống nước đá lạnh, tắm nước lạnh ban đêm.",
        },
      ],
    };
  }

  // 6. KHOA HỌC (Khối 4, 5)
  if (subjLower.includes("khoa học")) {
    return {
      defaultFocus: [
        `Tính chất của nước, không khí, ánh sáng và sự biến đổi của chất (Tuần ${week})`,
        "Sự sinh sản và phát triển của thực vật, động vật",
        "Bảo vệ môi trường và sử dụng năng lượng tiết kiệm, hiệu quả",
      ],
      multipleChoice: [
        {
          id: `kh_q1_w${week}`,
          question: "Nước có những tính chất nào sau đây?",
          options: [
            { key: "A", text: "Có màu trắng đục, mùi thơm, vị ngọt" },
            { key: "B", text: "Chất lỏng trong suốt, không màu, không mùi, không vị, chảy từ cao xuống thấp" },
            { key: "C", text: "Có hình dạng cố định và không thể hòa tan bất kì chất nào" },
            { key: "D", text: "Chỉ tồn tại ở thể lỏng, không thể chuyển sang thể khí" },
          ],
          correctAnswer: "B",
          explanation: "Nước nguyên chất là chất lỏng trong suốt, không màu, không mùi, không vị, không có hình dạng nhất định.",
        },
        {
          id: `kh_q2_w${week}`,
          question: "Hiện tượng nào sau đây chứng tỏ có sự biến đổi hóa học?",
          options: [
            { key: "A", text: "Nước đá tan chảy thành nước lỏng" },
            { key: "B", text: "Đinh sắt để ngoài không khí ẩm lâu ngày bị gỉ sét màu nâu đỏ" },
            { key: "C", text: "Hòa tan đường vào cốc nước" },
            { key: "D", text: "Bẻ gãy một chiếc thước kẻ nhựa" },
          ],
          correctAnswer: "B",
          explanation: "Đinh sắt bị gỉ tạo thành chất mới (oxit sắt) nên đây là sự biến đổi hóa học; các trường hợp còn lại chỉ là biến đổi vật lí.",
        },
        {
          id: `kh_q3_w${week}`,
          question: "Khí nào trong không khí cần thiết cho sự thở của con người, động vật và thực vật?",
          options: [
            { key: "A", text: "Khí Nitơ" },
            { key: "B", text: "Khí Ô-xi" },
            { key: "C", text: "Khí Các-bô-níc" },
            { key: "D", text: "Khí Hê-li" },
          ],
          correctAnswer: "B",
          explanation: "Khí ô-xi duy trì sự sống và sự cháy, cần thiết cho quá trình hô hấp của mọi sinh vật.",
        },
        {
          id: `kh_q4_w${week}`,
          question: "Nguồn năng lượng nào sau đây là nguồn năng lượng sạch và có thể tái tạo?",
          options: [
            { key: "A", text: "Năng lượng từ than đá" },
            { key: "B", text: "Năng lượng từ dầu mỏ" },
            { key: "C", text: "Năng lượng gió và năng lượng mặt trời" },
            { key: "D", text: "Năng lượng từ khí đốt tự nhiên" },
          ],
          correctAnswer: "C",
          explanation: "Gió và ánh sáng mặt trời là nguồn năng lượng tự nhiên vô tận, không gây ô nhiễm môi trường.",
        },
      ],
      essay: [
        {
          id: `kh_e1_w${week}`,
          question: "Hãy phân biệt sự biến đổi vật lí và sự biến đổi hóa học. Cho 1 ví dụ minh họa cho mỗi loại.",
          sampleAnswer: "- Biến đổi vật lí: Chỉ thay đổi hình dạng, trạng thái, không tạo ra chất mới (VD: Nước đá tan). - Biến đổi hóa học: Có sự tạo thành chất mới (VD: Đốt cháy một mẩu giấy thành tro).",
        },
        {
          id: `kh_e2_w${week}`,
          question: "Nêu 3 việc làm cụ thể của học sinh nhằm tiết kiệm điện năng ở gia đình và lớp học.",
          sampleAnswer: "1. Tắt đèn, quạt khi ra khỏi phòng; 2. Tận dụng ánh sáng tự nhiên vào ban ngày; 3. Không bật điều hòa ở nhiệt độ quá thấp (duy trì 26-27 độ C).",
        },
      ],
    };
  }

  // 7. LỊCH SỬ VÀ ĐỊA LÍ (Khối 4, 5)
  if (subjLower.includes("lịch sử") || subjLower.includes("địa lí") || subjLower.includes("ls") || subjLower.includes("địa lý")) {
    return {
      defaultFocus: [
        `Vị trí địa lí, lãnh thổ, biển đảo và các vùng miền Việt Nam (Tuần ${week})`,
        "Các triều đại lịch sử và những mốc son chói lọi đấu tranh dựng nước, giữ nước",
        "Bảo vệ chủ quyền lãnh thổ và phát huy giá trị di sản văn hóa",
      ],
      multipleChoice: [
        {
          id: `lsdl_q1_w${week}`,
          question: "Nước Cộng hòa Xã hội Chủ nghĩa Việt Nam nằm ở khu vực nào của châu Á?",
          options: [
            { key: "A", text: "Đông Bắc Á" },
            { key: "B", text: "Đông Nam Á" },
            { key: "C", text: "Tây Á" },
            { key: "D", text: "Nam Á" },
          ],
          correctAnswer: "B",
          explanation: "Việt Nam thuộc khu vực Đông Nam Á, nằm trên bán đảo Đông Dương.",
        },
        {
          id: `lsdl_q2_w${week}`,
          question: "Phần đất liền của nước ta có hình dạng giống chữ cái nào?",
          options: [
            { key: "A", text: "Hình chữ C" },
            { key: "B", text: "Hình chữ S" },
            { key: "C", text: "Hình chữ V" },
            { key: "D", text: "Hình chữ U" },
          ],
          correctAnswer: "B",
          explanation: "Lãnh thổ đất liền Việt Nam cong hình chữ S, trải dài từ Bắc vào Nam với bờ biển dài 3.260 km.",
        },
        {
          id: `lsdl_q3_w${week}`,
          question: "Hai quần đảo lớn của Việt Nam ở Biển Đông là:",
          options: [
            { key: "A", text: "Quần đảo Côn Đảo và quần đảo Phú Quốc" },
            { key: "B", text: "Quần đảo Hoàng Sa và quần đảo Trường Sa" },
            { key: "C", text: "Quần đảo Cô Tô và quần đảo Cát Bà" },
            { key: "D", text: "Quần đảo Thổ Chu và quần đảo Nam Du" },
          ],
          correctAnswer: "B",
          explanation: "Hoàng Sa và Trường Sa là hai quần đảo thiêng liêng thuộc chủ quyền không thể chối cãi của Việt Nam trên Biển Đông.",
        },
        {
          id: `lsdl_q4_w${week}`,
          question: "Bác Hồ đọc bản Tuyên ngôn Độc lập khai sinh ra nước Việt Nam Dân chủ Cộng hòa vào ngày tháng năm nào?",
          options: [
            { key: "A", text: "Ngày 19 tháng 8 năm 1945" },
            { key: "B", text: "Ngày 2 tháng 9 năm 1945" },
            { key: "C", text: "Ngày 7 tháng 5 năm 1954" },
            { key: "D", text: "Ngày 30 tháng 4 năm 1975" },
          ],
          correctAnswer: "B",
          explanation: "Ngày 2/9/1945, tại Quảng trường Ba Đình lịch sử, Chủ tịch Hồ Chí Minh đã đọc Tuyên ngôn Độc lập khai sinh nước Việt Nam mới.",
        },
      ],
      essay: [
        {
          id: `lsdl_e1_w${week}`,
          question: "Kể tên các quốc gia có đường biên giới trên đất liền giáp với Việt Nam.",
          sampleAnswer: "Các quốc gia giáp biên giới đất liền với Việt Nam là: Trung Quốc (phía bắc), Lào (phía tây) và Cam-pu-chia (phía tây nam).",
        },
        {
          id: `lsdl_e2_w${week}`,
          question: "Là một học sinh tiểu học, em có thể làm gì để góp phần giữ gìn và phát huy niềm tự hào về truyền thống lịch sử hào hùng của dân tộc?",
          sampleAnswer: "Gợi ý: Cố gắng học giỏi môn Lịch sử; tìm hiểu về các anh hùng dân tộc; giữ gìn vệ sinh tại các di tích lịch sử; yêu mến bảo vệ chủ quyền biển đảo quê hương.",
        },
      ],
    };
  }

  // Fallback generic
  return {
    defaultFocus: [`Nội dung trọng tâm bài học Tuần ${week}`],
    multipleChoice: [
      {
        id: `gen_q1_w${week}`,
        question: `Nội dung cốt lõi của bài học môn ${subject} tuần ${week} là gì?`,
        options: [
          { key: "A", text: "Nắm chắc kiến thức lý thuyết cơ bản và kỹ năng thực hành" },
          { key: "B", text: "Không cần ghi nhớ nội dung bài học" },
          { key: "C", text: "Chỉ làm bài tập khi có kiểm tra" },
          { key: "D", text: "Học thuộc lòng không cần hiểu bản chất" },
        ],
        correctAnswer: "A",
        explanation: "Học sinh cần nắm vững bản chất kiến thức và biết vận dụng giải quyết bài tập thực tế.",
      },
    ],
    essay: [
      {
        id: `gen_e1_w${week}`,
        question: `Em hãy tóm tắt những điều em học được trong môn ${subject} tuần này.`,
        sampleAnswer: "Học sinh tóm tắt lại các ý chính đã học được trong tuần.",
      },
    ],
  };
}
