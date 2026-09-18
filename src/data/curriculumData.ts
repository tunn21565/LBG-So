import { Grade, LessonPlan, ScheduleItem } from "../types";
import { sortScheduleChronologically } from "./defaultTimetables";
import { getDetailedActivitiesForLesson } from "../utils/detailedActivitiesHelper";

export interface SubjectCurriculum {
  subject: string;
  periodsPerWeek: number;
  totalPeriods: number;
}

export const GRADE_SUBJECTS: Record<Grade, SubjectCurriculum[]> = {
  1: [
    { subject: "Tiếng Việt", periodsPerWeek: 12, totalPeriods: 420 },
    { subject: "Toán", periodsPerWeek: 3, totalPeriods: 105 },
    { subject: "Đạo đức", periodsPerWeek: 1, totalPeriods: 35 },
    { subject: "Tự nhiên và Xã hội", periodsPerWeek: 2, totalPeriods: 70 },
    { subject: "Giáo dục Thể chất", periodsPerWeek: 2, totalPeriods: 70 },
    { subject: "Nghệ thuật (Âm nhạc, Mĩ thuật)", periodsPerWeek: 2, totalPeriods: 70 },
    { subject: "Hoạt động trải nghiệm", periodsPerWeek: 3, totalPeriods: 105 },
    { subject: "Tăng cường Tiếng Việt", periodsPerWeek: 2, totalPeriods: 70 },
    { subject: "Tăng cường Toán", periodsPerWeek: 3, totalPeriods: 105 },
  ],
  2: [
    { subject: "Tiếng Việt", periodsPerWeek: 10, totalPeriods: 350 },
    { subject: "Toán", periodsPerWeek: 5, totalPeriods: 175 },
    { subject: "Đạo đức", periodsPerWeek: 1, totalPeriods: 35 },
    { subject: "Tự nhiên và Xã hội", periodsPerWeek: 2, totalPeriods: 70 },
    { subject: "Giáo dục Thể chất", periodsPerWeek: 2, totalPeriods: 70 },
    { subject: "Nghệ thuật (Âm nhạc, Mĩ thuật)", periodsPerWeek: 2, totalPeriods: 70 },
    { subject: "Hoạt động trải nghiệm", periodsPerWeek: 3, totalPeriods: 105 },
    { subject: "Tự chọn Tiếng Anh", periodsPerWeek: 2, totalPeriods: 70 },
    { subject: "Tăng cường Tiếng Việt", periodsPerWeek: 2, totalPeriods: 70 },
    { subject: "Tăng cường Toán", periodsPerWeek: 3, totalPeriods: 105 },
  ],
  3: [
    { subject: "Tiếng Việt", periodsPerWeek: 7, totalPeriods: 245 },
    { subject: "Toán", periodsPerWeek: 5, totalPeriods: 175 },
    { subject: "Tiếng Anh", periodsPerWeek: 4, totalPeriods: 140 },
    { subject: "Đạo đức", periodsPerWeek: 1, totalPeriods: 35 },
    { subject: "Tự nhiên và Xã hội", periodsPerWeek: 2, totalPeriods: 70 },
    { subject: "Tin học & Công nghệ", periodsPerWeek: 2, totalPeriods: 70 },
    { subject: "Giáo dục Thể chất", periodsPerWeek: 2, totalPeriods: 70 },
    { subject: "Nghệ thuật (Âm nhạc, Mĩ thuật)", periodsPerWeek: 2, totalPeriods: 70 },
    { subject: "Hoạt động trải nghiệm", periodsPerWeek: 3, totalPeriods: 105 },
  ],
  4: [
    { subject: "Tiếng Việt", periodsPerWeek: 7, totalPeriods: 245 },
    { subject: "Toán", periodsPerWeek: 5, totalPeriods: 175 },
    { subject: "Tiếng Anh", periodsPerWeek: 4, totalPeriods: 140 },
    { subject: "Đạo đức", periodsPerWeek: 1, totalPeriods: 35 },
    { subject: "Khoa học", periodsPerWeek: 2, totalPeriods: 70 },
    { subject: "Lịch sử và Địa lí", periodsPerWeek: 2, totalPeriods: 70 },
    { subject: "Công nghệ", periodsPerWeek: 1, totalPeriods: 35 },
    { subject: "Tin học", periodsPerWeek: 1, totalPeriods: 35 },
    { subject: "Giáo dục Thể chất", periodsPerWeek: 2, totalPeriods: 70 },
    { subject: "Nghệ thuật (Âm nhạc, Mĩ thuật)", periodsPerWeek: 2, totalPeriods: 70 },
    { subject: "Hoạt động trải nghiệm", periodsPerWeek: 3, totalPeriods: 105 },
  ],
  5: [
    { subject: "Tiếng Việt", periodsPerWeek: 7, totalPeriods: 245 },
    { subject: "Toán", periodsPerWeek: 5, totalPeriods: 175 },
    { subject: "Tiếng Anh", periodsPerWeek: 4, totalPeriods: 140 },
    { subject: "Đạo đức", periodsPerWeek: 1, totalPeriods: 35 },
    { subject: "Khoa học", periodsPerWeek: 2, totalPeriods: 70 },
    { subject: "Lịch sử và Địa lí", periodsPerWeek: 2, totalPeriods: 70 },
    { subject: "Công nghệ", periodsPerWeek: 1, totalPeriods: 35 },
    { subject: "Tin học", periodsPerWeek: 1, totalPeriods: 35 },
    { subject: "Giáo dục Thể chất", periodsPerWeek: 2, totalPeriods: 70 },
    { subject: "Nghệ thuật", periodsPerWeek: 2, totalPeriods: 70 },
    { subject: "Hoạt động trải nghiệm", periodsPerWeek: 3, totalPeriods: 105 },
  ]
};

