import { Grade, LessonActivity } from "../types";

/**
 * Detailed activities generator for Lesson Plans (KHBD)
 * Produces deep, realistic, classroom-ready activities with concrete steps:
 * - What the teacher specifically says, asks, demonstrates, and assigns
 * - What the student specifically does, reads, discusses, calculates, answers, and presents
 */

export interface DetailedLessonActivities {
  act1Teacher: string;
  act1Student: string;
  act2Teacher: string;
  act2Student: string;
  act3Teacher: string;
  act3Student: string;
  act4Teacher: string;
  act4Student: string;
  teacherMaterials?: string[];
  studentMaterials?: string[];
  specificCompetencies?: string[];
}

export function getDetailedActivitiesForLesson(
  subject: string,
  lessonTitle: string,
  grade: Grade,
  subSubject?: string,
  curriculumPeriod?: number | string
): DetailedLessonActivities {
  const subLower = (subject || "").toLowerCase();
  const titleLower = (lessonTitle || "").toLowerCase();
  const subSubLower = (subSubject || "").toLowerCase();

  // =========================================================================
  // 1. HOẠT ĐỘNG TRẢI NGHIỆM (HĐTN)
  // =========================================================================
  if (subLower.includes("hđtn") || subLower.includes("trải nghiệm")) {
    // SINH HOẠT DƯỚI CỜ (Thứ Hai)
    if (subSubLower.includes("dưới cờ") || titleLower.includes("dưới cờ") || titleLower.includes("chào cờ")) {
      return {
        specificCompetencies: [
          "Học sinh thực hiện nghiêm trang nghi lễ chào cờ đầu năm học mới. Thể hiện niềm tự hào và quyết tâm phấn đấu trong năm học cuối cấp tiểu học.",
          "Rèn luyện kỹ năng sinh hoạt tập thể, lắng nghe phát động chủ đề năm học mới của Liên đội và BGH nhà trường.",
          "Tự giác chuẩn bị trang phục chỉnh tề, thực hiện đúng nội quy chào cờ và tự tin giao lưu cùng thầy cô, bạn bè."
        ],
        teacherMaterials: [
          "Kế hoạch tuần, sổ chủ nhiệm, bài phát động thi đua, hệ thống âm thanh, cờ Tổ quốc."
        ],
        studentMaterials: [
          "Trang phục chỉnh tề (áo đồng phục trắng, khăn quàng đỏ, bảng tên), ghế ngồi theo quy định."
        ],
        act1Teacher: "Hướng dẫn học sinh tập hợp theo hàng lối ngay ngắn, chỉnh đốn trang phục. Phối hợp với Tổng phụ trách Đội điều hành nghi lễ Chào cờ toàn trường (Nghiêm - Chào cờ - Quốc ca - Đội ca). Lắng nghe BGH nhà trường phát biểu chào mừng năm học mới.",
        act1Student: "Đứng nghiêm trang hướng về Quốc kỳ, hát vang Quốc ca và Đội ca với tinh thần tự hào dân tộc. Chú ý lắng nghe thông điệp chào mừng năm học mới của Ban Giám hiệu.",
        act2Teacher: "Tổng phụ trách và GVCN điều hành chương trình giao lưu 'Chào năm học mới': Các tiết mục văn nghệ chào mừng của đội văn nghệ măng non; mời đại diện học sinh khối 5 phát biểu lời hứa quyết tâm năm học cuối cấp tiểu học.",
        act2Student: "Cổ vũ nồng nhiệt các tiết mục văn nghệ, chăm chú lắng nghe lời hứa quyết tâm và vỗ tay hưởng ứng phong trào thi đua học tốt - rèn luyện chăm.",
        act3Teacher: "GVCN phổ biến nhanh các yêu cầu nền nếp tuần 1: Ổn định sĩ số, nề nếp ra vào lớp, giữ gìn vệ sinh khuôn viên trường lớp, an toàn giao thông trước cổng trường và phát động phong trào 'Đôi bạn cùng tiến'.",
        act3Student: "Lắng nghe, tiếp thu chỉ tiêu thi đua của tổ/lớp và cam kết thực hiện nghiêm túc các quy định nề nếp của nhà trường.",
        act4Teacher: "Nhận xét ý thức chào cờ của học sinh toàn lớp. Hướng dẫn các em thu dọn ghế ngay ngắn và xếp hàng di chuyển trật tự về phòng học.",
        act4Student: "Cầm ghế ngay ngắn bằng hai tay, xếp hàng di chuyển trật tự theo hướng dẫn của giáo viên chủ nhiệm vào lớp học."
      };
    }

    // SINH HOẠT LỚP (Thứ Sáu)
    if (subSubLower.includes("lớp") || titleLower.includes("sinh hoạt lớp") || titleLower.includes("trưởng thành")) {
      return {
        specificCompetencies: [
          "Đánh giá được những ưu điểm và hạn chế trong các hoạt động học tập, rèn luyện nền nếp của bản thân và tập thể lớp trong tuần qua.",
          "Rèn luyện năng lực tự quản, tự tin phát biểu ý kiến, thống nhất phương hướng thi đua tuần mới.",
          "Tích cực tham gia sinh hoạt theo chủ đề: Bậc thang trưởng thành, xây dựng kế hoạch rèn luyện bản thân."
        ],
        teacherMaterials: [
          "Sổ chủ nhiệm, bảng tổng hợp điểm thi đua các tổ trong tuần, kế hoạch hoạt động tuần tiếp theo."
        ],
        studentMaterials: [
          "Sổ theo dõi thi đua của ban cán sự lớp, sổ ghi chép cá nhân, phiếu tự đánh giá rèn luyện."
        ],
        act1Teacher: "Bắt nhịp cho cả lớp hát vang bài hát tập thể vui nhộn 'Lớp chúng mình đoàn kết' hoặc chơi trò chơi nhỏ 'Tôi bảo' tạo không khí cởi mở, ấm áp cuối tuần.",
        act1Student: "Đồng thanh hát và vỗ tay theo nhịp bài hát, tạo tâm thế thoải mái, vui tươi, sẵn sàng tham gia buổi sinh hoạt.",
        act2Teacher: "Sơ kết tuần qua: Mời Ban cán sự lớp (Lớp trưởng, các tổ trưởng) báo cáo đánh giá hoạt động học tập, chuyên cần, vệ sinh và nền nếp của từng tổ. GVCN nhận xét chung, biểu dương các cá nhân và tổ đạt thành tích tốt, chỉ rõ những điểm còn tồn tại cần khắc phục.",
        act2Student: "Các tổ trưởng lần lượt đứng lên báo cáo trung thực kết quả tuần qua của tổ mình (số hoa điểm tốt, các bạn đi học muộn, vệ sinh...). Học sinh cả lớp lắng nghe, đóng góp ý kiến xây dựng và chúc mừng các bạn được khen thưởng.",
        act3Teacher: "Sinh hoạt theo chủ đề 'Bậc thang trưởng thành': Hướng dẫn học sinh thảo luận nhóm về các nấc thang rèn luyện trong năm học cuối cấp (tự giác học tập, giúp đỡ bạn bè, rèn luyện tác phong đội viên gương mẫu). Tổ chức cho các nhóm chia sẻ mục tiêu.",
        act3Student: "Tích cực thảo luận nhóm 4, chia sẻ những việc làm tốt đã thực hiện trong tuần, viết ra 2 mục tiêu rèn luyện cho tuần tới lên giấy ghi chú và dán lên cây mục tiêu của lớp.",
        act4Teacher: "Phương hướng tuần mới: Phổ biến các mục tiêu, nhiệm vụ trọng tâm tuần tới; phân công nhiệm vụ cụ thể cho từng tổ; nhắc nhở giữ an toàn giao thông và phòng chống tai nạn thương tích trong ngày nghỉ cuối tuần.",
        act4Student: "Ghi chép các nhiệm vụ cần thực hiện trong tuần mới vào sổ tay cá nhân, quyết tâm thi đua đạt nhiều bông hoa điểm tốt."
      };
    }
  }

  // =========================================================================
  // 2. TIẾNG VIỆT 5
  // =========================================================================
  if (subLower.includes("tiếng việt") || subLower.includes("tv")) {
    // A. BÀI 1: THANH ÂM CỦA GIÓ (TIẾT 1: ĐỌC)
    if (titleLower.includes("thanh âm của gió") && (titleLower.includes("đọc") || subSubLower.includes("đọc") || curriculumPeriod === 1 || curriculumPeriod === "1")) {
      return {
        specificCompetencies: [
          "Đọc đúng từ ngữ, câu, đoạn và toàn bộ bài đọc 'Thanh âm của gió'. Biết đọc diễn cảm, thể hiện được giọng đọc trong trẻo, giàu cảm xúc.",
          "Hiểu nội dung bài đọc: Cảm nhận vẻ đẹp phong phú, sinh động của thiên nhiên qua những âm thanh kỳ diệu của tiếng gió; cảm nhận tình yêu cuộc sống và sự gắn bó với quê hương của tác giả.",
          "Biết nhận diện và chia sẻ về các âm thanh tự nhiên quen thuộc xung quanh môi trường sống."
        ],
        teacherMaterials: [
          "SGK Tiếng Việt 5, bài giảng điện tử tương tác có tích hợp file âm thanh tiếng gió (vi vu, xào xạc, ào ào), tranh minh họa bài đọc.",
          "Phiếu học tập đọc hiểu, máy chiếu."
        ],
        studentMaterials: [
          "SGK Tiếng Việt 5, vở ghi, bút chì, thước kẻ."
        ],
        act1Teacher: "Cho học sinh nhắm mắt trong 30 giây, lắng nghe đoạn âm thanh tiếng gió thổi rì rào qua rặng tre và tiếng gió vi vu trên cánh đồng. Hỏi: 'Em vừa nghe thấy âm thanh gì? Âm thanh đó gợi cho em cảm xúc gì?' Dẫn dắt giới thiệu bài đọc 'Thanh âm của gió'.",
        act1Student: "Nhắm mắt lắng nghe, hào hứng đoán âm thanh: 'Đó là tiếng gió thổi'. Nêu cảm nhận: 'Âm thanh nghe rất êm dịu, mát mẻ, gợi nhớ cảnh đồng quê'. Mở SGK trang 10.",
        act2Teacher: "- Đọc mẫu toàn bài: giọng đọc thong thả, tha thiết, nhấn giọng ở các từ ngữ gợi âm thanh: vi vu, xào xạc, ào ào, réo rắt...\n- Hướng dẫn chia đoạn: 3 đoạn (Đoạn 1: Từ đầu đến 'giọng của gió'; Đoạn 2: Tiếp theo đến 'khúc nhạc đồng quê'; Đoạn 3: Phần còn lại).\n- Hướng dẫn đọc từ khó và câu dài: ngắt nghỉ đúng dấu câu và nhịp cảm xúc.\n- Giải nghĩa từ ngữ chú giải trong SGK: 'thanh âm', 'thiên nhiên', 'hòa tấu'.",
        act2Student: "- Lắng nghe GV đọc mẫu, theo dõi ngón tay chỉ vào từng dòng thơ/văn trong SGK.\n- 3 học sinh đọc nối tiếp 3 đoạn trước lớp. Cả lớp đọc thầm theo.\n- Luyện phát âm từ khó theo nhóm đôi: 'vi vu', 'xào xạc', 'réo rắt', 'hòa tấu'.\n- 1 học sinh đọc to phần giải nghĩa từ trong SGK.",
        act3Teacher: "- Hướng dẫn tìm hiểu bài:\n  + Câu 1: Gió đã tạo nên những âm thanh như thế nào qua các đồ vật và cảnh vật?\n  + Câu 2: Tìm những từ ngữ miêu tả tiếng gió thổi qua từng không gian khác nhau?\n  + Câu 3: Tác giả cảm nhận về tiếng gió như thế nào? Qua đó em thấy tình cảm của tác giả đối với quê hương ra sao?\n- Hướng dẫn đọc diễn cảm: Chọn đoạn 2 để luyện đọc diễn cảm, hướng dẫn ngắt giọng và nhấn mạnh các từ ngữ giàu hình ảnh.",
        act3Student: "- Đọc thầm đoạn 1 và 2, thảo luận nhóm 4 trả lời câu hỏi:\n  + Trả lời: Tiếng gió khi thì vi vu như tiếng sáo, khi thì xào xạc như tiếng lá rơi, khi thì dồn dập như khúc nhạc hòa tấu.\n  + Tác giả có tình yêu thiên nhiên sâu sắc, tâm hồn nhạy cảm và gắn bó tha thiết với quê hương.\n- Luyện đọc diễn cảm trong nhóm đôi, 2 đại diện nhóm thi đọc diễn cảm trước lớp. Cả lớp nhận xét, bình chọn.",
        act4Teacher: "Đặt câu hỏi liên hệ: 'Xung quanh nơi em ở hoặc trường học có những âm thanh thiên nhiên nào (tiếng chim, tiếng mưa, tiếng lá rơi)? Em hãy viết 1-2 câu miêu tả âm thanh đó.' Nhận xét tiết học, dặn dò chuẩn bị tiết học sau.",
        act4Student: "Viết nhanh 1-2 câu vào vở, 2 bạn đứng dậy đọc to: 'Buổi sớm mai, tiếng chim hót líu lo trên cành phượng làm sân trường thêm rộn rã.' Lắng nghe GV nhận xét và ghi nhớ nhiệm vụ về nhà."
      };
    }

    // B. BÀI 1: THANH ÂM CỦA GIÓ (TIẾT 2: LUYỆN TẬP VỀ DANH TỪ, ĐỘNG TỪ, TÍNH TỪ)
    if (titleLower.includes("danh từ") || titleLower.includes("tính từ") || titleLower.includes("động từ") || titleLower.includes("ltvc")) {
      return {
        specificCompetencies: [
          "Củng cố và khắc sâu kiến thức về danh từ (từ chỉ sự vật), động từ (từ chỉ hoạt động, trạng thái), tính từ (từ chỉ đặc điểm, tính chất).",
          "Biết nhận diện chính xác và phân loại đúng các danh từ, động từ, tính từ trong đoạn văn cho trước.",
          "Biết đặt câu đúng ngữ pháp, sử dụng từ ngữ chính xác, sinh động, phù hợp ngữ cảnh."
        ],
        teacherMaterials: [
          "Phiếu học tập nhóm, bảng phụ chia 3 cột (Danh từ - Động từ - Tính từ), thẻ từ nam châm.",
          "Slide trình chiếu các bài tập trong SGK."
        ],
        studentMaterials: [
          "SGK Tiếng Việt 5, vở bài tập Tiếng Việt 5, bút chì, bảng con."
        ],
        act1Teacher: "Tổ chức trò chơi 'Bắn tên thần tốc': GV hô 'Danh từ!', học sinh được gọi tên phải nêu ngay 1 từ chỉ sự vật quanh lớp (bàn ghế, thước kẻ, bảng đen); GV hô 'Động từ!' -> HS nêu từ chỉ hoạt động (đọc, viết, chạy); GV hô 'Tính từ!' -> HS nêu từ chỉ đặc điểm (chăm chỉ, ngoan ngoãn, đẹp). Chốt kiến thức, dẫn vào bài.",
        act1Student: "Hào hứng tham gia trò chơi, phản xạ nhanh khi được gọi tên. Nhắc lại nhanh khái niệm: Danh từ chỉ sự vật, động từ chỉ hoạt động/trạng thái, tính từ chỉ đặc điểm/tính chất.",
        act2Teacher: "- Trình chiếu đoạn văn ngữ liệu trong SGK lên màn hình.\n- Yêu cầu HS đọc thầm đoạn văn, làm việc cá nhân xác định các từ ngữ in đậm thuộc từ loại nào.\n- Phát bảng phụ cho 4 nhóm, yêu cầu phân loại các từ ngữ vào 3 cột: Danh từ - Động từ - Tính từ.\n- Quan sát các nhóm thảo luận, gợi ý các trường hợp từ ghép dễ gây nhầm lẫn.",
        act2Student: "- 1 học sinh đọc to đoạn văn trước lớp, cả lớp đọc thầm theo.\n- Làm việc cá nhân dùng bút chì đánh dấu chữ D (danh từ), Đ (động từ), T (tính từ) trên phiếu.\n- Thảo luận nhóm 4 xếp thẻ từ vào bảng nhóm: Danh từ (ngọn gió, dòng sông, cánh buồm), Động từ (thổi, bay, nâng, reo), Tính từ (vi vu, xanh biếc, dịu dàng).\n- Đại diện 2 nhóm lên gắn bảng phụ, trình bày kết quả.",
        act3Teacher: "- Hướng dẫn làm Bài tập 2 và 3 trong SGK:\n  + Bài 2: Tìm các tính từ miêu tả âm thanh, màu sắc trong đoạn văn.\n  + Bài 3: Đặt 1 câu có danh từ làm chủ ngữ, 1 câu có tính từ làm vị ngữ.\n- Gọi 2 học sinh lên bảng làm bài, hướng dẫn học sinh dưới lớp nhận xét và chuẩn hóa câu.",
        act3Student: "- Làm Bài tập 2 vào vở bài tập. 1 bạn đọc to kết quả: tính từ miêu tả âm thanh là 'thì thào, rầm rì', miêu tả màu sắc là 'vàng óng, xanh thẳm'.\n- Làm Bài tập 3 vào vở, đổi chéo vở kiểm tra cùng bạn ngồi cạnh.\n- 2 học sinh viết câu lên bảng lớp: 'Cánh đồng lúa chín vàng óng.' và 'Tiếng suối chảy róc rách.'",
        act4Teacher: "Tổ chức trò chơi 'Thử tài tiếp sức': Cho 3 tổ cử đại diện viết tiếp các từ ngữ thuộc 3 từ loại lên bảng theo chủ đề 'Mái trường'. Tuyên dương tổ làm nhanh và đúng nhất. Dặn dò ôn bài.",
        act4Student: "Mỗi tổ cử 3 bạn chạy lên bảng tiếp sức viết từ. Cả lớp cùng đếm và đối chiếu kết quả. Ghi nhớ bài học về từ loại."
      };
    }

    // C. BÀI 1: THANH ÂM CỦA GIÓ (TIẾT 3: VIẾT: TÌM HIỂU CÁCH VIẾT BÀI VĂN KỂ CHUYỆN SÁNG TẠO)
    if (titleLower.includes("kể chuyện sáng tạo") || (titleLower.includes("viết") && titleLower.includes("bài 1"))) {
      return {
        specificCompetencies: [
          "Nắm được cấu tạo và các cách sáng tạo khi viết bài văn kể chuyện (thay đổi ngôi kể, bổ sung lời thoại, miêu tả cảm xúc, tưởng tượng thêm chi tiết ngoại cảnh).",
          "Biết phân tích bài văn mẫu trong SGK để nhận diện các yếu tố sáng tạo của người viết.",
          "Bước đầu hình thành ý tưởng sáng tạo cho câu chuyện của bản thân, rèn kỹ năng diễn đạt mạch lạc, giàu hình ảnh."
        ],
        teacherMaterials: [
          "Bài văn mẫu kể chuyện sáng tạo in trên bảng phụ/slide, phiếu hướng dẫn lập dàn ý câu chuyện sáng tạo."
        ],
        studentMaterials: [
          "SGK Tiếng Việt 5, vở tập làm văn, bút màu ghi chú."
        ],
        act1Teacher: "Chiếu hình ảnh câu chuyện 'Cậu bé Tích Chu' hoặc 'Rùa và Thỏ'. Hỏi: 'Nếu em đóng vai chú Rùa hoặc chú Thỏ để tự kể lại câu chuyện thì câu chuyện sẽ thay đổi như thế nào?' HS phát biểu -> GV dẫn dắt vào bài mới: Kể chuyện sáng tạo.",
        act1Student: "Hào hứng chia sẻ ý tưởng: 'Nếu đóng vai chú Rùa, em sẽ kể lại cảm giác lúc thấy Thỏ ngủ quên và sự cố gắng không bỏ cuộc của mình.' Lắng nghe GV giới thiệu bài học.",
        act2Teacher: "- Yêu cầu 1 học sinh đọc bài văn mẫu trong SGK trang 14.\n- Đặt câu hỏi định hướng tìm hiểu:\n  + Câu chuyện được kể theo ngôi thứ mấy? Người kể xưng là gì?\n  + Người viết đã sáng tạo thêm những chi tiết nào so với câu chuyện gốc (lời thoại nội tâm, cảnh vật thiên nhiên, kết thúc bất ngờ)?\n  + Những chi tiết sáng tạo đó làm cho câu chuyện hấp dẫn hơn ra sao?",
        act2Student: "- 1 học sinh đọc to bài văn mẫu, cả lớp lắng nghe và dùng bút chì gạch chân những chi tiết sáng tạo.\n- Thảo luận nhóm đôi trả lời câu hỏi: Bài văn được kể theo ngôi thứ nhất, xưng 'tôi'; tác giả đã tưởng tượng thêm suy nghĩ, cảm xúc hồi hộp của nhân vật và miêu tả thêm cảnh ánh trăng đêm.\n- Đại diện phát biểu, cả lớp rút ra kết luận về các cách kể chuyện sáng tạo.",
        act3Teacher: "- Hướng dẫn học sinh thực hành lập dàn ý nhanh cho một câu chuyện quen thuộc mà em chọn đóng vai nhân vật để kể lại:\n  + Mở bài: Giới thiệu nhân vật em đóng vai và tình huống bắt đầu câu chuyện.\n  + Thân bài: Kể diễn biến sự việc, lồng ghép cảm xúc, lời thoại và chi tiết tưởng tượng.\n  + Kết bài: Kết thúc câu chuyện và bài học rút ra.\n- Đi từng bàn quan sát, gợi ý chi tiết sáng tạo cho học sinh.",
        act3Student: "- Lựa chọn câu chuyện em yêu thích (Sự tích hoa cúc trắng, Tấm Cám, hoặc câu chuyện về muông thú).\n- Thực hành lập dàn ý vắn tắt vào vở bài tập cá nhân.\n- Đổi vở cho bạn bên cạnh đọc, góp ý về tính hợp lí và mức độ hấp dẫn của chi tiết sáng tạo.",
        act4Teacher: "Mời 2 học sinh trình bày dàn ý câu chuyện sáng tạo của mình trước lớp. Hướng dẫn cả lớp nhận xét, khen ngợi những ý tưởng độc đáo, bất ngờ. Dặn dò về nhà chuẩn bị viết bài hoàn chỉnh.",
        act4Student: "2 học sinh tự tin đứng trước lớp chia sẻ dàn ý. Các bạn chăm chú lắng nghe, đặt câu hỏi giao lưu và ghi nhớ các gợi ý hay để hoàn thiện bài viết của mình."
      };
    }

    // D. BÀI 2: CÁNH ĐỒNG HOA (ĐỌC)
    if (titleLower.includes("cánh đồng hoa") && (titleLower.includes("đọc") || curriculumPeriod === 4 || curriculumPeriod === "4")) {
      return {
        specificCompetencies: [
          "Đọc đúng và diễn cảm bài 'Cánh đồng hoa'. Thể hiện được giọng đọc tươi vui, giàu hình ảnh và cảm xúc yêu thiên nhiên.",
          "Hiểu nội dung bài đọc: Cánh đồng hoa rực rỡ sắc màu không chỉ mang lại vẻ đẹp cho quê hương mà còn là kết tinh của mồ hôi, công sức lao động của người nông dân; giáo dục ý thức trân trọng thành quả lao động và bảo vệ môi trường.",
          "Rèn luyện kỹ năng đọc hiểu văn bản nghệ thuật và liên hệ thực tế."
        ],
        teacherMaterials: [
          "SGK Tiếng Việt 5, tranh ảnh và video clip ngắn về cánh đồng hoa rực rỡ sắc màu (hoa cúc, hoa hướng dương, hoa cải).",
          "Hệ thống câu hỏi đọc hiểu trên máy chiếu."
        ],
        studentMaterials: [
          "SGK Tiếng Việt 5, vở ghi, bút dạ quang."
        ],
        act1Teacher: "Mở đoạn video ngắn 45 giây về cánh đồng hoa bạt ngàn trong nắng sớm. Đặt câu hỏi: 'Bức tranh cánh đồng hoa mang đến cho em cảm giác gì? Em có muốn một lần được dạo bước giữa cánh đồng hoa như vậy không?' Dẫn dắt vào bài 'Cánh đồng hoa'.",
        act1Student: "Quan sát video đầy thích thú. Trả lời câu hỏi: 'Em thấy cánh đồng hoa rất đẹp, rực rỡ và bình yên.' Mở SGK theo dõi bài học.",
        act2Teacher: "- Đọc mẫu toàn bài với giọng tươi vui, ấm áp.\n- Hướng dẫn học sinh chia đoạn (3 đoạn).\n- Yêu cầu đọc nối tiếp từng đoạn, uốn nắn cách phát âm các từ ngữ: 'rực rỡ', 'bát ngát', 'thoang thoảng', 'trĩu nặng'.\n- Giải nghĩa từ mới: 'bạt ngát', 'hương sắc', 'thổ nhưỡng'.",
        act2Student: "- Lắng nghe GV đọc mẫu, theo dõi từng câu chữ.\n- 3 học sinh đọc nối tiếp 3 đoạn trước lớp. Cả lớp nhận xét giọng đọc của bạn.\n- Luyện đọc nhóm đôi, sửa lỗi phát âm cho nhau.\n- Đọc phần chú giải cuối bài để hiểu rõ nghĩa các từ khó.",
        act3Teacher: "- Tổ chức tìm hiểu bài:\n  + Câu 1: Cánh đồng hoa vào buổi sáng sớm hiện lên với những màu sắc và hương thơm như thế nào?\n  + Câu 2: Những người nông dân đã chăm sóc cánh đồng hoa ra sao để hoa nở đẹp như vậy?\n  + Câu 3: Tình cảm của các bạn nhỏ đối với cánh đồng hoa được thể hiện qua những chi tiết nào?\n- Hướng dẫn học sinh đọc diễn cảm đoạn văn tả vẻ đẹp của hoa lúc bình minh.",
        act3Student: "- Đọc thầm đoạn 1 và 2, thảo luận nhóm 4 để trả lời câu hỏi:\n  + Cánh đồng hoa rực rỡ sắc vàng của hoa cúc, đỏ của hoa hồng, hương thơm thoang thoảng bay xa.\n  + Người nông dân đã cần cù tưới nước, bắt sâu, vun xới từng gốc cây từ lúc còn là mầm non.\n- Đại diện nhóm phát biểu, các nhóm khác bổ sung.\n- Luyện đọc diễn cảm theo cặp, thi đua đọc diễn cảm trước lớp.",
        act4Teacher: "Đặt câu hỏi giáo dục môi trường: 'Em cần làm gì khi đến tham quan các vườn hoa, công viên để giữ cho hoa luôn tươi đẹp?' Nhận xét tiết học, biểu dương các em đọc hay.",
        act4Student: "Tự tin phát biểu: 'Không được giẫm lên luống hoa, không hái hoa bẻ cành, không xả rác bừa bãi.' Ghi nhớ bài học bảo vệ vẻ đẹp thiên nhiên."
      };
    }

    // E. TIẾNG VIỆT 5: ĐỌC MỞ RỘNG (Tuần 1)
    if (titleLower.includes("đọc mở rộng")) {
      return {
        specificCompetencies: [
          "Tìm đọc được câu chuyện, bài thơ hoặc bài văn viết về chủ đề vẻ đẹp quê hương đất nước, tình cảm gia đình hoặc mái trường mến yêu.",
          "Biết ghi chép vào Phiếu đọc sách những thông tin quan trọng: tên bài đọc, tác giả, hình ảnh đẹp, câu văn yêu thích và cảm nghĩ của bản thân.",
          "Tự tin chia sẻ bài đọc với bạn bè, lan tỏa thói quen đọc sách mỗi ngày."
        ],
        teacherMaterials: [
          "Một số cuốn sách thiếu nhi hay, bài thơ chọn lọc về quê hương; mẫu Phiếu đọc sách in sẵn cho học sinh."
        ],
        studentMaterials: [
          "Sách truyện, báo thiếu nhi đã chuẩn bị trước ở nhà hoặc mượn ở thư viện trường, Phiếu đọc sách cá nhân."
        ],
        act1Teacher: "Cho học sinh nghe giai điệu bài hát 'Em yêu trường em'. Đố học sinh chia sẻ tên cuốn sách hoặc bài thơ gần đây nhất mà em đã đọc viết về quê hương, trường lớp.",
        act1Student: "Hào hứng giơ tay chia sẻ: 'Em đã đọc bài thơ Hạt gạo làng ta của tác giả Trần Đăng Khoa.'",
        act2Teacher: "- Hướng dẫn học sinh mở tài liệu/sách đã chuẩn bị.\n- Nhắc lại yêu cầu đọc mở rộng: Đọc thầm kĩ văn bản, dùng bút chì đánh dấu những câu văn/câu thơ có hình ảnh so sánh, nhân hóa đẹp mắt.\n- Hướng dẫn hoàn thiện Phiếu đọc sách với các mục rõ ràng: Tên tác phẩm, Tác giả, Ngày đọc, Chi tiết ấn tượng nhất, Bài học rút ra.",
        act2Student: "- Đọc thầm bài thơ/câu chuyện cá nhân trong 10 phút.\n- Cẩn thận ghi chép các thông tin vào Phiếu đọc sách:\n  + Ghi lại 1-2 câu văn hoặc khổ thơ em yêu thích nhất.\n  + Ghi cảm xúc của em về vẻ đẹp quê hương hoặc con người trong bài.",
        act3Teacher: "- Chia lớp thành các nhóm 4, yêu cầu học sinh lần lượt giới thiệu bài đọc của mình cho các bạn trong nhóm nghe, đọc diễn cảm đoạn văn/câu thơ mình thích nhất.\n- Quan sát, khích lệ các em học sinh nhút nhát tham gia phát biểu.",
        act3Student: "- Lần lượt từng bạn trong nhóm cầm cuốn sách/phiếu đọc sách, đọc to đoạn văn tâm đắc cho các bạn nghe và giải thích vì sao mình thích.\n- Các thành viên trong nhóm lắng nghe, nhận xét và ghi tên các cuốn sách hay vào sổ tay của mình để tìm đọc sau.",
        act4Teacher: "Mời đại diện 2 nhóm lên 'Góc chia sẻ văn học' của lớp để giới thiệu tác phẩm trước toàn thể các bạn. Tuyên dương tinh thần đọc sách của lớp.",
        act4Student: "2 bạn tự tin đứng trước lớp giới thiệu cuốn sách hay và đọc diễn cảm một đoạn ngắn. Cả lớp vỗ tay tán thưởng và cam kết duy trì việc đọc sách 15 phút mỗi ngày."
      };
    }

    // F. TĂNG CƯỜNG TIẾNG VIỆT (TCTV)
    if (titleLower.includes("tăng cường") || subLower.includes("tăng cường") || titleLower.includes("củng cố rèn chữ")) {
      return {
        specificCompetencies: [
          "Củng cố và rèn luyện kỹ năng viết đúng chính tả, viết chữ đẹp, giữ đúng khoảng cách giữa các con chữ và dòng kẻ.",
          "Ôn tập và làm thành thạo các bài tập về từ loại (danh từ, động từ, tính từ) và câu kể theo chuẩn kiến thức tuần 1.",
          "Rèn tính cẩn thận, kiên nhẫn, giữ gìn vở sạch chữ đẹp."
        ],
        teacherMaterials: [
          "Bài tập rèn chữ mẫu trên bảng phụ/slide, phiếu bài tập bổ trợ rèn từ và câu tuần 1."
        ],
        studentMaterials: [
          "Vở luyện viết / Vở thực hành Tiếng Việt, bút mực, thước kẻ."
        ],
        act1Teacher: "Cho học sinh quan sát bài viết chữ mẫu đẹp của một bạn học sinh đạt giải 'Vở sạch chữ đẹp'. Nhắc lại tư thế ngồi viết và cách cầm bút chuẩn.",
        act1Student: "Quan sát bài viết mẫu, điều chỉnh lại tư thế ngồi ngay ngắn (lưng thẳng, ngực không tì vào bàn, khoảng cách mắt 25-30cm), cầm bút bằng 3 ngón tay.",
        act2Teacher: "- Trình chiếu bài tập rèn từ và câu: Yêu cầu phân biệt các cặp từ đồng âm, từ ngữ dễ lẫn phụ âm đầu (l/n, s/x, tr/ch).\n- Hướng dẫn HS tìm nhanh từ ngữ đúng chính tả để điền vào chỗ trống trong đoạn văn ngắn.",
        act2Student: "- Làm việc cá nhân trên phiếu bài tập, lựa chọn từ ngữ chuẩn xác điền vào chỗ trống.\n- Đổi phiếu cùng bạn bàn bên kiểm tra chéo, đọc to các từ ngữ đúng.",
        act3Teacher: "- Hướng dẫn học sinh viết đoạn văn chính tả 4-5 dòng vào vở luyện viết. Lưu ý các chữ cái viết hoa đầu dòng, chữ hoa tên riêng và dấu chấm câu.\n- Đi từng bàn uốn nắn nét chữ cho các em viết chưa thẳng hàng.",
        act3Student: "- Nắn nót viết từng dòng chữ vào vở thật cẩn thận, giữ vở sạch, không tẩy xóa.\n- Sau khi viết xong, tự soát lại lỗi chính tả bằng bút chì.",
        act4Teacher: "Chấm nhanh 5-7 bài viết tại lớp, nhận xét biểu dương những bài viết tiến bộ, chữ viết đều nét và sạch đẹp. Dặn dò luyện viết thêm ở nhà.",
        act4Student: "Lắng nghe cô giáo nhận xét, quan sát những nét chữ đẹp để học tập và rút kinh nghiệm cho bài viết sau."
      };
    }
  }

  // =========================================================================
  // 3. TOÁN 5
  // =========================================================================
  if (subLower.includes("toán")) {
    // A. BÀI 1: ÔN TẬP SỐ TỰ NHIÊN (TIẾT 1 & TIẾT 2)
    if (titleLower.includes("ôn tập số tự nhiên")) {
      const isTiet2 = titleLower.includes("tiết 2") || curriculumPeriod === 2 || curriculumPeriod === "2";
      if (!isTiet2) {
        return {
          specificCompetencies: [
            "Ôn tập, củng cố cách đọc, viết, so sánh các số tự nhiên trong phạm vi lớp triệu; nắm vững giá trị theo vị trí của từng chữ số trong một số tự nhiên.",
            "Biết sắp xếp các số tự nhiên theo thứ tự từ bé đến lớn và ngược lại.",
            "Rèn luyện kỹ năng tính toán nhẩm nhanh, tư duy logic và tính cẩn thận, chính xác."
          ],
          teacherMaterials: [
            "Bảng các hàng và lớp (hàng đơn vị, chục, trăm - lớp đơn vị; hàng nghìn, chục nghìn, trăm nghìn - lớp nghìn; hàng triệu, chục triệu, trăm triệu - lớp triệu).",
            "Bộ thẻ số từ 0 đến 9, slide trình chiếu bài tập."
          ],
          studentMaterials: [
            "SGK Toán 5, vở bài tập Toán, bảng con, phấn/bút dạ."
          ],
          act1Teacher: "Tổ chức trò chơi 'Đố bạn đọc đúng': GV viết lên bảng số '85 412 309'. Gọi học sinh đọc số và nêu chữ số hàng chục nghìn là chữ số nào. Khen ngợi và dẫn dắt vào bài học.",
          act1Student: "Xung phong trả lời nhanh: 'Tám mươi lăm triệu bốn trăm mười hai nghìn ba trăm linh chín'. Chữ số 1 thuộc hàng chục nghìn. Cả lớp vỗ tay, mở SGK trang 6.",
          act2Teacher: "- Treo bảng các hàng và lớp lên bảng. Yêu cầu học sinh nhắc lại cấu trúc 3 lớp đã học: Lớp đơn vị, lớp nghìn, lớp triệu.\n- Đưa ra ví dụ số 425 618 390: Yêu cầu phân tích giá trị của từng chữ số: Chữ số 4 có giá trị là 400 000 000, chữ số 2 có giá trị là 20 000 000...\n- Hướng dẫn quy tắc so sánh hai số tự nhiên: Đếm số chữ số trước, nếu bằng nhau thì so sánh từng cặp chữ số ở cùng hàng từ trái sang phải.",
          act2Student: "- Lắng nghe, nhắc lại đồng thanh tên các hàng thuộc từng lớp.\n- 2 học sinh lên bảng gắn thẻ số vào đúng cột hàng và lớp.\n- Trả lời câu hỏi phân tích giá trị chữ số.\n- Nêu lại quy tắc so sánh số tự nhiên và lấy ví dụ minh họa.",
          act3Teacher: "- Hướng dẫn làm bài tập trong SGK:\n  + Bài 1: Đọc và viết số tự nhiên theo mẫu (làm bảng con).\n  + Bài 2: Viết số thành tổng các triệu, trăm nghìn, chục nghìn... (làm vào vở).\n  + Bài 3: So sánh và xếp thứ tự các số tự nhiên (làm vào vở).\n- Quan sát, hỗ trợ các em học sinh còn nhầm lẫn giữa hàng và lớp.",
          act3Student: "- Bài 1: Viết số vào bảng con theo lời đọc của GV, giơ bảng đồng loạt khi có hiệu lệnh. Kiểm tra và sửa sai.\n- Bài 2: Làm vào vở cá nhân: Ví dụ: 543 210 = 500 000 + 40 000 + 3 000 + 200 + 10. 1 bạn lên bảng làm mẫu.\n- Bài 3: So sánh các số, xếp theo thứ tự từ bé đến lớn vào vở, đổi vở chấm chéo cùng bạn bên cạnh.",
          act4Teacher: "Đưa ra bài toán thực tế: 'Dân số của tỉnh A là 1 245 800 người, tỉnh B là 1 305 000 người. Hỏi tỉnh nào có dân số đông hơn?' Nhận xét tiết học, dặn dò bài tập về nhà.",
          act4Student: "Tính toán nhẩm nhanh: Tỉnh B có dân số đông hơn tỉnh A (1 305 000 > 1 245 800). Ghi nhớ kiến thức và chuẩn bị cho tiết 2."
        };
      } else {
        return {
          specificCompetencies: [
            "Tiếp tục củng cố kiến thức về số tự nhiên: làm tròn số tự nhiên đến hàng chục, hàng trăm, hàng nghìn, hàng chục nghìn, hàng trăm nghìn.",
            "Vận dụng kiến thức về số tự nhiên để giải các bài toán thực tế liên quan đến thống kê số liệu, đo lường và đời sống.",
            "Phát triển năng lực giải quyết vấn đề toán học và tư duy ước lượng nhanh."
          ],
          teacherMaterials: [
            "Slide bài giảng minh họa quy tắc làm tròn số trên trục số, bảng phụ bài tập tình huống thực tế."
          ],
          studentMaterials: [
            "SGK Toán 5, vở bài tập Toán, bảng con, bút chì."
          ],
          act1Teacher: "Trò chơi 'Ai nhanh hơn': GV chiếu các số và hỏi quy tắc làm tròn: 'Nếu chữ số sau hàng làm tròn nhỏ hơn 5 thì ta làm gì? Nếu từ 5 trở lên thì làm gì?' HS trả lời nhanh.",
          act1Student: "Đứng dậy trả lời dõng dạc: Nhỏ hơn 5 thì giữ nguyên chữ số hàng làm tròn và thay các chữ số phía sau bằng chữ số 0; từ 5 trở lên thì cộng thêm 1 vào hàng làm tròn.",
          act2Teacher: "- Hướng dẫn quy tắc làm tròn số cụ thể qua các ví dụ thực tế:\n  + Làm tròn số 78 436 đến hàng nghìn -> được 78 000.\n  + Làm tròn số 126 850 đến hàng chục nghìn -> được 130 000.\n- Vẽ trục số lên bảng để học sinh thấy trực quan khoảng cách gần hơn với mốc tròn nghìn/tròn chục nghìn.",
          act2Student: "- Quan sát trục số trên bảng, nhận diện lý do làm tròn số.\n- Làm việc nhóm đôi, thảo luận làm tròn 3 số tự nhiên trong SGK và giải thích lí do lựa chọn.",
          act3Teacher: "- Giao bài tập trong SGK:\n  + Bài 1: Làm tròn các số liệu thống kê dân số các thành phố đến hàng trăm nghìn.\n  + Bài 2: Điền số thích hợp vào ô trống trên tia số.\n  + Bài 3: Bài toán giải có lời văn: Ước lượng quãng đường từ Hà Nội đến các tỉnh lân cận.\n- Đi kiểm tra, hỗ trợ học sinh giải toán có lời văn.",
          act3Student: "- Bài 1: Làm vào bảng con, 2 học sinh lên bảng điền kết quả làm tròn.\n- Bài 2 & 3: Tóm tắt bài toán vào vở, trình bày bài giải chi tiết:\n  Quãng đường ước lượng làm tròn đến hàng chục km là 120 km. Đáp số: 120 km.\n- Đổi chéo vở nhận xét bài giải của bạn.",
          act4Teacher: "Đặt câu hỏi ứng dụng: 'Khi đi siêu thị mẹ mua hết 198 000 đồng, mẹ thường đưa tờ 200 000 đồng. Việc làm tròn số giúp ích gì cho đời sống hàng ngày?' Tổng kết tiết học.",
          act4Student: "Trả lời: 'Làm tròn số giúp tính toán nhanh chóng, thuận tiện trong giao dịch mua bán hàng ngày.' Ghi nhớ dặn dò của thầy cô."
        };
      }
    }

    // B. BÀI 2: ÔN TẬP CÁC PHÉP TÍNH VỚI SỐ TỰ NHIÊN (TIẾT 1 & TIẾT 2)
    if (titleLower.includes("các phép tính với số tự nhiên") || titleLower.includes("phép tính")) {
      const isTiet2 = titleLower.includes("tiết 2") || curriculumPeriod === 4 || curriculumPeriod === "4";
      if (!isTiet2) {
        return {
          specificCompetencies: [
            "Củng cố và thực hiện thành thạo phép cộng, phép trừ các số tự nhiên (có nhớ không quá ba lượt và không liên tiếp).",
            "Nắm vững các tính chất của phép cộng: tính chất giao hoán, tính chất kết hợp, cộng với số 0 để tính toán bằng cách thuận tiện nhất.",
            "Giải được các bài toán thực tế có liên quan đến phép cộng, phép trừ số tự nhiên."
          ],
          teacherMaterials: [
            "Bảng phụ ghi các tính chất giao hoán, kết hợp của phép cộng; slide bài tập tính giá trị biểu thức."
          ],
          studentMaterials: [
            "SGK Toán 5, vở bài tập Toán, bảng con, nháp."
          ],
          act1Teacher: "Khởi động trò chơi 'Tính nhanh chuyền bóng': GV nêu phép tính nhẩm: 450 + 550; 1000 - 350. Học sinh bắt bóng trả lời nhanh và chuyền cho bạn khác.",
          act1Student: "Bắt bóng và tính nhẩm nhanh: 450 + 550 = 1000; 1000 - 350 = 650. Không khí lớp học sôi nổi, sẵn sàng vào bài mới.",
          act2Teacher: "- Yêu cầu 2 học sinh lên bảng đặt tính rồi tính:\n  a) 48 352 + 26 419\n  b) 75 820 - 38 465\n- Hướng dẫn học sinh nhận xét cách đặt tính: Các chữ số ở cùng một hàng phải thẳng cột với nhau, thực hiện từ phải sang trái, lưu ý thêm số nhớ vào hàng tiếp theo.\n- Nhắc lại công thức tính thuận tiện: a + b = b + a; (a + b) + c = a + (b + c).",
          act2Student: "- 2 học sinh thực hiện trên bảng lớp, cả lớp làm vào nháp:\n  a) Kết quả: 74 771\n  b) Kết quả: 37 355\n- Học sinh dưới lớp nhận xét bước đặt tính thẳng cột và các lần cộng/trừ có nhớ.\n- Nhắc lại tính chất kết hợp để nhóm các số tròn chục, tròn trăm khi tính nhanh.",
          act3Teacher: "- Giao nhiệm vụ luyện tập:\n  + Bài 1: Đặt tính rồi tính (làm vào bảng con).\n  + Bài 2: Tính bằng cách thuận tiện nhất: 2 450 + 1 980 + 7 550 + 8 020 (làm vào vở).\n  + Bài 3: Bài toán giải về sản lượng thu hoạch lúa của hai thửa ruộng.\n- Quan sát, uốn nắn những em tính toán chậm, hướng dẫn tóm tắt bài toán.",
          act3Student: "- Bài 1: Thực hiện đặt tính trên bảng con, kiểm tra kết quả cùng bạn.\n- Bài 2: Làm vào vở: Nhóm (2 450 + 7 550) + (1 980 + 8 020) = 10 000 + 10 000 = 20 000. 1 bạn lên bảng trình bày.\n- Bài 3: Tóm tắt bài toán bằng sơ đồ đoạn thẳng, viết bài giải và đáp số đầy đủ vào vở.",
          act4Teacher: "Đố vui toán học: 'Tổng của hai số là 100, hiệu của hai số là 20. Tìm hai số đó?' Hướng dẫn nhanh cách tìm hai số khi biết tổng và hiệu.",
          act4Student: "Suy nghĩ và tính nhanh: Số lớn = (100 + 20) : 2 = 60; Số bé = 60 - 20 = 40. Thích thú với mẹo tính nhanh."
        };
      } else {
        return {
          specificCompetencies: [
            "Củng cố và thực hiện thành thạo kỹ năng nhân, chia số tự nhiên (nhân với số có hai chữ số, chia cho số có hai chữ số).",
            "Vận dụng tính chất giao hoán, kết hợp của phép nhân, nhân một số với một tổng/hiệu để tính bằng cách thuận tiện nhất.",
            "Giải bài toán có lời văn liên quan đến phép nhân, phép chia trong thực tế đời sống sản xuất."
          ],
          teacherMaterials: [
            "Slide trình chiếu quy trình đặt tính phép nhân và phép chia cho số có 2 chữ số, phiếu bài tập nhóm."
          ],
          studentMaterials: [
            "SGK Toán 5, vở bài tập Toán, bảng con, nháp."
          ],
          act1Teacher: "Trò chơi 'Bảng cửu chương siêu tốc': GV đọc bất kì một phép nhân trong bảng cửu chương (7 x 8, 9 x 6, 8 x 9), chỉ định học sinh trả lời nhanh trong vòng 2 giây.",
          act1Student: "Tập trung cao độ, trả lời chính xác: 7 x 8 = 56; 9 x 6 = 54; 8 x 9 = 72. Sẵn sàng vào bài học phép nhân, phép chia.",
          act2Teacher: "- Yêu cầu 2 học sinh lên bảng đặt tính rồi tính:\n  a) 345 x 24\n  b) 8 460 : 36\n- Hướng dẫn học sinh phân tích các tích riêng trong phép nhân và cách ước lượng thương trong từng lượt chia của phép chia cho số có hai chữ số.\n- Chú ý nhắc nhở các lỗi sai thường gặp: Viết tích riêng thứ hai không lùi sang trái một cột; ước lượng thương quá lớn hoặc quá bé.",
          act2Student: "- 2 học sinh lên bảng thực hiện đặt tính, trình bày rõ các bước.\n  a) Tích riêng 1 là 1 380, tích riêng 2 lùi 1 cột là 690 -> Tổng là 8 280.\n  b) 84 : 36 được 2, dư 12; hạ 6 được 126 : 36 được 3, dư 18; hạ 0 được 180 : 36 được 5, dư 0 -> Thương là 235.\n- Học sinh dưới lớp theo dõi, đối chiếu kết quả với nháp cá nhân.",
          act3Teacher: "- Hướng dẫn làm các bài tập trong SGK:\n  + Bài 1: Đặt tính rồi tính (bảng con).\n  + Bài 2: Tính giá trị biểu thức: 125 x 4 x 25 x 8 (áp dụng tính chất giao hoán, kết hợp).\n  + Bài 3: Bài toán giải: Một ô tô chở hàng trong 12 chuyến, mỗi chuyến chở được 1 250 kg. Hỏi tất cả chở được bao nhiêu tấn hàng?\n- Quan sát, nhắc học sinh đổi đơn vị đo từ kg sang tấn ở bước cuối.",
          act3Student: "- Thực hiện Bài 1 trên bảng con.\n- Bài 2 làm vào vở: (125 x 8) x (4 x 25) = 1 000 x 100 = 100 000.\n- Bài 3: Đọc kĩ đề, tóm tắt và làm bài giải vào vở:\n  Tất cả chở được số ki-lô-gam là: 1 250 x 12 = 15 000 (kg).\n  Đổi 15 000 kg = 15 tấn. Đáp số: 15 tấn hàng.",
          act4Teacher: "Tổ chức đố vui: 'Một người mua 5 quyển vở cùng loại hết 50 000 đồng. Hỏi mua 15 quyển vở như thế hết bao nhiêu tiền?' Hướng dẫn cách rút về đơn vị hoặc tìm tỉ số.",
          act4Student: "Tính nhanh theo 2 cách: 15 quyển gấp 3 lần 5 quyển -> 50 000 x 3 = 150 000 đồng. Tự tin trả lời trước lớp."
        };
      }
    }

    // C. BÀI 3: ÔN TẬP PHÂN SỐ (TIẾT 1)
    if (titleLower.includes("ôn tập phân số") || titleLower.includes("phân số")) {
      return {
        specificCompetencies: [
          "Củng cố khái niệm về phân số; ý nghĩa của tử số và mẫu số; phân số chỉ phần đã lấy đi hoặc phần còn lại của một đơn vị.",
          "Nắm vững tính chất cơ bản của phân số; biết cách rút gọn phân số và quy đồng mẫu số hai phân số đơn giản.",
          "Biết so sánh hai phân số cùng mẫu số và khác mẫu số; nhận biết phân số bé hơn 1, bằng 1 và lớn hơn 1."
        ],
        teacherMaterials: [
          "Bộ đồ dùng thực hành phân số lớp 5 (các hình tròn, hình vuông chia phần bằng nhau), slide minh họa phân số trực quan."
        ],
        studentMaterials: [
          "SGK Toán 5, vở bài tập Toán, bảng con, bút màu, nháp."
        ],
        act1Teacher: "Chiếu hình ảnh một chiếc bánh pizza được chia đều thành 8 miếng, bạn Nam đã ăn 3 miếng. Hỏi: 'Phân số chỉ số phần bánh bạn Nam đã ăn là bao nhiêu? Số phần bánh còn lại là bao nhiêu?' Dẫn dắt vào bài Ôn tập phân số.",
        act1Student: "Quan sát hình ảnh bánh pizza, trả lời nhanh: 'Bạn Nam đã ăn 3/8 chiếc bánh, số phần bánh còn lại là 5/8 chiếc bánh.' Mở SGK trang 12.",
        act2Teacher: "- Nhắc lại kiến thức cơ bản về phân số a/b (b khác 0): a là tử số (chỉ số phần lấy đi), b là mẫu số (chỉ số phần bằng nhau được chia ra).\n- Nêu tính chất cơ bản của phân số: Nhân hoặc chia cả tử số và mẫu số với cùng một số tự nhiên khác 0 thì được phân số mới bằng phân số đã cho.\n- Ôn lại cách rút gọn phân số (chia cho ước chung lớn nhất) và quy đồng mẫu số (tìm mẫu số chung nhỏ nhất).",
        act2Student: "- Lắng nghe, nhắc lại đồng thanh tính chất cơ bản của phân số.\n- 2 học sinh lên bảng thực hành rút gọn phân số: 12/18 = (12:6)/(18:6) = 2/3 và quy đồng mẫu số hai phân số: 2/5 và 3/4.\n- Cả lớp quan sát, nhận xét bước quy đồng mẫu số chung là 20: 2/5 = 8/20; 3/4 = 15/20.",
        act3Teacher: "- Hướng dẫn làm bài tập trong SGK:\n  + Bài 1: Viết và đọc phân số tương ứng với hình vẽ (làm bảng con).\n  + Bài 2: Rút gọn các phân số về phân số tối giản (làm vào vở).\n  + Bài 3: So sánh các cặp phân số: 3/7 và 5/7; 2/3 và 3/4; 5/4 và 1.\n- Đi kiểm tra, hỗ trợ học sinh cách so sánh phân số với 1.",
        act3Student: "- Bài 1: Viết phân số vào bảng con theo hiệu lệnh của GV.\n- Bài 2: Làm vào vở, 3 bạn lên bảng làm 3 câu rút gọn: 15/25 = 3/5; 18/24 = 3/4; 36/48 = 3/4.\n- Bài 3: Làm vào vở: 3/7 < 5/7 (cùng mẫu, tử nhỏ hơn thì bé hơn); 2/3 = 8/12 < 3/4 = 9/12; 5/4 > 1 (tử số lớn hơn mẫu số).",
        act4Teacher: "Tổ chức trò chơi 'Đố bạn tìm phân số bằng nhau': GV giơ thẻ 1/2, yêu cầu HS tìm các phân số bằng 1/2 trong vòng 10 giây (2/4, 3/6, 4/8, 5/10...). Nhận xét tiết học.",
        act4Student: "Hào hứng xung phong giơ tay đọc to các phân số bằng 1/2. Ghi nhớ kiến thức về phân số tối giản và quy đồng."
      };
    }
  }

  // =========================================================================
  // 4. LỊCH SỬ VÀ ĐỊA LÍ 5
  // =========================================================================
  if (subLower.includes("lịch sử") || subLower.includes("địa lí") || subLower.includes("ls và đl")) {
    const isTiet2 = titleLower.includes("tiết 2") || curriculumPeriod === 2 || curriculumPeriod === "2";
    if (!isTiet2) {
      return {
        specificCompetencies: [
          "Xác định được vị trí địa lí của Việt Nam trên bản đồ/lược đồ khu vực Đông Nam Á và thế giới; nêu được phạm vi lãnh thổ của Việt Nam (vùng đất, vùng biển, vùng trời).",
          "Nêu được tên các nước có chung đường biên giới trên đất liền với Việt Nam (Trung Quốc, Lào, Cam-pu-chia) và các vùng biển tiếp giáp.",
          "Biết được ý nghĩa của Quốc kì (cờ đỏ sao vàng), Quốc huy và Quốc ca Việt Nam (bài hát Tiến quân ca của nhạc sĩ Văn Cao). Bồi dưỡng niềm tự hào dân tộc, ý thức bảo vệ chủ quyền Tổ quốc."
        ],
        teacherMaterials: [
          "Lược đồ vị trí địa lí và lãnh thổ Việt Nam trên máy chiếu/bản đồ treo tường, hình ảnh Quốc kì, Quốc huy Việt Nam, file âm thanh Quốc ca chuẩn.",
          "Phiếu học tập tìm hiểu vị trí địa lí."
        ],
        studentMaterials: [
          "SGK Lịch sử và Địa lí 5, vở ghi, bút chì, tập bản đồ."
        ],
        act1Teacher: "Mở đoạn nhạc hào hùng của bài hát 'Tiến quân ca' kết hợp chiếu hình ảnh lá cờ đỏ sao vàng tung bay trên cột cờ Lũng Cú. Hỏi: 'Hình ảnh và giai điệu này nhắc em nhớ đến biểu tượng thiêng liêng nào của dân tộc ta?' Dẫn dắt vào Bài 1.",
        act1Student: "Đứng nghiêm trang lắng nghe giai điệu Quốc ca. Trả lời câu hỏi: 'Đó là Quốc kì và Quốc ca của nước Cộng hòa xã hội chủ nghĩa Việt Nam'. Mở SGK trang 5.",
        act2Teacher: "- Yêu cầu học sinh quan sát Lược đồ Việt Nam trong khu vực Đông Nam Á (SGK trang 6):\n  + Chỉ vị trí nước ta nằm ở khu vực nào của châu Á?\n  + Nêu tên các quốc gia tiếp giáp với phần đất liền nước ta ở phía Bắc, phía Tây?\n  + Phía Đông và Nam tiếp giáp với vùng biển nào?\n- Hướng dẫn học sinh thảo luận nhóm 4 hoàn thành Phiếu học tập số 1 về tọa độ và các điểm tiếp giáp.",
        act2Student: "- Quan sát lược đồ, làm việc nhóm 4 dùng ngón tay chỉ ranh giới trên bản đồ cá nhân.\n- Điền thông tin vào phiếu học tập:\n  + Việt Nam nằm ở bán đảo Đông Dương, thuộc khu vực Đông Nam Á.\n  + Tiếp giáp trên đất liền: Phía Bắc giáp Trung Quốc, phía Tây giáp Lào và Cam-pu-chia.\n  + Phía Đông, Nam và Tây Nam tiếp giáp Biển Đông rộng lớn.\n- Đại diện nhóm lên bảng chỉ trực tiếp trên bản đồ treo tường trước lớp.",
        act3Teacher: "- Chiếu hình ảnh Quốc kì, Quốc huy và hướng dẫn tìm hiểu ý nghĩa thiêng liêng:\n  + Quốc kì: Nền đỏ tượng trưng cho màu máu của các anh hùng liệt sĩ, ngôi sao vàng 5 cánh tượng trưng cho các tầng lớp sĩ, nông, công, thương, binh đoàn kết một lòng.\n  + Quốc huy: Hình tròn, bông lúa vàng bao quanh tượng trưng cho nông nghiệp, bánh xe răng tượng trưng cho công nghiệp, sao vàng ở giữa.\n  + Quốc ca: Bài hát Tiến quân ca do nhạc sĩ Văn Cao sáng tác năm 1944.\n- Tổ chức cho học sinh trả lời các câu hỏi củng cố nhanh.",
        act3Student: "- Chăm chú theo dõi hình ảnh và phần giải thích của giáo viên.\n- Ghi chép các ý nghĩa trọng tâm của Quốc kì, Quốc huy, Quốc ca vào vở.\n- 2 học sinh nhắc lại ý nghĩa ngôi sao vàng và tác giả bài Tiến quân ca.",
        act4Teacher: "Đặt câu hỏi liên hệ: 'Là học sinh tiểu học, em cần thể hiện sự tôn trọng Quốc kì và Quốc ca như thế nào khi tham gia nghi lễ chào cờ?' Tổng kết tiết 1.",
        act4Student: "Phát biểu tự tin: 'Khi chào cờ, em phải đứng nghiêm trang, mắt hướng về Quốc kì, không nói chuyện riêng, hát Quốc ca to, rõ ràng và đúng giai điệu.' Ghi nhớ dặn dò."
      };
    } else {
      return {
        specificCompetencies: [
          "Nêu được đặc điểm hình dạng lãnh thổ phần đất liền của nước ta (hẹp ngang, kéo dài theo chiều Bắc - Nam theo hình chữ S).",
          "Biết được thủ đô của Việt Nam là Hà Nội; các thành phố trực thuộc Trung ương; số lượng đơn vị hành chính cấp tỉnh/thành phố.",
          "Hiểu được tầm quan trọng chiến lược của biển đảo Việt Nam (Hoàng Sa, Trường Sa) đối với an ninh quốc phòng và phát triển kinh tế biển."
        ],
        teacherMaterials: [
          "Bản đồ hành chính Việt Nam treo tường hoặc số hóa, hình ảnh hai quần đảo Hoàng Sa và Trường Sa, tư liệu lịch sử về chủ quyền biển đảo."
        ],
        studentMaterials: [
          "SGK Lịch sử và Địa lí 5, vở bài tập, bút màu."
        ],
        act1Teacher: "Đố vui địa lí: 'Đố em nước mình hình chữ gì? Đầu chạm Lũng Cú, chân quỳ Cà Mau?' HS đồng thanh: Hình chữ S! GV kết nối vào tiết 2 của bài học.",
        act1Student: "Hào hứng trả lời câu đố vui, mở SGK bài 1 (tiết 2).",
        act2Teacher: "- Treo Bản đồ hành chính Việt Nam lên bảng. Yêu cầu học sinh quan sát và trả lời:\n  + Phần đất liền của nước ta có hình dạng gì? Chiều dài từ Bắc vào Nam khoảng bao nhiêu km?\n  + Nơi hẹp nhất của nước ta theo chiều Tây - Đông là tỉnh nào (Quảng Bình, chưa đầy 50 km)?\n  + Kể tên thủ đô và 5 thành phố trực thuộc Trung ương của nước ta (Hà Nội, TP Hồ Chí Minh, Hải Phòng, Đà Nẵng, Cần Thơ).\n  + Vùng biển nước ta có hai quần đảo lớn thiêng liêng nào thuộc chủ quyền Việt Nam?",
        act2Student: "- Quan sát bản đồ hành chính, thảo luận nhóm đôi tìm câu trả lời:\n  + Đất liền kéo dài theo hình chữ S, dài khoảng 1 650 km từ Lũng Cú (Hà Giang) đến mũi Cà Mau.\n  + Nơi hẹp nhất thuộc tỉnh Quảng Bình.\n  + Thủ đô là Hà Nội. 5 thành phố trực thuộc Trung ương là Hà Nội, TP.HCM, Hải Phòng, Đà Nẵng, Cần Thơ.\n  + Hai quần đảo thiêng liêng là Hoàng Sa (thuộc TP Đà Nẵng) và Trường Sa (thuộc tỉnh Khánh Hòa).\n- 2 học sinh lên chỉ vị trí Hà Nội và Hoàng Sa, Trường Sa trên bản đồ.",
        act3Teacher: "- Giao bài tập trong VBT: Điền tên các nước tiếp giáp và tên thủ đô, quần đảo vào bản đồ câm.\n- Đi từng bàn hướng dẫn học sinh cách điền chữ rõ ràng, dùng kí hiệu chuẩn trên bản đồ.",
        act3Student: "- Thực hành điền thông tin vào bản đồ câm trong vở bài tập cá nhân.\n- Đổi chéo vở kiểm tra cùng bạn, sửa lỗi chính tả tên địa danh.",
        act4Teacher: "Tổ chức trò chơi 'Nhà địa lí nhí': Cho học sinh trả lời nhanh 4 câu hỏi trắc nghiệm về vị trí, hình dạng lãnh thổ nước ta. Nhận xét tiết học và biểu dương tinh thần học tập của lớp.",
        act4Student: "Tham gia trả lời sôi nổi bằng cách giơ thẻ A, B, C, D. Khắc sâu kiến thức về chủ quyền toàn vẹn lãnh thổ đất nước."
      };
    }
  }

  // =========================================================================
  // 5. KHOA HỌC 5
  // =========================================================================
  if (subLower.includes("khoa học") || subLower.includes("kh")) {
    const isTiet2 = titleLower.includes("tiết 2") || curriculumPeriod === 2 || curriculumPeriod === "2";
    if (!isTiet2) {
      return {
        specificCompetencies: [
          "Nêu được các thành phần chính của đất (chất khoáng, chất mùn, nước, không khí, sinh vật) thông qua thí nghiệm thực hành trực quan.",
          "Thực hiện được các thao tác thí nghiệm đơn giản khám phá sự có mặt của không khí và nước trong đất; quan sát và ghi chép hiện tượng trung thực.",
          "Hình thành tư duy nghiên cứu khoa học thực nghiệm, cẩn thận, an toàn khi thực hành thí nghiệm."
        ],
        teacherMaterials: [
          "Dụng cụ thí nghiệm cho các nhóm: Cốc thủy tinh đựng nước trong, thìa nhỏ, mẫu đất khô vón cục, đĩa nhôm, đèn cồn hoặc nến, que diêm, kính lúp cầm tay.",
          "Phiếu ghi chép kết quả thí nghiệm."
        ],
        studentMaterials: [
          "SGK Khoa học 5, vở bài tập Khoa học, khăn lau tay, mẫu đất nhỏ lấy từ vườn nhà."
        ],
        act1Teacher: "Mang đến lớp 1 chậu cây xanh tươi tốt và 1 chậu đất khô cằn. Hỏi: 'Điều gì trong đất đã giúp cây xanh lớn lên và phát triển tươi tốt mỗi ngày? Trong đất có chứa những thành phần gì?' Kích thích trí tò mò, dẫn vào bài.",
        act1Student: "Quan sát hai chậu cây, suy đoán sôi nổi: 'Trong đất có nước, có chất dinh dưỡng, có phân bón...' Mở SGK trang 8.",
        act2Teacher: "- Hướng dẫn các nhóm tiến hành 2 thí nghiệm khám phá thành phần của đất:\n  + Thí nghiệm 1: Thả một cục đất khô vào cốc nước trong. Yêu cầu quan sát hiện tượng ở bề mặt cục đất (có bọt khí nổi lên -> chứng tỏ trong đất có không khí).\n  + Thí nghiệm 2: Dùng thìa lấy một ít đất ẩm bỏ vào đĩa nhôm, hơ trên ngọn nến, đậy mặt kính phía trên. Quan sát mặt kính có hơi nước đọng lại -> chứng tỏ trong đất có nước; có mùi khét -> chứng tỏ trong đất có chất mùn (xác sinh vật phân hủy).\n- Hướng dẫn quy tắc an toàn khi dùng lửa thí nghiệm.",
        act2Student: "- Các nhóm nhận khay dụng cụ thí nghiệm, phân công nhóm trưởng điều hành và thư kí ghi chép.\n- Tiến hành Thí nghiệm 1: Cẩn thận thả cục đất khô vào cốc nước, quan sát thấy rất nhiều bọt khí nhỏ li ti sủi lên mặt nước. Thư kí ghi vào phiếu: Trong đất có không khí.\n- Tiến hành Thí nghiệm 2 theo hướng dẫn của GV, quan sát giọt nước đọng trên nắp kính và ngửi thấy mùi khét của chất mùn. Ghi kết luận vào phiếu.",
        act3Teacher: "- Mời đại diện các nhóm báo cáo kết quả thí nghiệm trước lớp.\n- Đặt câu hỏi tổng hợp: 'Qua 2 thí nghiệm, em hãy cho biết đất gồm những thành phần nào?'\n- Chốt kiến thức: Đất gồm các hạt khoáng, chất mùn, nước, không khí và các vi sinh vật sống trong đất (giun đất, côn trùng).",
        act3Student: "- Đại diện 2 nhóm lên bảng trình bày kết quả thí nghiệm, các nhóm khác lắng nghe và bổ sung.\n- Nhắc lại kết luận khoa học: Đất gồm có nước, không khí, chất khoáng, chất mùn và sinh vật.\n- Vẽ sơ đồ tư duy đơn giản các thành phần của đất vào vở.",
        act4Teacher: "Đặt câu hỏi tình huống: 'Tại sao khi trời mưa to ngập úng, giun đất lại phải chui lên mặt đất?' Nhận xét tiết học, hướng dẫn dọn dẹp vệ sinh phòng thí nghiệm.",
        act4Student: "Suy nghĩ và giải thích: 'Vì khi ngập nước, các khe hở trong đất bị nước chiếm chỗ, không còn không khí để giun thở nên giun phải bò lên mặt đất.' Rửa tay sạch sẽ và ghi nhớ bài học."
      };
    } else {
      return {
        specificCompetencies: [
          "Trình bày được vai trò quan trọng của đất đối với cây trồng (cung cấp nước, chất dinh dưỡng, không khí và giữ cho rễ cây bám chặt đứng vững).",
          "Nêu được các biện pháp bảo vệ đất, làm cho đất màu mỡ, phì nhiêu và chống xói mòn đất.",
          "Có ý thức bảo vệ môi trường đất, không vứt rác thải nhựa, túi ni lông hoặc hóa chất độc hại làm ô nhiễm đất."
        ],
        teacherMaterials: [
          "Tranh ảnh phóng to bộ rễ cây bám trong lòng đất, video về vai trò của đất đối với mùa màng và hậu quả của xói mòn đất, slide bài giảng."
        ],
        studentMaterials: [
          "SGK Khoa học 5, vở bài tập Khoa học, bút chì màu."
        ],
        act1Teacher: "Chiếu hình ảnh một cây cổ thụ đứng vững trước cơn gió bão lớn. Hỏi: 'Nhờ đâu mà thân cây to lớn có thể đứng vững trước gió bão mà không bị đổ ngã?' HS trả lời -> Dẫn vào tiết 2: Vai trò của đất đối với cây trồng.",
        act1Student: "Quan sát tranh, hào hứng trả lời: 'Nhờ có bộ rễ cắm sâu và bám chặt vào trong lòng đất ạ!' Mở SGK bài 1 (tiết 2).",
        act2Teacher: "- Yêu cầu học sinh đọc thông tin trong SGK trang 11 và quan sát sơ đồ vai trò của đất.\n- Đặt câu hỏi thảo luận nhóm 4:\n  + Đất cung cấp những gì cho cây trồng phát triển?\n  + Nếu đất bị khô cằn, bạc màu hoặc nhiễm độc thì cây trồng sẽ ra sao?\n  + Cần làm gì để giữ cho đất luôn màu mỡ, phì nhiêu?",
        act2Student: "- Đọc thầm thông tin trong SGK, thảo luận sôi nổi theo nhóm 4:\n  + Đất cung cấp nước, chất khoáng dinh dưỡng, không khí cho rễ thở và là giá đỡ vững chắc giữ cho cây đứng thẳng.\n  + Đất bạc màu cây sẽ còi cọc, vàng lá, kém phát triển hoặc chết.\n  + Để đất màu mỡ cần bón phân hữu cơ, cày xới tơi xốp, luân canh cây trồng và trồng cây che phủ đất.\n- Đại diện nhóm báo cáo, các bạn nhận xét bổ sung.",
        act3Teacher: "- Hướng dẫn làm bài tập trong VBT:\n  + Hoàn thành bảng so sánh cây trồng trên đất tốt và cây trồng trên đất cằn cỗi.\n  + Nối các hành động đúng/sai đối với việc bảo vệ môi trường đất.\n- Đi quan sát, chấm chữa bài cho một số học sinh.",
        act3Student: "- Hoàn thành bài tập vào vở bài tập cá nhân.\n- 2 học sinh lên bảng hoàn thiện bảng so sánh: Đất tốt -> cây xanh tốt, nhiều quả; Đất xấu -> cây khô héo.\n- Đổi vở chấm chéo cùng bạn bên cạnh.",
        act4Teacher: "Liên hệ thực tế: 'Ở gia đình em, bố mẹ hoặc ông bà thường làm gì để chăm sóc đất trồng rau, hoa, cây cảnh?' Dặn dò chăm sóc cây xanh quanh lớp học.",
        act4Student: "Chia sẻ: 'Bố mẹ em bón phân chuồng ủ hoai mục, tưới nước vo gạo, nhổ cỏ dại và xới đất cho tơi xốp.' Cam kết không vứt rác túi ni lông vào các bồn hoa của trường."
      };
    }
  }

  // =========================================================================
  // 6. DEFAULT DYNAMIC DETAILED GENERATOR FOR ANY OTHER SUBJECT OR GRADE
  // =========================================================================
  return {
    specificCompetencies: [
      `Nắm vững kiến thức trọng tâm bài học: ${lessonTitle}. Thực hiện đúng các kỹ năng đặc thù môn ${subject} lớp ${grade} theo chuẩn chương trình GDPT 2018.`,
      `Vận dụng linh hoạt kiến thức của bài ${lessonTitle} để giải quyết các tình huống thực tiễn và bài tập liên quan.`,
      "Rèn luyện năng lực tự chủ, tự học, giao tiếp hợp tác và phẩm chất chăm chỉ, trách nhiệm."
    ],
    teacherMaterials: [
      `Kế hoạch bài dạy, bài giảng điện tử tương tác, tranh ảnh minh họa ngữ liệu, phiếu học tập môn ${subject} lớp ${grade}.`
    ],
    studentMaterials: [
      `Sách giáo khoa môn ${subject} lớp ${grade}, vở bài tập, đồ dùng học tập cá nhân.`
    ],
    act1Teacher: `Tổ chức trò chơi khởi động sôi nổi hoặc bài hát vui nhộn liên quan trực tiếp đến bài học "${lessonTitle}". Đặt câu hỏi kết nối gợi mở: "Quan sát tình huống/hình ảnh trên bảng, em dự đoán hôm nay chúng ta sẽ tìm hiểu về điều gì?"`,
    act1Student: `Tích cực tham gia trò chơi, lắng nghe câu hỏi và hào hứng giơ tay phát biểu ý kiến ban đầu. Nhận biết mục tiêu tiết học và mở sách giáo khoa trang tương ứng sẵn sàng bước vào bài mới.`,
    act2Teacher: `Hướng dẫn học sinh làm việc cá nhân kết hợp thảo luận nhóm 4 để phân tích ngữ liệu/ví dụ mẫu trong bài "${lessonTitle}". Giao câu hỏi tìm hiểu cốt lõi: Nêu đặc điểm, quy tắc hoặc các bước thực hiện. Quan sát, định hướng các nhóm còn lúng túng.`,
    act2Student: `Đọc kĩ thông tin trong SGK, dùng bút chì gạch chân kiến thức trọng tâm. Thảo luận nhóm 4 sôi nổi, phân công thư kí ghi kết quả vào phiếu nhóm. Đại diện nhóm đứng lên báo cáo dõng dạc, các bạn lắng nghe và nhận xét, bổ sung câu trả lời chuẩn xác.`,
    act3Teacher: `Giao nhiệm vụ luyện tập thực hành theo từng mức độ từ dễ đến khó trong SGK/VBT (Bài 1: Làm bảng con/miệng; Bài 2 & 3: Trình bày chi tiết vào vở). Đi quan sát từng bàn, hướng dẫn tận tình các em học sinh tiếp thu chậm, kiểm tra sửa lỗi kịp thời.`,
    act3Student: `Tích cực thực hành: Làm Bài 1 vào bảng con, giơ bảng đồng loạt khi có hiệu lệnh. Làm Bài 2 và Bài 3 vào vở cẩn thận. 2 học sinh lên bảng lớp trình bày bài giải/câu trả lời. Cả lớp quan sát, nhận xét và đổi chéo vở kiểm tra kết quả cùng bạn bên cạnh.`,
    act4Teacher: `Đưa ra tình huống vận dụng thực tiễn gắn liền với đời sống hàng ngày của học sinh tiểu học liên quan đến "${lessonTitle}". Hướng dẫn học sinh liên hệ bản thân và nhắc nhở nội dung tích hợp (giáo dục kĩ năng sống, bảo vệ môi trường, an toàn số).`,
    act4Student: `Lắng nghe tình huống thực tế, suy nghĩ và đưa ra cách giải quyết thông minh. Rút ra bài học bổ ích cho bản thân, ghi chép nhiệm vụ chuẩn bị bài cho tiết học sau vào sổ tay.`
  };
}