// Rich default lesson plans with 2 columns, all CV 2345 sections, and specific integrations for all 5 grades
export const SAMPLE_LESSON_PLANS: Record<string, LessonPlan> = {
  // LỚP 5 - TUẦN 3 (Theo tài liệu mẫu Lớp 5A Tân Thạnh của user)
  "5-w3-hdtn-1": {
    id: "5-w3-hdtn-1",
    grade: 5,
    subject: "Hoạt động trải nghiệm",
    periodNumber: 1,
    curriculumPeriod: 7,
    lessonTitle: "Sinh hoạt dưới cờ: HOẠT ĐỘNG VUI TRUNG THU",
    week: 3,
    dayOfWeek: "Thứ Hai",
    dateStr: "21/09/2026",
    teacherName: "Nguyễn Hoàng Tuấn",
    className: "5A",
    schoolName: "Trường Tiểu học Tân Thạnh",
    departmentName: "UBND Xã Tân Thạnh",
    objectives: {
      specificCompetencies: [
        "Học sinh tích cực tham gia các hoạt động biểu diễn, trải nghiệm không khí ngày Tết Trung Thu truyền thống, thể hiện tinh thần tập thể, vui vẻ và tự tin."
      ],
      generalCompetencies: [
        "Năng lực giao tiếp và hợp tác thông qua việc phối hợp tổ chức lễ hội và trang trí mâm cỗ.",
        "Năng lực tự chủ và tự học khi chuẩn bị sản phẩm lồng đèn, tiết mục."
      ],
      qualities: [
        "Nhân ái, trách nhiệm, tôn trọng các nét đẹp văn hóa truyền thống của quê hương."
      ],
      integrations: {
        ai: "1.D1.1 - Nhận biết máy thông minh/AI có thể hỗ trợ tạo hình ảnh, nhạc nền và gợi ý kịch bản lễ hội.",
        digitalCompetence: "2.3.CB1a - Giao tiếp, chia sẻ thông điệp vui tươi, văn minh trong môi trường số.",
        humanRights: "Quyền trẻ em được vui chơi, giải trí và tham gia các hoạt động văn hóa, nghệ thuật.",
        nutrition: "GDDD: Nhận biết giá trị dinh dưỡng của mâm ngũ quả, bánh trung thu an toàn vệ sinh.",
        stem: "STEM: Sáng tạo lồng đèn từ vật liệu tái chế."
      }
    },
    materials: {
      teacher: ["Tivi, loa máy, lồng đèn mẫu, mâm cỗ Trung Thu mô hình."],
      student: ["Lồng đèn tự làm, vật liệu trang trí mâm ngũ quả của tổ."]
    },
    activities: [
      {
        name: "1. Khởi động",
        objective: "Tạo không khí vui tươi, phấn khởi chào mừng lễ hội Trung Thu.",
        teacherActivity: "Tổ chức cho toàn trường làm lễ Chào cờ nghiêm trang. Sau đó điều hành văn nghệ khởi động bài hát 'Chiếc đèn ông sao'.",
        studentActivity: "Học sinh thực hiện nghi thức chào cờ nghiêm túc. Đồng thanh hát vang và vỗ tay theo nhịp bài hát."
      },
      {
        name: "2. Khám phá",
        objective: "Giúp học sinh hiểu được ý nghĩa của Tết Trung Thu và nét đẹp văn hóa truyền thống.",
        teacherActivity: "Tổng phụ trách Đội giới thiệu ý nghĩa lịch sử ngày Tết Trung Thu, giới thiệu mâm cỗ và tục rước đèn phá cỗ.",
        studentActivity: "Lắng nghe chăm chú, tham gia trả lời câu hỏi đố vui về chú Cuội, chị Hằng."
      },
      {
        name: "3. Luyện tập / Thực hành",
        objective: "Rèn luyện sự khéo léo và tinh thần làm việc nhóm.",
        teacherActivity: "Tổ chức cuộc thi trưng bày lồng đèn giữa các lớp. GVCN hướng dẫn các tổ học sinh lớp 5A tự sắp xếp sản phẩm của mình lên bàn trưng bày.",
        studentActivity: "Các tổ phân công nhau đặt lồng đèn tự làm lên bàn, trang trí mâm ngũ quả nhỏ của tổ."
      },
      {
        name: "4. Vận dụng",
        objective: "Chia sẻ niềm vui Trung Thu đến gia đình và cộng đồng.",
        teacherActivity: "Nhận xét, tuyên dương các tổ hoạt động xuất sắc. Dặn dò HS mang lồng đèn về rước đèn cùng người thân.",
        studentActivity: "Chia sẻ cảm nghĩ về ngày hội. Ghi nhớ mang lồng đèn về nhà đón Trung thu an toàn."
      }
    ],
    postLessonAdjustment: "..........................................................................................................................................................................."
  },
  "5-w3-tv-1": {
    id: "5-w3-tv-1",
    grade: 5,
    subject: "Tiếng Việt",
    subSubject: "Đọc",
    periodNumber: 2,
    curriculumPeriod: 15,
    lessonTitle: "Tiết 15: TIẾNG HẠT NẢY MẦM",
    week: 3,
    dayOfWeek: "Thứ Hai",
    dateStr: "21/09/2026",
    teacherName: "Nguyễn Hoàng Tuấn",
    className: "5A",
    schoolName: "Trường Tiểu học Tân Thạnh",
    objectives: {
      specificCompetencies: [
        "Đọc đúng, trôi chảy và bước đầu biết đọc diễn cảm bài thơ 'Tiếng hạt nảy mầm'. Hiểu nội dung, thông điệp ý nghĩa: Lắng nghe và thấu cảm với những điều kỳ diệu xung quanh và thế giới tinh tế của trẻ em."
      ],
      generalCompetencies: [
        "Năng lực tự chủ và tự học thông qua luyện đọc cá nhân.",
        "Năng lực giải quyết vấn đề qua trả lời câu hỏi đọc hiểu."
      ],
      qualities: [
        "Nhân ái, biết trân trọng cuộc sống và thế giới thiên nhiên."
      ],
      integrations: {
        ai: "1.A1.1 - Nhận biết con người có cảm xúc thật trước vẻ đẹp thiên nhiên, AI chỉ mô phỏng theo dữ liệu được nạp.",
        digitalCompetence: "1.1.CB1a - Biết tìm kiếm hình ảnh hạt nảy mầm từ nguồn học liệu số an toàn do GV cung cấp.",
        environment: "Bảo vệ môi trường: Yêu quý cây xanh, chăm sóc mầm cây non quanh trường lớp."
      }
    },
    materials: {
      teacher: ["Sách giáo khoa, máy chiếu trình chiếu bài thơ, tranh ảnh minh họa hạt nảy mầm."],
      student: ["Sách giáo khoa Tiếng Việt 5, vở ghi bài."]
    },
    activities: [
      {
        name: "1. Khởi động",
        objective: "Kích thích trí tò mò, tạo tâm thế học tập hứng khởi.",
        teacherActivity: "Cho học sinh quan sát hình ảnh một mầm cây đang nhú lên từ lòng đất. Hỏi: 'Em nghĩ hạt giống có phát ra tiếng động khi nảy mầm không?' Dẫn dắt vào bài mới.",
        studentActivity: "Quan sát tranh, suy nghĩ và đưa ra ý kiến cá nhân (Có/Không/Tiếng cựa mình nhẹ nhàng)."
      },
      {
        name: "2. Khám phá",
        objective: "Đọc trôi chảy, đúng nhịp bài thơ.",
        teacherActivity: "Đọc mẫu bài thơ với giọng nhẹ nhàng, truyền cảm. Hướng dẫn ngắt nhịp thơ thích hợp. Chia bài thơ làm các khổ thơ để luyện đọc nối tiếp.",
        studentActivity: "Theo dõi SGK, lắng nghe cách đọc mẫu. 4 học sinh nối tiếp nhau đọc 4 khổ thơ trước lớp. Luyện đọc từ khó: 'nảy mầm', 'xôn xao', 'lặng thầm'."
      },
      {
        name: "3. Luyện tập",
        objective: "Hiểu nội dung và ý nghĩa sâu sắc của bài thơ.",
        teacherActivity: "Yêu cầu HS đọc thầm, thảo luận nhóm trả lời các câu hỏi đọc hiểu trong SGK: Hạt mầm cần những gì để nảy mầm? Những âm thanh nào được miêu tả?",
        studentActivity: "Thảo luận nhóm đôi, trả lời câu hỏi: Hạt mầm cần nước, đất ấm và ánh sáng. Tiếng hạt nảy mầm là âm thanh của sự sống sinh sôi."
      },
      {
        name: "4. Vận dụng",
        objective: "Khắc sâu tình yêu thiên nhiên, kỹ năng tự học.",
        teacherActivity: "Hướng dẫn học sinh chọn khổ thơ yêu thích để học thuộc lòng. Nhận xét tiết học.",
        studentActivity: "Luyện đọc diễn cảm khổ thơ yêu thích và ghi nhớ việc quan sát cây cối quanh nhà."
      }
    ],
    postLessonAdjustment: "..........................................................................................................................................................................."
  },
  "5-w3-tv-2": {
    id: "5-w3-tv-2",
    grade: 5,
    subject: "Tiếng Việt",
    subSubject: "Luyện từ và câu",
    periodNumber: 3,
    curriculumPeriod: 16,
    lessonTitle: "Tiết 16: LUYỆN TẬP VỀ ĐẠI TỪ",
    week: 3,
    dayOfWeek: "Thứ Hai",
    dateStr: "21/09/2026",
    teacherName: "Nguyễn Hoàng Tuấn",
    className: "5A",
    schoolName: "Trường Tiểu học Tân Thạnh",
    objectives: {
      specificCompetencies: [
        "Học sinh củng cố kiến thức về đại từ xưng hô, đại từ chỉ định; biết cách tìm và sử dụng đại từ đúng ngữ cảnh trong văn bản đọc viết."
      ],
      generalCompetencies: [
        "Năng lực giao tiếp ngôn ngữ mạch lạc.",
        "Năng lực tự học và giải quyết bài tập cá nhân."
      ],
      qualities: [
        "Chăm chỉ rèn luyện từ ngữ tiếng Việt; trung thực trong làm bài tập."
      ],
      integrations: {
        ai: "2.A1.1 - Hiểu rằng AI có thể gợi ý đại từ xưng hô phù hợp ngữ cảnh nhưng người học cần kiểm tra và xưng hô lễ phép.",
        digitalCompetence: "5.2.CB1a - Sử dụng bảng phân loại đại từ trên slide/bảng tương tác để kiểm tra kết quả."
      }
    },
    materials: {
      teacher: ["Phiếu bài tập nhóm, bảng phụ ghi các đoạn văn mẫu."],
      student: ["Vở bài tập Tiếng Việt 5, bút."]
    },
    activities: [
      {
        name: "1. Khởi động",
        objective: "Ôn lại lý thuyết về đại từ.",
        teacherActivity: "Tổ chức trò chơi 'Hộp quà bí mật' chứa các câu hỏi ngắn: 'Thế nào là đại từ?', 'Cho ví dụ về đại từ xưng hô'.",
        studentActivity: "Học sinh tham gia trả lời nhanh để mở quà, ôn lại kiến thức đại từ xưng hô (tôi, tớ, chúng ta)."
      },
      {
        name: "2. Khám phá",
        objective: "Phát hiện đại từ trong ngữ liệu thực tế.",
        teacherActivity: "Đưa đoạn văn mẫu lên bảng phụ. Yêu cầu học sinh đọc và gạch chân các từ dùng để thay thế hoặc xưng hô.",
        studentActivity: "Đọc thầm đoạn văn, làm việc cá nhân gạch chân các từ: 'anh', 'tôi', 'họ', 'ấy'."
      },
      {
        name: "3. Luyện tập",
        objective: "Vận dụng viết câu có sử dụng đại từ hợp lý.",
        teacherActivity: "Giao nhiệm vụ trong Phiếu bài tập: Phân biệt đại từ xưng hô và đại từ chỉ định trong các câu cụ thể. Đặt 2 câu sử dụng đại từ.",
        studentActivity: "Hoàn thành phiếu bài tập cá nhân. Trao đổi chéo vở để kiểm tra và nhận xét bài của bạn."
      },
      {
        name: "4. Vận dụng",
        objective: "Sử dụng đại từ lịch sự trong giao tiếp hàng ngày.",
        teacherActivity: "Nhận xét kết quả bài làm. Khắc sâu nguyên tắc xưng hô lễ phép của học sinh tiểu học.",
        studentActivity: "Lắng nghe, tự rút kinh nghiệm về cách xưng hô với người lớn, thầy cô."
      }
    ],
    postLessonAdjustment: "..........................................................................................................................................................................."
  },
  "5-w3-toan-1": {
    id: "5-w3-toan-1",
    grade: 5,
    subject: "Toán",
    periodNumber: 4,
    curriculumPeriod: 11,
    lessonTitle: "Bài 6: CỘNG, TRỪ HAI PHÂN SỐ KHÁC MẪU SỐ (TIẾT 1)",
    week: 3,
    dayOfWeek: "Thứ Hai",
    dateStr: "21/09/2026",
    teacherName: "Nguyễn Hoàng Tuấn",
    className: "5A",
    schoolName: "Trường Tiểu học Tân Thạnh",
    objectives: {
      specificCompetencies: [
        "Học sinh hiểu và thực hiện được quy trình cộng, trừ hai phân số khác mẫu số bằng cách quy đồng mẫu số rồi thực hiện phép tính."
      ],
      generalCompetencies: [
        "Phát triển năng lực tư duy toán học và năng lực giải quyết vấn đề toán học thực tiễn."
      ],
      qualities: [
        "Cẩn thận, chính xác trong tính toán, chăm chỉ làm bài tập toán học."
      ],
      integrations: {
        ai: "4.C4.1 - Hiểu AI áp dụng thuật toán logic quy đồng mẫu số để tính toán nhanh, con người cần kiểm tra bước trung gian.",
        digitalCompetence: "5.2.CB1a - Sử dụng công cụ tương tác kéo thả phân số trên màn hình để kiểm tra đáp án."
      }
    },
    materials: {
      teacher: ["Bộ đồ dùng dạy học Toán 5, phiếu học tập nhóm."],
      student: ["Bộ thực hành Toán 5, bảng con, nháp."]
    },
    activities: [
      {
        name: "1. Khởi động",
        objective: "Ôn tập cộng, trừ hai phân số cùng mẫu số.",
        teacherActivity: "Yêu cầu 2 học sinh lên bảng làm phép tính: 3/7 + 2/7 và 5/9 - 1/9.",
        studentActivity: "Thực hiện phép tính trên bảng lớp, cả lớp làm nháp. Nêu quy tắc: Cộng/trừ tử số và giữ nguyên mẫu số."
      },
      {
        name: "2. Khám phá",
        objective: "Tìm ra cách cộng hai phân số khác mẫu số.",
        teacherActivity: "Nêu bài toán thực tế: 'Bạn Nam uống 1/2 cốc nước, bạn Mai uống 1/3 cốc nước. Hỏi cả hai uống bao nhiêu phần cốc nước?' Đặt phép tính: 1/2 + 1/3. Hỏi cách làm?",
        studentActivity: "Phát hiện mẫu số khác nhau nên không cộng trực tiếp được. Đề xuất quy đồng mẫu số hai phân số về cùng mẫu số rồi cộng."
      },
      {
        name: "3. Luyện tập",
        objective: "Thực hiện thành thạo phép tính cộng hai phân số khác mẫu số.",
        teacherActivity: "Hướng dẫn HS làm Bài 1, Bài 2 trong SGK. Quan sát, uốn nắn những em tính toán chậm.",
        studentActivity: "Làm bài cá nhân vào vở. Lên bảng trình bày các phép tính quy đồng và cộng: 1/2 + 1/3 = 3/6 + 2/6 = 5/6."
      },
      {
        name: "4. Vận dụng",
        objective: "Giải quyết bài toán thực tế đơn giản.",
        teacherActivity: "Giao bài toán đố: Một mảnh vườn trồng hoa hết 1/3 diện tích, trồng rau hết 2/5 diện tích. Hỏi tổng diện tích trồng hoa và rau chiếm bao nhiêu phần?",
        studentActivity: "Tính nhanh: 1/3 + 2/5 = 5/15 + 6/15 = 11/15 diện tích mảnh vườn."
      }
    ],
    postLessonAdjustment: "..........................................................................................................................................................................."
  },
  "5-w3-kh-1": {
    id: "5-w3-kh-1",
    grade: 5,
    subject: "Khoa học",
    periodNumber: 1,
    curriculumPeriod: 5,
    lessonTitle: "Bài 2: Ô NHIỄM, XÓI MÒN ĐẤT VÀ BẢO VỆ MÔI TRƯỜNG ĐẤT (TIẾT 3)",
    week: 3,
    dayOfWeek: "Thứ Hai",
    dateStr: "21/09/2026",
    teacherName: "Nguyễn Hoàng Tuấn",
    className: "5A",
    schoolName: "Trường Tiểu học Tân Thạnh",
    objectives: {
      specificCompetencies: [
        "Học sinh trình bày được các biện pháp bảo vệ môi trường đất, chống xói mòn và ô nhiễm đất trong nông nghiệp và đời sống sinh hoạt."
      ],
      generalCompetencies: [
        "Năng lực giải quyết vấn đề qua đề xuất các giải pháp bảo vệ đất đai địa phương."
      ],
      qualities: [
        "Trách nhiệm bảo vệ môi trường xung quanh, có ý thức tiết kiệm tài nguyên."
      ],
      integrations: {
        environment: "Bảo vệ môi trường: Trồng rừng đầu nguồn, làm ruộng bậc thang, hạn chế thuốc trừ sâu.",
        nutrition: "GDDD: Đất sạch cung cấp nông sản sạch, giàu dinh dưỡng cho bữa ăn gia đình.",
        ai: "4.A1.1 - Nhận biết AI hỗ trợ phân tích chất lượng đất qua ảnh vệ tinh để cảnh báo xói mòn."
      }
    },
    materials: {
      teacher: ["Hình ảnh xói mòn đất, ruộng bậc thang, video ngắn về xói mòn đất."],
      student: ["Giấy A3, bút dạ màu làm việc nhóm."]
    },
    activities: [
      {
        name: "1. Khởi động",
        objective: "Ôn lại nguyên nhân gây ô nhiễm và xói mòn đất.",
        teacherActivity: "Hỏi: 'Những hoạt động nào của con người trực tiếp làm đất bị ô nhiễm?'",
        studentActivity: "Trả lời: Sử dụng quá nhiều phân bón hóa học, phun thuốc trừ sâu bừa bãi, vứt rác thải nhựa."
      },
      {
        name: "2. Khám phá",
        objective: "Nhận diện các biện pháp chống xói mòn, bảo vệ đất.",
        teacherActivity: "Chiếu hình ảnh ruộng bậc thang, trồng cây gây rừng, bón phân hữu cơ. Đặt câu hỏi thảo luận: 'Tại sao trồng rừng lại chống được xói mòn đất?'",
        studentActivity: "Thảo luận nhóm 4. Trả lời: Rễ cây giữ đất bám chặt, lá cây cản bớt lực nước mưa rơi trực tiếp làm trôi đất mặt."
      },
      {
        name: "3. Luyện tập",
        objective: "Hệ thống hóa các biện pháp bảo vệ đất.",
        teacherActivity: "Yêu cầu học sinh làm bảng hệ thống phân loại biện pháp: Biện pháp chống xói mòn và Biện pháp chống ô nhiễm đất.",
        studentActivity: "Làm bài nhóm vào giấy A3: Chống xói mòn (trồng rừng, làm ruộng bậc thang); Chống ô nhiễm (sử dụng phân hữu cơ bón đất, phân loại rác thải tại nguồn)."
      },
      {
        name: "4. Vận dụng",
        objective: "Vận động mọi người bảo vệ đất tại địa phương.",
        teacherActivity: "Yêu cầu HS viết 1 thông điệp ngắn kêu gọi gia đình không vứt túi ni-lông ra vườn đất nhà mình.",
        studentActivity: "Viết thông điệp: 'Hãy bón phân xanh, giữ sạch đất lành!' và dán góc học tập."
      }
    ],
    postLessonAdjustment: "..........................................................................................................................................................................."
  },
  "5-w3-cn-1": {
    id: "5-w3-cn-1",
    grade: 5,
    subject: "Công nghệ",
    periodNumber: 2,
    curriculumPeriod: 3,
    lessonTitle: "Bài 2: NHÀ SÁNG CHẾ (TIẾT 1)",
    week: 3,
    dayOfWeek: "Thứ Hai",
    dateStr: "21/09/2026",
    teacherName: "Nguyễn Hoàng Tuấn",
    className: "5A",
    schoolName: "Trường Tiểu học Tân Thạnh",
    objectives: {
      specificCompetencies: [
        "Học sinh bước đầu hiểu khái niệm nhà sáng chế, nhận biết được vai trò và một số đóng góp to lớn của các nhà sáng chế nổi tiếng trong lịch sử nhân loại."
      ],
      generalCompetencies: [
        "Năng lực giải quyết vấn đề và sáng tạo; năng lực tự tìm hiểu thông tin qua bài đọc."
      ],
      qualities: [
        "Chăm chỉ, đam mê khám phá khoa học kỹ thuật."
      ],
      integrations: {
        ai: "4.D1.1 - Từ vấn đề thực tế nảy sinh ý tưởng phát minh; AI hỗ trợ thử nghiệm và mô phỏng sáng chế.",
        digitalCompetence: "1.1.CB1a - Tra cứu tiểu sử nhà sáng chế Thomas Edison trên thư viện số."
      }
    },
    materials: {
      teacher: ["Hình ảnh Thomas Edison, hình ảnh chiếc bóng đèn sợi đốt đầu tiên."],
      student: ["Sách giáo khoa Công nghệ 5."]
    },
    activities: [
      {
        name: "1. Khởi động",
        objective: "Kích thích tư duy sáng tạo của học sinh.",
        teacherActivity: "Hỏi: 'Khi tối trời, chúng ta bật đèn điện lên. Ai là người đã nghĩ ra chiếc bóng đèn điện đầu tiên?' Dẫn dắt vào bài mới.",
        studentActivity: "Trả lời: Thomas Edison (Ê-đi-xơn)."
      },
      {
        name: "2. Khám phá",
        objective: "Tìm hiểu về cuộc đời và sự nghiệp sáng chế của Thomas Edison.",
        teacherActivity: "Tổ chức đọc câu chuyện về Thomas Edison trong SGK Công nghệ 5. Hướng dẫn thảo luận nhóm về đức tính kiên trì của ông.",
        studentActivity: "Đọc câu chuyện nối tiếp. Thảo luận: Thomas Edison đã thất bại hàng nghìn lần trước khi tìm ra sợi dây tóc bóng đèn hoàn hảo."
      },
      {
        name: "3. Luyện tập",
        objective: "Xác định các đức tính của một nhà sáng chế.",
        teacherActivity: "Hỏi: 'Theo em, một nhà sáng chế cần có những đức tính gì?' Trình bày bảng phụ các đáp án lựa chọn.",
        studentActivity: "Lựa chọn và ghi vào vở: Kiên trì, say mê quan sát, ham học hỏi, không sợ thất bại."
      },
      {
        name: "4. Vận dụng",
        objective: "Khơi gợi ý tưởng sáng tạo trong học sinh.",
        teacherActivity: "Hỏi: 'Nếu được sáng chế một đồ vật giúp việc học của em dễ dàng hơn, em sẽ sáng chế thứ gì?'",
        studentActivity: "Phát biểu tự do: Hộp bút tự động dọn dẹp, bút thông minh viết không mỏi tay, thước kẻ phát sáng."
      }
    ],
    postLessonAdjustment: "..........................................................................................................................................................................."
  },

  // LỚP 1 - MẪU TIẾNG VIỆT & TOÁN (Khối 1 chuẩn CV 2345)
  "1-w1-tv-1": {
    id: "1-w1-tv-1",
    grade: 1,
    subject: "Tiếng Việt",
    subSubject: "Đọc",
    periodNumber: 1,
    curriculumPeriod: 1,
    lessonTitle: "Bài 1: Làm quen với trường lớp, bạn bè, đồ dùng học tập (Tiết 1)",
    week: 1,
    dayOfWeek: "Thứ Hai",
    dateStr: "07/09/2026",
    teacherName: "Nguyễn Thị Phương",
    className: "1A",
    schoolName: "Trường Tiểu học Chibi",
    objectives: {
      specificCompetencies: [
        "Làm quen với thầy cô, bạn bè, môi trường lớp học mới; gọi đúng tên các đồ dùng học tập cơ bản (bảng con, phấn, bút chì, hộp bút, thước kẻ)."
      ],
      generalCompetencies: [
        "Năng lực tự chủ, tự tin giới thiệu họ tên, sở thích với thầy cô và các bạn trong lớp."
      ],
      qualities: [
        "Yêu quý trường lớp, bạn bè, có ý thức giữ gìn đồ dùng học tập cẩn thận."
      ],
      integrations: {
        humanRights: "Quyền con người: Giúp HS nhận biết quyền được học tập, vui chơi, kết bạn trong môi trường an toàn; biết tôn trọng thầy cô và bạn bè.",
        lifeSkills: "Kĩ năng sống: Rèn kĩ năng chào hỏi, giới thiệu bản thân, giữ gìn đồ dùng học tập và thực hiện nền nếp lớp học.",
        ai: "1.A1.1 - Nhận diện AI trong cuộc sống (robot trợ giảng, máy tính) và hiểu con người mới có tình cảm bạn bè thật sự."
      }
    },
    materials: {
      teacher: ["Tranh minh họa lớp học, bộ thẻ từ đồ dùng học tập, tivi trình chiếu."],
      student: ["Bộ đồ dùng học tập Tiếng Việt 1, bảng con, phấn."]
    },
    activities: [
      {
        name: "1. Khởi động",
        objective: "Tạo không khí vui tươi, gắn kết học sinh ngày đầu đến lớp.",
        teacherActivity: "Bắt nhịp cả lớp hát bài 'Trường chúng cháu là trường mầm non' và giới thiệu chuyển tiếp lên lớp 1 Tiểu học.",
        studentActivity: "Hát đồng thanh, vỗ tay theo nhịp, ngồi ngay ngắn theo tổ."
      },
      {
        name: "2. Khám phá",
        objective: "Nhận biết các khu vực trong trường lớp và làm quen bạn bè.",
        teacherActivity: "Tổ chức trò chơi 'Bắt tay làm quen'. Cho HS lần lượt đứng dậy giới thiệu tên và sở thích của mình.",
        studentActivity: "Tự tin đứng lên nói: 'Chào các bạn, mình tên là... Sở thích của mình là...'."
      },
      {
        name: "3. Luyện tập",
        objective: "Nhận diện và sắp xếp đồ dùng học tập đúng cách.",
        teacherActivity: "Giơ từng đồ dùng học tập lên (bút chì, thước, tẩy, bảng con) và hướng dẫn cách cầm, cách đặt trên bàn ngay ngắn.",
        studentActivity: "Lấy đúng đồ dùng theo hiệu lệnh của giáo viên, đặt gọn gàng phía góc phải bàn học."
      },
      {
        name: "4. Vận dụng",
        objective: "Hình thành thói quen chào hỏi và giữ gìn đồ dùng.",
        teacherActivity: "Dặn dò học sinh khi tan học chào thầy cô, bố mẹ và cất đồ dùng vào cặp cẩn thận.",
        studentActivity: "Thực hành chào bạn cùng bàn và xếp đồ dùng vào ngăn cặp gọn gàng."
      }
    ],
    postLessonAdjustment: "..........................................................................................................................................................................."
  },
  "1-w1-toan-1": {
    id: "1-w1-toan-1",
    grade: 1,
    subject: "Toán",
    periodNumber: 4,
    curriculumPeriod: 1,
    lessonTitle: "Tiết học đầu tiên - Làm quen với môn Toán",
    week: 1,
    dayOfWeek: "Thứ Hai",
    dateStr: "07/09/2026",
    teacherName: "Nguyễn Thị Phương",
    className: "1A",
    schoolName: "Trường Tiểu học Chibi",
    objectives: {
      specificCompetencies: [
        "Làm quen với sách Toán 1, bộ đồ dùng học Toán 1; nhận biết các biểu tượng, đồ vật, số lượng đơn giản trong thực tế."
      ],
      generalCompetencies: [
        "Năng lực tự chủ lấy đúng bộ thực hành Toán, quan sát tranh ảnh toán học sinh động."
      ],
      qualities: [
        "Yêu thích môn Toán, cẩn thận giữ gìn các que tính, khối hình."
      ],
      integrations: {
        ai: "1.A2.1 - Nhận biết nhân vật Rô-bốt trong sách là một đại diện tiêu biểu của AI hỗ trợ con người học tập Toán.",
        digitalCompetence: "5.2.CB1a - Làm quen với việc quan sát hình ảnh toán học trên màn hình tivi/bảng tương tác."
      }
    },
    materials: {
      teacher: ["Sách Toán 1, bộ thực hành Toán 1 phóng to, hình ảnh bạn Rô-bốt."],
      student: ["Sách Toán 1, hộp que tính, khối lập phương."]
    },
    activities: [
      {
        name: "1. Khởi động",
        objective: "Tạo sự tò mò, hứng thú với cuốn sách Toán mới.",
        teacherActivity: "Cho HS quan sát bìa sách Toán 1 có hình bạn Rô-bốt ngộ nghĩnh và đố: 'Đố các em bạn này là ai?'",
        studentActivity: "Quan sát và reo vui: 'Bạn Rô-bốt!' Thảo luận tại sao bạn Rô-bốt lại học cùng chúng ta."
      },
      {
        name: "2. Khám phá",
        objective: "Khám phá cấu trúc sách và bộ đồ dùng học Toán.",
        teacherActivity: "Hướng dẫn mở từng trang sách, chỉ các biểu tượng học tập: Bàn tay (Khám phá), Cây bút (Hoạt động), Con ong (Luyện tập).",
        studentActivity: "Mở sách theo tay cô, đọc theo tên các biểu tượng trong sách."
      },
      {
        name: "3. Luyện tập",
        objective: "Thực hành mở hộp đồ dùng Toán và nhận biết các vật thể.",
        teacherActivity: "Yêu cầu HS mở hộp đồ dùng, lấy ra 1 que tính màu đỏ, 1 khối vuông nhỏ.",
        studentActivity: "Mở hộp nhẹ nhàng, chọn đúng đồ dùng giơ lên cao cho cô giáo kiểm tra."
      },
      {
        name: "4. Vận dụng",
        objective: "Đếm số đồ vật quanh lớp học.",
        teacherActivity: "Đố học sinh tìm trong lớp có mấy cái quạt trần, mấy chiếc bảng đen.",
        studentActivity: "Quan sát xung quanh lớp và đếm to: 4 cái quạt, 1 chiếc bảng đen."
      }
    ],
    postLessonAdjustment: "..........................................................................................................................................................................."
  }
};

export const CURRICULUM_GRADES: Grade[] = [1, 2, 3, 4, 5];

/**
 * Generate full week Lesson Plans (KHBD) for all items in the schedule
 * When schoolInfo.teacherType === "homeroom", specialist subjects (taught by specialist teachers)
 * are excluded by default so that homeroom teachers only generate KHBD for their directly taught subjects.
 */
export function generateFullWeekLessonPlans(
  schoolInfo: any,
  scheduleItems: ScheduleItem[],
  options?: { includeSpecialistInHomeroom?: boolean }
): LessonPlan[] {
  const plans: LessonPlan[] = [];
  const isHomeroom = schoolInfo.teacherType === "homeroom";
  const includeSpecialist = options?.includeSpecialistInHomeroom ?? false;

  // For homeroom teachers, filter out specialist and departmental subjects taught by other teachers
  // Tiết HĐTN thứ 2 (CC/SHDC) và thứ 6 (SHL) luôn do GVCN dạy
  const targetItems = isHomeroom && !includeSpecialist
    ? scheduleItems.filter((it) => {
        if (it.day === "Thứ Hai" && (it.subject.includes("HĐTN") || it.subSubject?.includes("dưới cờ") || it.note?.includes("Chào cờ"))) {
          return true;
        }
        if (it.day === "Thứ Sáu" && (it.subject.includes("HĐTN") || it.subSubject?.includes("lớp") || it.note?.includes("Sinh hoạt"))) {
          return true;
        }
        return !it.note || (!it.note.includes("GV Chuyên") && !it.note.includes("GV Bộ môn"));
      })
    : scheduleItems;

  // Sắp xếp các tiết học theo đúng thứ tự ngày -> buổi -> tiết trước khi sinh KHBD
  const sortedItems = sortScheduleChronologically(targetItems);

  sortedItems.forEach((item, idx) => {
    const itemGrade = (parseInt(item.className.charAt(0)) as Grade) || schoolInfo.grade || 5;

    // Check if we have an existing sample plan that matches this lesson exactly
    const sampleKey = Object.keys(SAMPLE_LESSON_PLANS).find(k => 
      k.startsWith(`${itemGrade}-`) && 
      SAMPLE_LESSON_PLANS[k].lessonTitle.toLowerCase().trim() === item.lessonTitle.toLowerCase().trim()
    );

    if (sampleKey && SAMPLE_LESSON_PLANS[sampleKey]) {
      const sp = SAMPLE_LESSON_PLANS[sampleKey];
      plans.push({
        ...sp,
        id: `plan-${item.id}-${idx}`,
        grade: itemGrade,
        week: schoolInfo.week,
        dayOfWeek: item.day,
        session: item.session,
        dateStr: item.dateStr || schoolInfo.startDate,
        periodNumber: item.period,
        curriculumPeriod: item.curriculumPeriod || idx + 1,
        teacherName: schoolInfo.teacherName,
        className: item.className || schoolInfo.className,
        schoolName: schoolInfo.schoolName,
        departmentName: schoolInfo.departmentName,
        branchName: schoolInfo.branchName,
      });
      return;
    }

    // Dynamic tailored plan with authentic detailed GDPT 2018 classroom interactions
    const detailed = getDetailedActivitiesForLesson(
      item.subject,
      item.lessonTitle,
      itemGrade,
      item.subSubject,
      item.curriculumPeriod
    );

    const specificCompetencies = detailed.specificCompetencies;
    const teacherMaterials = detailed.teacherMaterials;
    const studentMaterials = detailed.studentMaterials;

    const act1Teacher = detailed.act1Teacher;
    const act1Student = detailed.act1Student;
    const act2Teacher = detailed.act2Teacher;
    const act2Student = detailed.act2Student;
    const act3Teacher = detailed.act3Teacher;
    const act3Student = detailed.act3Student;
    const act4Teacher = detailed.act4Teacher;
    const act4Student = detailed.act4Student;

    // Dynamic CV 2345 plan
    plans.push({
      id: `plan-${item.id}-${idx}`,
      grade: itemGrade,
      subject: item.subject,
      subSubject: item.subSubject,
      lessonTitle: item.lessonTitle,
      periodNumber: item.period,
      curriculumPeriod: item.curriculumPeriod || idx + 1,
      week: schoolInfo.week,
      dayOfWeek: item.day,
      session: item.session,
      dateStr: item.dateStr || schoolInfo.startDate,
      teacherName: schoolInfo.teacherName,
      className: item.className || schoolInfo.className,
      schoolName: schoolInfo.schoolName,
      departmentName: schoolInfo.departmentName,
      branchName: schoolInfo.branchName,
      objectives: {
        specificCompetencies,
        generalCompetencies: [
          "Năng lực tự chủ và tự học: Tự giác chuẩn bị đầy đủ sách vở, đồ dùng học tập, chủ động hoàn thành nhiệm vụ cá nhân.",
          "Năng lực giao tiếp và hợp tác: Tích cực thảo luận nhóm, biết lắng nghe, tôn trọng và chia sẻ ý kiến với bạn bè.",
          "Năng lực giải quyết vấn đề và sáng tạo: Biết vận dụng kiến thức bài học để xử lý tình huống linh hoạt."
        ],
        qualities: [
          "Yêu nước, nhân ái: Tự hào về văn hóa, con người Việt Nam, yêu thương và giúp đỡ mọi người xung quanh.",
          "Chăm chỉ, trung thực: Cần cù trong học tập, trung thực trong làm bài và sinh hoạt lớp.",
          "Trách nhiệm: Có ý thức bảo vệ của công, giữ gìn vệ sinh chung và bảo vệ môi trường sống."
        ],
        integrations: {
          ai: item.integrationNotes?.includes("AI") ? "Tích hợp AI: Làm quen ứng dụng công nghệ trí tuệ nhân tạo hỗ trợ học tập (1.A1.1 / 4.C4.1)." : undefined,
          digitalCompetence: item.integrationNotes?.includes("NLS") ? "Tích hợp Năng lực số (CV 3456/BGDĐT-GDTH): 1.1.CB1a / 5.2.CB1a - Khám phá và sử dụng công nghệ số an toàn." : undefined,
          humanRights: item.integrationNotes?.includes("QCN") ? "Giáo dục quyền trẻ em (QCN): Tôn trọng sự khác biệt, bình đẳng và an toàn thân thể." : undefined,
          defense: item.integrationNotes?.includes("GDQPAN") ? "Lồng ghép GDQPAN (TT 08/2024): Tự hào truyền thống yêu nước, ý thức bảo vệ chủ quyền quê hương." : undefined,
          nutrition: item.integrationNotes?.includes("GDDD") ? "Giáo dục Dinh dưỡng học đường (GDDD): Lựa chọn thực phẩm lành mạnh, giữ gìn sức khỏe." : undefined,
          stem: item.integrationNotes?.includes("STEM") ? "Giáo dục STEM / Học thông qua chơi: Vận dụng kiến thức liên môn giải quyết vấn đề thực tiễn." : undefined,
        }
      },
      materials: {
        teacher: teacherMaterials,
        student: studentMaterials
      },
      activities: [
        {
          name: "1. Hoạt động Khởi động",
          objective: "Tạo tâm thế hứng khởi, kích hoạt kiến thức nền tảng và kết nối vào bài mới.",
          teacherActivity: act1Teacher,
          studentActivity: act1Student
        },
        {
          name: "2. Hoạt động Khám phá",
          objective: "Hình thành kiến thức mới và các kỹ năng trọng tâm của bài học.",
          teacherActivity: act2Teacher,
          studentActivity: act2Student
        },
        {
          name: "3. Hoạt động Luyện tập - Thực hành",
          objective: "Củng cố và rèn luyện kỹ năng qua các bài tập và tình huống vận dụng.",
          teacherActivity: act3Teacher,
          studentActivity: act3Student
        },
        {
          name: "4. Hoạt động Vận dụng",
          objective: "Khắc sâu kiến thức, liên hệ thực tiễn đời sống và củng cố nội dung tích hợp.",
          teacherActivity: act4Teacher,
          studentActivity: act4Student
        }
      ],
      postLessonAdjustment: "..........................................................................................................................................................................."
    });
  });

  // Luôn trả về danh sách KHBD được sắp xếp chuẩn xác theo trình tự thời gian
  return sortScheduleChronologically(plans);
}
