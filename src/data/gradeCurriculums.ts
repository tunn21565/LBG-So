import { Grade } from "../types";

export interface LessonInfo {
  lessonTitle: string;
  subSubject?: string;
  curriculumPeriod: number | string;
  integrationNotes?: string;
  specificCompetencies?: string[];
  aiIntegration?: string;
  digitalCompetence?: string;
  humanRights?: string;
  defense?: string;
  nutrition?: string;
  environment?: string;
  stem?: string;
  lifeSkills?: string;
  teacherMaterials?: string[];
  studentMaterials?: string[];
  act1Teacher?: string;
  act1Student?: string;
  act2Teacher?: string;
  act2Student?: string;
  act3Teacher?: string;
  act3Student?: string;
  act4Teacher?: string;
  act4Student?: string;
}

// -------------------------------------------------------------
// KHỐI 1 CURRICULUM MAPPING (Tuần 1 - Tuần 35)
// -------------------------------------------------------------
export const GRADE_1_CURRICULUM: Record<string, (week: number, periodInWeek: number) => LessonInfo> = {
  "tiếng việt": (week: number, p: number) => {
    if (week === 1) {
      if (p === 1) return {
        lessonTitle: "Làm quen với trường lớp, bạn bè, đồ dùng học tập (Tiết 1)",
        subSubject: "Làm quen",
        curriculumPeriod: 1,
        integrationNotes: "QCN: Quyền học tập, vui chơi, kết bạn. KNS: Chào hỏi, giới thiệu bản thân.",
        humanRights: "Quyền con người: Giúp HS nhận biết quyền được học tập, vui chơi, kết bạn trong môi trường an toàn; biết tôn trọng thầy cô và bạn bè.",
        lifeSkills: "Kĩ năng sống: Rèn kĩ năng chào hỏi, giới thiệu bản thân, giữ gìn đồ dùng học tập và thực hiện nền nếp lớp học."
      };
      if (p === 2) return {
        lessonTitle: "Làm quen với trường lớp, bạn bè, đồ dùng học tập (Tiết 2)",
        subSubject: "Làm quen",
        curriculumPeriod: 2,
        integrationNotes: "QCN: Quyền được học tập an toàn. KNS: Nề nếp học tập.",
        humanRights: "Quyền trẻ em được học tập và sinh hoạt trong môi trường thân thiện, an toàn."
      };
      if (p === 3) return {
        lessonTitle: "Làm quen với tư thế đọc viết nói nghe (Tiết 1)",
        subSubject: "Làm quen",
        curriculumPeriod: 3,
        integrationNotes: "KNS: Rèn tư thế ngồi đúng, giữ khoảng cách mắt - vở.",
        lifeSkills: "Kĩ năng sống: Rèn kĩ năng tự điều chỉnh tư thế đọc, viết, nói, nghe; giữ khoảng cách mắt - vở phù hợp và biết nhắc bạn cùng thực hiện."
      };
      if (p === 4) return {
        lessonTitle: "Làm quen với tư thế đọc viết nói nghe (Tiết 2)",
        subSubject: "Làm quen",
        curriculumPeriod: 4,
        integrationNotes: "QCN: Quyền được chăm sóc sức khỏe học đường.",
        humanRights: "Quyền con người: Giáo dục quyền được chăm sóc sức khỏe và học tập trong điều kiện an toàn."
      };
      if (p >= 5 && p <= 10) return {
        lessonTitle: `Làm quen với các nét cơ bản, các chữ số, bảng chữ cái, dấu thanh (Tiết ${p - 4})`,
        subSubject: "Làm quen nét chữ",
        curriculumPeriod: p,
        integrationNotes: "Rèn luyện sự khéo léo của đôi tay và tư duy ngôn ngữ ban đầu."
      };
      return {
        lessonTitle: `Ôn luyện viết các nét cơ bản, đọc âm (Tiết ${p - 10})`,
        subSubject: "Ôn luyện",
        curriculumPeriod: p,
        integrationNotes: "Củng cố nhận diện nét cơ bản và phát âm chuẩn."
      };
    }
    if (week === 2) {
      if (p <= 2) return { lessonTitle: `Bài 1: A a (Tiết ${p})`, subSubject: "Âm chữ", curriculumPeriod: (week - 1) * 12 + p };
      if (p <= 4) return { lessonTitle: `Bài 2: B b (Tiết ${p - 2})`, subSubject: "Âm chữ", curriculumPeriod: (week - 1) * 12 + p };
      if (p <= 6) return { lessonTitle: `Bài 3: C c / (Tiết ${p - 4})`, subSubject: "Âm chữ", curriculumPeriod: (week - 1) * 12 + p };
      if (p <= 8) return { lessonTitle: `Bài 4: E e Ê ê (Tiết ${p - 6})`, subSubject: "Âm chữ", curriculumPeriod: (week - 1) * 12 + p };
      if (p <= 10) return {
        lessonTitle: `Bài 5: Ôn tập và kể chuyện (Tiết ${p - 8})`,
        subSubject: "Ôn tập & Kể chuyện",
        curriculumPeriod: (week - 1) * 12 + p,
        integrationNotes: "Lối sống: Truyện Búp bê và dế mèn, biết giúp đỡ việc nhà vừa sức."
      };
      return { lessonTitle: `Ôn luyện tuần 1 (Tiết ${p - 10})`, subSubject: "Ôn luyện", curriculumPeriod: (week - 1) * 12 + p };
    }
    if (week === 3) {
      if (p <= 2) return { lessonTitle: `Bài 6: O o ? (Tiết ${p})`, subSubject: "Âm chữ", curriculumPeriod: (week - 1) * 12 + p };
      if (p <= 4) return { lessonTitle: `Bài 7: Ô ô (Tiết ${p - 2})`, subSubject: "Âm chữ", curriculumPeriod: (week - 1) * 12 + p, integrationNotes: "KNS/ATGT: Đi bộ trên vỉa hè, quan sát an toàn." };
      if (p <= 6) return { lessonTitle: `Bài 8: D d Đ đ (Tiết ${p - 4})`, subSubject: "Âm chữ", curriculumPeriod: (week - 1) * 12 + p };
      if (p <= 8) return { lessonTitle: `Bài 9: Ơ ơ (Tiết ${p - 6})`, subSubject: "Âm chữ", curriculumPeriod: (week - 1) * 12 + p, integrationNotes: "BVMT: Yêu cảnh đẹp biển, không xả rác." };
      if (p <= 10) return { lessonTitle: `Bài 10: Ôn tập và kể chuyện (Tiết ${p - 8})`, subSubject: "Ôn tập & Kể chuyện", curriculumPeriod: (week - 1) * 12 + p, integrationNotes: "Đạo đức: Truyện Đàn kiến con ngoan ngoãn." };
      return { lessonTitle: `Ôn luyện tuần 2 (Tiết ${p - 10})`, subSubject: "Ôn luyện", curriculumPeriod: (week - 1) * 12 + p };
    }
    // General formula for other weeks
    const bàiNum = (week - 1) * 5 + Math.ceil(p / 2);
    return {
      lessonTitle: `Bài ${bàiNum}: Luyện đọc & Luyện viết âm vần mới (Tiết ${(p % 2) + 1})`,
      subSubject: "Âm vần",
      curriculumPeriod: (week - 1) * 12 + p,
      integrationNotes: "Tích hợp rèn phát âm chuẩn và kỹ năng viết đúng chính tả."
    };
  },

  "toán": (week: number, p: number) => {
    if (week === 1) {
      if (p === 1) return {
        lessonTitle: "Tiết học đầu tiên - Làm quen với môn Toán",
        curriculumPeriod: 1,
        integrationNotes: "Tích hợp AI: 1.A2.1 (Nhận biết bạn Rô-bốt hỗ trợ học tập Toán).",
        aiIntegration: "1.A2.1: Nhận biết và kể tên được một số thiết bị có sử dụng AI (như robot). Nhận biết nhân vật Rô-bốt trong sách là một đại diện tiêu biểu của AI hỗ trợ con người học tập."
      };
      return {
        lessonTitle: `Bài 1: Các số 0, 1, 2, 3, 4, 5 (Tiết ${p - 1})`,
        curriculumPeriod: p,
        integrationNotes: "Làm quen biểu tượng số và đếm số lượng đồ vật 0-5."
      };
    }
    if (week === 2) {
      if (p === 1) return { lessonTitle: "Bài 1: Các số 0, 1, 2, 3, 4, 5 (Tiết 3)", curriculumPeriod: 4 };
      if (p === 2) return { lessonTitle: "Bài 2: Các số 6, 7, 8, 9, 10 (Tiết 1)", curriculumPeriod: 5 };
      return {
        lessonTitle: "Bài 2: Các số 6, 7, 8, 9, 10 (Tiết 2)",
        curriculumPeriod: 6,
        integrationNotes: "STEM: Trải nghiệm cùng khay 10 học Toán (2 tiết)."
      };
    }
    if (week === 3) {
      if (p === 1) return { lessonTitle: "Bài 2: Các số 6, 7, 8, 9, 10 (Tiết 3)", curriculumPeriod: 7 };
      if (p === 2) return {
        lessonTitle: "Bài 3: Nhiều hơn, ít hơn, bằng nhau (Tiết 1)",
        curriculumPeriod: 8,
        integrationNotes: "Tích hợp AI: 1.D2.1 (Nhận biết AI đếm và so sánh số lượng vật thể). NLS: 4.3CB1a",
        aiIntegration: "1.D2.1: Nhận biết được loại máy thông minh có thể làm một việc (như nhận biết, so sánh hình ảnh). Hiểu rằng AI có khả năng xử lý hình ảnh để so sánh số lượng vật thể nhanh chóng."
      };
      return { lessonTitle: "Bài 3: Nhiều hơn, ít hơn, bằng nhau (Tiết 2)", curriculumPeriod: 9 };
    }
    if (week === 4) {
      if (p <= 2) return { lessonTitle: `Bài 4: So sánh số (Tiết ${p})`, curriculumPeriod: (week - 1) * 3 + p, integrationNotes: p === 2 ? "STEM: Dụng cụ so sánh số trong phạm vi 10." : "" };
      return { lessonTitle: `Bài 4: So sánh số (Tiết ${p})`, curriculumPeriod: (week - 1) * 3 + p };
    }
    return {
      lessonTitle: `Bài toán tuần ${week} - Tiết ${p}`,
      curriculumPeriod: (week - 1) * 3 + p,
      integrationNotes: "Rèn luyện tư duy số học và kỹ năng tính toán."
    };
  },

  "tự nhiên và xã hội": (week: number, p: number) => {
    if (week === 1) return {
      lessonTitle: `Bài 1: Kể về gia đình (Tiết ${p})`,
      curriculumPeriod: p,
      integrationNotes: "QCN: Quyền được sum họp gia đình, lắng nghe ý kiến. Bổn phận yêu thương người thân.",
      humanRights: "Quyền con người: Quyền được sum họp với gia đình; Quyền được lắng nghe ý kiến; Bổn phận phụ giúp việc nhà, tôn trọng các thành viên."
    };
    if (week === 2) return {
      lessonTitle: `Bài 2: Ngôi nhà của em (Tiết ${p})`,
      curriculumPeriod: 2 + p,
      integrationNotes: "QCN: Quyền có nơi ở an toàn. QPAN: Tình cảm gắn bó với tổ ấm gia đình.",
      humanRights: "Giáo dục quyền con người: Học sinh được thực hiện quyền có nơi ở an toàn, được sống cùng gia đình."
    };
    if (week === 3) return {
      lessonTitle: `Bài 3: Đồ dùng trong nhà (Tiết ${p})`,
      curriculumPeriod: 4 + p,
      integrationNotes: "QCN: Trẻ em có quyền được sống trong ngôi nhà an toàn, sạch sẽ, gọn gàng."
    };
    if (week === 4) return {
      lessonTitle: `Bài 4: An toàn khi sử dụng đồ dùng trong nhà (Tiết ${p})`,
      curriculumPeriod: 6 + p,
      integrationNotes: "Tích hợp NLS 4.1.CB1b (Nguy cơ thiết bị điện). Tích hợp AI: 1.B3.1 (Ngôi nhà thông minh cảnh báo cháy/điện)."
    };
    return {
      lessonTitle: `Bài học TNXH tuần ${week} (Tiết ${p})`,
      curriculumPeriod: (week - 1) * 2 + p,
      integrationNotes: "Khám phá tự nhiên và môi trường sống xung quanh em."
    };
  },

  "đạo đức": (week: number) => {
    if (week === 1) return {
      lessonTitle: "Bài 1: Em giữ sạch đôi tay (Tiết 1)",
      curriculumPeriod: 1,
      integrationNotes: "Quyền được chăm sóc sức khỏe: Giữ gìn vệ sinh thân thể, tự giác rửa tay sạch sẽ."
    };
    if (week === 2) return {
      lessonTitle: "Bài 2: Em giữ sạch răng miệng (Tiết 1)",
      curriculumPeriod: 2,
      integrationNotes: "QCN: Quyền được chăm sóc sức khỏe và bổn phận giữ gìn vệ sinh cá nhân."
    };
    if (week === 3) return {
      lessonTitle: "Bài 3: Em tắm, gội sạch sẽ (Tiết 1)",
      curriculumPeriod: 3,
      integrationNotes: "QCN & KNS: Rèn kỹ năng tự phục vụ, tắm rửa giữ cơ thể thơm tho sạch sẽ."
    };
    if (week === 4) return {
      lessonTitle: "Bài 4: Em giữ trang phục gọn gàng, sạch sẽ (Tiết 1)",
      curriculumPeriod: 4,
      integrationNotes: "QCN: Quyền được mặc sạch sẽ; Bổn phận giữ gìn quần áo gọn gàng văn minh."
    };
    return {
      lessonTitle: `Bài đạo đức tuần ${week}`,
      curriculumPeriod: week,
      integrationNotes: "Giáo dục chuẩn mực hành vi đạo đức và phẩm chất tốt đẹp."
    };
  },

  "hoạt động trải nghiệm": (week: number, p: number) => {
    if (week === 1) {
      if (p === 1) return { lessonTitle: "Sinh hoạt dưới cờ: LỄ KHAI GIẢNG NĂM HỌC MỚI", curriculumPeriod: 1, integrationNotes: "QCN: Quyền được học tập, tham gia hoạt động trường lớp." };
      if (p === 2) return { lessonTitle: "HĐGDCĐ: LÀM QUEN VỚI BẠN MỚI", curriculumPeriod: 2, integrationNotes: "QCN: Tự do biểu đạt, tôn trọng bạn. NLS 2.3.CB1a: Lời nói lịch sự trong môi trường số." };
      return { lessonTitle: "Sinh hoạt lớp: SƠ KẾT TUẦN & KẾ HOẠCH TUẦN 2", curriculumPeriod: 3, integrationNotes: "Rèn nền nếp tự giác và sinh hoạt tập thể." };
    }
    if (week === 2) {
      if (p === 1) return { lessonTitle: "Sinh hoạt dưới cờ: TÌM HIỂU NỘI QUY NHÀ TRƯỜNG", curriculumPeriod: 4, integrationNotes: "QCN: Học tập và vui chơi an toàn, chấp hành nội quy trường lớp." };
      if (p === 2) return { lessonTitle: "HĐGDCĐ: NHỮNG VIỆC NÊN LÀM TRONG GIỜ HỌC, GIỜ CHƠI (TIẾT 1)", curriculumPeriod: 5, integrationNotes: "Đạo đức lối sống: Ứng xử văn minh, đoàn kết với bạn bè." };
      return { lessonTitle: "Sinh hoạt sao: SƠ KẾT TUẦN & SINH HOẠT SAO NHI ĐỒNG", curriculumPeriod: 6, integrationNotes: "Hình thành thói quen kỷ luật, chăm ngoan." };
    }
    if (week === 3) {
      if (p === 1) return { lessonTitle: "Sinh hoạt dưới cờ: NÓI LỜI HAY - LÀM VIỆC TỐT", curriculumPeriod: 7, integrationNotes: "Lối sống nhân ái, lễ phép, chăm chỉ." };
      if (p === 2) return { lessonTitle: "HĐGDCĐ: NHỮNG VIỆC NÊN LÀM TRONG GIỜ HỌC, GIỜ CHƠI (TIẾT 2)", curriculumPeriod: 8, integrationNotes: "QCN: Quyền được học tập trong an toàn, lành mạnh." };
      return { lessonTitle: "Sinh hoạt lớp: LÀM QUEN VỚI SINH HOẠT SAO NHI ĐỒNG", curriculumPeriod: 9, integrationNotes: "Bồi dưỡng tinh thần trách nhiệm và tương thân tương ái." };
    }
    return {
      lessonTitle: p === 1 ? `Sinh hoạt dưới cờ tuần ${week}` : p === 2 ? `HĐGDCĐ theo chủ đề tuần ${week}` : `Sinh hoạt lớp tuần ${week}`,
      curriculumPeriod: (week - 1) * 3 + p,
      integrationNotes: "Phát triển năng lực thích ứng và kỹ năng hoạt động xã hội."
    };
  }
};

// -------------------------------------------------------------
// KHỐI 2 CURRICULUM MAPPING (Tuần 1 - Tuần 35)
// -------------------------------------------------------------
export const GRADE_2_CURRICULUM: Record<string, (week: number, p: number) => LessonInfo> = {
  "tiếng việt": (week: number, p: number) => {
    if (week === 1) {
      if (p <= 2) return {
        lessonTitle: `Bài 1: Tôi là học sinh lớp 2 (Tiết ${p}: Đọc)`,
        subSubject: "Đọc",
        curriculumPeriod: p,
        integrationNotes: "KNS: Tình cảm quý mến bạn bè, chào hỏi thân thiện, trò chơi 'Tặng lời chúc cho bạn'."
      };
      if (p === 3) return {
        lessonTitle: "Bài 1: Tôi là học sinh lớp 2 (Tiết 3: Viết Chữ hoa A)",
        subSubject: "Viết",
        curriculumPeriod: 3,
        integrationNotes: "BVMT: Giữ sân trường xanh - sạch - đẹp qua câu ứng dụng."
      };
      if (p === 4) return {
        lessonTitle: "Bài 1: Tôi là học sinh lớp 2 (Tiết 4: Nói và nghe: Những ngày hè của em)",
        subSubject: "Nói và nghe",
        curriculumPeriod: 4,
        integrationNotes: "KNS: Phòng chống đuối nước trong kì nghỉ hè."
      };
      if (p <= 6) return {
        lessonTitle: `Bài 2: Ngày hôm qua đâu rồi? (Tiết ${p - 4}: Đọc)`,
        subSubject: "Đọc",
        curriculumPeriod: p,
        integrationNotes: "Đạo đức lối sống: Quý trọng thời gian. QCN: Quyền được học tập."
      };
      if (p === 7) return {
        lessonTitle: "Bài 2: Ngày hôm qua đâu rồi? (Tiết 3: Viết Nghe - viết)",
        subSubject: "Viết",
        curriculumPeriod: 7,
        integrationNotes: "Rèn chữ viết cẩn thận, chính xác."
      };
      if (p === 8) return {
        lessonTitle: "Bài 2: Ngày hôm qua đâu rồi? (Tiết 4: Từ ngữ chỉ sự vật, hoạt động; Câu giới thiệu)",
        subSubject: "Luyện từ và câu",
        curriculumPeriod: 8,
        integrationNotes: "KNS: Tự chuẩn bị đồ dùng học tập, tự tin giới thiệu bản thân."
      };
      return {
        lessonTitle: `Bài 2: Ngày hôm qua đâu rồi? (Tiết ${p - 4}: Viết đoạn văn giới thiệu bản thân & Đọc mở rộng)`,
        subSubject: "Viết đoạn văn",
        curriculumPeriod: p,
        integrationNotes: "Tích hợp NLS 1.2.CB1a, AI 2.A1.1: Tìm thơ thiếu nhi trên nguồn số an toàn."
      };
    }
    if (week === 2) {
      if (p <= 2) return {
        lessonTitle: `Bài 3: Niềm vui của Bi và Bống (Tiết ${p}: Đọc)`,
        subSubject: "Đọc",
        curriculumPeriod: (week - 1) * 10 + p,
        integrationNotes: "QCN: Quyền được sống trong gia đình. Đạo đức: Yêu thương, chia sẻ với anh chị em."
      };
      if (p === 3) return {
        lessonTitle: "Bài 3: Niềm vui của Bi và Bống (Tiết 3: Viết Chữ hoa Ă, Â)",
        subSubject: "Viết",
        curriculumPeriod: (week - 1) * 10 + 3,
        integrationNotes: "Đạo đức: Uống nước nhớ nguồn, biết ơn người lao động."
      };
      if (p === 4) return {
        lessonTitle: "Bài 3: Niềm vui của Bi và Bống (Tiết 4: Nói và nghe Kể chuyện)",
        subSubject: "Nói và nghe",
        curriculumPeriod: (week - 1) * 10 + 4,
        integrationNotes: "QCN: Quyền bày tỏ ý kiến và sáng tạo qua kể chuyện."
      };
      if (p <= 6) return {
        lessonTitle: `Bài 4: Làm việc thật là vui (Tiết ${p - 4}: Đọc)`,
        subSubject: "Đọc",
        curriculumPeriod: (week - 1) * 10 + p,
        integrationNotes: "KNS: Quản lý thời gian. Tích hợp AI 2.A2.1: Nhận biết thiết bị thông minh hỗ trợ việc nhà."
      };
      return {
        lessonTitle: `Bài 4: Làm việc thật là vui (Tiết ${p - 4}: Viết & Luyện từ và câu)`,
        subSubject: "Luyện từ và câu",
        curriculumPeriod: (week - 1) * 10 + p,
        integrationNotes: "KNS: Giữ gìn sách vở, rèn thói quen đọc sách."
      };
    }
    if (week === 3) {
      if (p <= 2) return {
        lessonTitle: `Bài 5: Em có xinh không? (Tiết ${p}: Đọc)`,
        subSubject: "Đọc",
        curriculumPeriod: (week - 1) * 10 + p,
        integrationNotes: "QCN: Quyền được tôn trọng nét riêng, không chê bai ngoại hình."
      };
      if (p === 3) return { lessonTitle: "Bài 5: Em có xinh không? (Tiết 3: Viết Chữ hoa B)", subSubject: "Viết", curriculumPeriod: (week - 1) * 10 + 3 };
      if (p === 4) return { lessonTitle: "Bài 5: Em có xinh không? (Tiết 4: Kể chuyện)", subSubject: "Nói và nghe", curriculumPeriod: (week - 1) * 10 + 4 };
      if (p <= 6) return {
        lessonTitle: `Bài 6: Một giờ học (Tiết ${p - 4}: Đọc)`,
        subSubject: "Đọc",
        curriculumPeriod: (week - 1) * 10 + p,
        integrationNotes: "QCN: Bình đẳng cơ hội học tập, động viên bạn phát biểu."
      };
      return {
        lessonTitle: `Bài 6: Một giờ học (Tiết ${p - 4}: Viết & LTVC & Viết đoạn văn)`,
        subSubject: "Luyện từ và câu",
        curriculumPeriod: (week - 1) * 10 + p,
        integrationNotes: "NLS 1.1.CB1a: Tìm bài thơ về trẻ em làm việc nhà từ nguồn an toàn."
      };
    }
    return {
      lessonTitle: `Tiếng Việt 2 - Tuần ${week} (Tiết ${p})`,
      subSubject: p % 2 === 1 ? "Đọc" : "Viết",
      curriculumPeriod: (week - 1) * 10 + p,
      integrationNotes: "Phát triển năng lực ngôn ngữ và cảm thụ văn học tiểu học."
    };
  },

  "toán": (week: number, p: number) => {
    if (week === 1) {
      if (p <= 3) return {
        lessonTitle: `Bài 1: Ôn tập về các số đến 100 (Tiết ${p}: Luyện tập)`,
        curriculumPeriod: p,
        integrationNotes: p === 1 ? "NLS 1.3.CB1a: Nhận biết nơi sắp xếp dữ liệu bảng số có cấu trúc." : "Giáo dục dinh dưỡng: Ăn rau củ quả bổ sung vitamin."
      };
      if (p === 4) return {
        lessonTitle: "Bài 2: Tia số. Số liền trước, số liền sau (Tiết 1)",
        curriculumPeriod: 4,
        integrationNotes: "STEM: Tia số của em. Tích hợp AI 2.A1.1: Nhận biết AI tìm kiếm và sắp xếp số nhanh chóng."
      };
      return { lessonTitle: "Bài 2: Tia số. Số liền trước, số liền sau (Tiết 2: Luyện tập)", curriculumPeriod: 5, integrationNotes: "Học thông qua chơi." };
    }
    if (week === 2) {
      if (p === 1) return { lessonTitle: "Bài 3: Các thành phần của phép cộng, phép trừ (Tiết 1: Số hạng, tổng)", curriculumPeriod: 6 };
      if (p === 2) return { lessonTitle: "Bài 3: Các thành phần của phép cộng, phép trừ (Tiết 2: Số bị trừ, số trừ, hiệu)", curriculumPeriod: 7 };
      if (p === 3) return { lessonTitle: "Bài 3: Các thành phần của phép cộng, phép trừ (Tiết 3: Luyện tập)", curriculumPeriod: 8, integrationNotes: "NLS 5.2.CB1a: Trình bày thành phần phép tính trên slide/bảng tương tác." };
      if (p === 4) return { lessonTitle: "Bài 4: Hơn, kém nhau bao nhiêu (Tiết 1)", curriculumPeriod: 9, integrationNotes: "BVMT: Bỏ rác đúng nơi quy định. AI 2.D1.1: Camera thông minh đếm số lượng xe." };
      return { lessonTitle: "Bài 4: Hơn, kém nhau bao nhiêu (Tiết 2: Luyện tập)", curriculumPeriod: 10, integrationNotes: "KNS: Ăn uống đầy đủ để cơ thể phát triển tốt." };
    }
    if (week === 3) {
      if (p === 1) return { lessonTitle: "Bài 5: Ôn tập phép cộng, phép trừ (không nhớ) trong phạm vi 100 (Tiết 1)", curriculumPeriod: 11, integrationNotes: "ATGT đường thủy." };
      if (p === 2) return { lessonTitle: "Bài 5: Ôn tập phép cộng, phép trừ (không nhớ) trong phạm vi 100 (Tiết 2)", curriculumPeriod: 12, integrationNotes: "AI 2.A1.2: Trò chơi 'Máy tính có thể nhầm', tự kiểm tra kết quả." };
      if (p === 3) return { lessonTitle: "Bài 5: Ôn tập phép cộng, phép trừ (không nhớ) trong phạm vi 100 (Tiết 3)", curriculumPeriod: 13 };
      if (p === 4) return { lessonTitle: "Bài 6: Luyện tập chung (Tiết 1)", curriculumPeriod: 14, integrationNotes: "BVMT: Ý nghĩa của việc trồng cây." };
      return { lessonTitle: "Bài 6: Luyện tập chung (Tiết 2)", curriculumPeriod: 15, integrationNotes: "NLS 5.2.CB1a: Làm bài tập số trên Quizizz/bảng tương tác." };
    }
    if (week === 4) {
      if (p <= 5) return {
        lessonTitle: `Bài 7: Phép cộng (qua 10) trong phạm vi 20 (Tiết ${p})`,
        curriculumPeriod: (week - 1) * 5 + p,
        integrationNotes: p === 1 ? "AI 2.A1.2: Kiểm soát kết quả tính toán của máy." : p === 2 ? "NLS 5.2.CB1a: Thao tác tách số khi cộng qua 10." : "Đạo đức: Lối sống nhân ái, giúp đỡ bạn."
      };
    }
    return {
      lessonTitle: `Toán 2 - Tuần ${week} (Tiết ${p})`,
      curriculumPeriod: (week - 1) * 5 + p,
      integrationNotes: "Rèn luyện tư duy logic và kỹ năng giải toán lớp 2."
    };
  },

  "tự nhiên và xã hội": (week: number, p: number) => {
    if (week === 1) return {
      lessonTitle: `Bài 1: Các thế hệ trong gia đình (Tiết ${p})`,
      curriculumPeriod: p,
      integrationNotes: "QCN: Quyền được yêu thương, lắng nghe trong gia đình. AI 2.A2.1: Thiết bị thông minh hỗ trợ các thế hệ."
    };
    if (week === 2) return {
      lessonTitle: `Bài 2: Nghề nghiệp của người lớn trong gia đình (Tiết ${p})`,
      curriculumPeriod: 2 + p,
      integrationNotes: p === 1 ? "NLS 5.2.CB1a: Công nghệ hỗ trợ nghề nghiệp. Đạo đức: Trân trọng mọi nghề chân chính." : "STEM: Thiết kế sổ tay nghề nghiệp bản thân. AI 2.A1.1: Tìm kiếm nghề nghiệp an toàn."
    };
    if (week === 3) return {
      lessonTitle: `Bài 3: Phòng tránh ngộ độc khi ở nhà (Tiết ${p})`,
      curriculumPeriod: 4 + p,
      integrationNotes: "QCN: Quyền được sử dụng thực phẩm an toàn. AI 2.C3.1: AI hỗ trợ phân loại thức ăn tươi/hỏng."
    };
    if (week === 4) return {
      lessonTitle: `Bài 4: Giữ sạch nhà ở (Tiết ${p})`,
      curriculumPeriod: 6 + p,
      integrationNotes: p === 1 ? "AI 2.A2.2: Robot hút bụi, thiết bị thông minh làm việc nhà." : "STEM: Nước lau bàn tự nhiên. BVMT: Tái sử dụng vỏ hộp."
    };
    return {
      lessonTitle: `Bài học TNXH 2 tuần ${week} (Tiết ${p})`,
      curriculumPeriod: (week - 1) * 2 + p,
      integrationNotes: "Khám phá tự nhiên và môi trường sống lớp 2."
    };
  },

  "đạo đức": (week: number) => {
    if (week === 1 || week === 2) return {
      lessonTitle: `Bài 1: Vẻ đẹp quê hương em (Tiết ${week})`,
      curriculumPeriod: week,
      integrationNotes: "GDQPAN: Bảo vệ chủ quyền, toàn vẹn lãnh thổ. BVMT: Giữ sạch cảnh quan quê hương. NLS 1.1.CB1a, AI 2.A1.1"
    };
    if (week === 3 || week === 4 || week === 5) return {
      lessonTitle: `Bài 2: Em yêu quê hương (Tiết ${week - 2})`,
      curriculumPeriod: week,
      integrationNotes: "GDQPAN: Tự hào dân tộc Việt Nam. Lối sống nhân ái, chăm sóc cây xanh quê hương. AI 2.A1.1"
    };
    if (week === 6 || week === 7) return {
      lessonTitle: `Bài 3: Kính trọng thầy giáo, cô giáo (Tiết ${week - 5})`,
      curriculumPeriod: week,
      integrationNotes: "QCN: Quyền được học tập, bổn phận kính trọng thầy cô. NLS 2.5.CB1a, AI 2.A1.2"
    };
    return {
      lessonTitle: `Đạo đức 2 - Tuần ${week}`,
      curriculumPeriod: week,
      integrationNotes: "Rèn luyện nhân cách và lối sống văn minh."
    };
  },

  "hoạt động trải nghiệm": (week: number, p: number) => {
    if (week === 1) {
      if (p === 1) return { lessonTitle: "Sinh hoạt dưới cờ: THAM GIA LỄ KHAI GIẢNG NĂM HỌC MỚI", curriculumPeriod: 1, integrationNotes: "QCN: Quyền và nghĩa vụ học tập, rèn luyện." };
      if (p === 2) return { lessonTitle: "HĐGDCĐ: HÌNH ẢNH CỦA EM (TIẾT 2)", curriculumPeriod: 2, integrationNotes: "QCN: Quyền được tôn trọng. NLS 2.6.CB1a: Danh tính số và Avatar thân thiện. AI 2.A1.2" };
      return { lessonTitle: "Sinh hoạt lớp: SƠ KẾT TUẦN 1 - HÌNH ẢNH CỦA EM", curriculumPeriod: 3, integrationNotes: "Tự tin giới thiệu bản thân và xây dựng tình bạn." };
    }
    if (week === 2) {
      if (p === 1) return { lessonTitle: "Sinh hoạt dưới cờ: NỤ CƯỜI THÂN THIỆN", curriculumPeriod: 4, integrationNotes: "Giao tiếp văn minh, lan tỏa năng lượng tích cực." };
      if (p === 2) return { lessonTitle: "HĐGDCĐ: NỤ CƯỜI THÂN THIỆN", curriculumPeriod: 5, integrationNotes: "QCN: Quyền được vui chơi, chia sẻ cảm xúc. AI 2.C3.1: Nhận diện cảm xúc." };
      return { lessonTitle: "Sinh hoạt lớp: SINH HOẠT THEO CHỦ ĐỀ: NỤ CƯỜI THÂN THIỆN", curriculumPeriod: 6, integrationNotes: "Thực hành ứng xử hòa nhã với bạn bè." };
    }
    if (week === 3) {
      if (p === 1) return { lessonTitle: "Sinh hoạt dưới cờ: TẬP TRUNG TOÀN TRƯỜNG", curriculumPeriod: 7, integrationNotes: "Nền nếp chào cờ và sinh hoạt tập thể." };
      if (p === 2) return { lessonTitle: "HĐGDCĐ: LUYỆN TAY CHO KHÉO", curriculumPeriod: 8, integrationNotes: "KNS: Sự khéo léo, cẩn thận. BVMT: Tận dụng vật liệu tái chế. AI 2.C1.2" };
      return { lessonTitle: "Sinh hoạt lớp: SƠ KẾT TUẦN - LUYỆN TAY CHO KHÉO", curriculumPeriod: 9, integrationNotes: "Tuyên dương tinh thần khéo léo và giữ vệ sinh lớp." };
    }
    return {
      lessonTitle: p === 1 ? `SHDC Tuần ${week}` : p === 2 ? `HĐGDCĐ Tuần ${week}` : `Sinh hoạt lớp Tuần ${week}`,
      curriculumPeriod: (week - 1) * 3 + p,
      integrationNotes: "Trải nghiệm rèn nếp sống và kỹ năng công dân số."
    };
  }
};

// -------------------------------------------------------------
// KHỐI 4 CURRICULUM MAPPING (Tuần 1 - Tuần 35)
// -------------------------------------------------------------
export const GRADE_4_CURRICULUM: Record<string, (week: number, p: number) => LessonInfo> = {
  "tiếng việt": (week: number, p: number) => {
    if (week === 1) {
      if (p === 1) return {
        lessonTitle: "Bài 1: Điều kì diệu (Tiết 1: Đọc)",
        subSubject: "Đọc",
        curriculumPeriod: 1,
        integrationNotes: "QCN: Tôn trọng sự khác biệt, không trêu chọc bạn. NLS 2.3.CB1a. AI 4.A1.1"
      };
      if (p === 2) return {
        lessonTitle: "Bài 1: Điều kì diệu (Tiết 2: Luyện từ và câu: Danh từ)",
        subSubject: "Luyện từ và câu",
        curriculumPeriod: 2,
        integrationNotes: "QCN: Lời nói lịch sự khi nêu nhận xét. NLS 5.2.CB1a. AI 4.A1.2"
      };
      if (p === 3) return {
        lessonTitle: "Bài 1: Điều kì diệu (Tiết 3: Viết: Tìm hiểu đoạn văn và câu chủ đề)",
        subSubject: "Viết",
        curriculumPeriod: 3,
        integrationNotes: "NLS 3.2.CB1a, 5.2.CB1a: Sơ đồ cấu tạo đoạn văn. AI 4.A1.2"
      };
      if (p <= 5) return {
        lessonTitle: `Bài 2: Thi nhạc (Tiết ${p - 3}: Đọc)`,
        subSubject: "Đọc",
        curriculumPeriod: p,
        integrationNotes: "NLS 1.1.CB1a, AI 4.A1.1 (Nhận diện âm thanh). QCN: Tôn trọng năng khiếu riêng."
      };
      if (p === 6) return {
        lessonTitle: "Bài 2: Thi nhạc (Tiết 3: Viết: Tìm hiểu cách viết đoạn văn nêu ý kiến)",
        subSubject: "Viết",
        curriculumPeriod: 6,
        integrationNotes: "NLS 3.2.CB1a: Sơ đồ cấu trúc đoạn văn nêu ý kiến. AI 4.A1.2"
      };
      return {
        lessonTitle: "Bài 2: Thi nhạc (Tiết 4: Nói và nghe: Tôi và bạn)",
        subSubject: "Nói và nghe",
        curriculumPeriod: 7,
        integrationNotes: "QCN: Tôn trọng bạn bè khi trình bày. NLS 2.3.CB1a. AI 4.B2.1: Bảo vệ thông tin cá nhân."
      };
    }
    if (week === 2) {
      if (p === 1) return { lessonTitle: "Bài 3: Anh em sinh đôi (Tiết 1: Đọc)", subSubject: "Đọc", curriculumPeriod: 8, integrationNotes: "AI 4.A1.1: Phát hiện điểm giống và khác trong hình ảnh." };
      if (p === 2) return { lessonTitle: "Bài 3: Anh em sinh đôi (Tiết 2: LTVC: Danh từ chung, danh từ riêng)", subSubject: "Luyện từ và câu", curriculumPeriod: 9, integrationNotes: "NLS 1.1.CB1a: Tra cứu tên riêng chính xác." };
      if (p === 3) return { lessonTitle: "Bài 3: Anh em sinh đôi (Tiết 3: Viết: Tìm ý cho đoạn văn nêu ý kiến)", subSubject: "Viết", curriculumPeriod: 10, integrationNotes: "AI 4.A1.2: Gợi ý câu hỏi tìm ý, tự viết lời riêng." };
      if (p <= 5) return { lessonTitle: `Bài 4: Công chúa và người dẫn chuyện (Tiết ${p - 3}: Đọc)`, subSubject: "Đọc", curriculumPeriod: 8 + p, integrationNotes: "QCN: Quyền tham gia hoạt động tập thể. AI 4.A1.2" };
      if (p === 6) return { lessonTitle: "Bài 4: Công chúa và người dẫn chuyện (Tiết 3: Viết đoạn văn nêu ý kiến)", subSubject: "Viết", curriculumPeriod: 13, integrationNotes: "NLS 3.2.CB1a: Đọc soát lỗi, chỉnh sửa đoạn văn." };
      return { lessonTitle: "Bài 4: Công chúa và người dẫn chuyện (Tiết 4: Đọc mở rộng)", subSubject: "Đọc mở rộng", curriculumPeriod: 14, integrationNotes: "NLS 1.1.CB1a: Tìm đọc câu chuyện từ nguồn đáng tin cậy." };
    }
    if (week === 3) {
      if (p === 1) return { lessonTitle: "Bài 5: Thằn lằn xanh và tắc kè (Tiết 1: Đọc)", subSubject: "Đọc", curriculumPeriod: 15, integrationNotes: "BVMT: Yêu quý động vật nhỏ, giữ cân bằng sinh thái." };
      if (p === 2) return { lessonTitle: "Bài 5: Thằn lằn xanh và tắc kè (Tiết 2: LTVC: Luyện tập về danh từ)", subSubject: "Luyện từ và câu", curriculumPeriod: 16, integrationNotes: "NLS 1.1.CB1a: Tra cứu thông tin hiện tượng tự nhiên." };
      if (p === 3) return { lessonTitle: "Bài 5: Thằn lằn xanh và tắc kè (Tiết 3: Viết: Trả bài viết đoạn văn nêu ý kiến)", subSubject: "Viết", curriculumPeriod: 17, integrationNotes: "AI 4.A1.2: Gợi ý cách sửa câu, làm câu văn rõ ràng." };
      if (p <= 5) return { lessonTitle: `Bài 6: Nghệ sĩ trống (Tiết ${p - 3}: Đọc)`, subSubject: "Đọc", curriculumPeriod: 15 + p, integrationNotes: "AI 4.A1.1: AI hỗ trợ luyện nghe nhịp, con người cần nỗ lực rèn luyện." };
      if (p === 6) return { lessonTitle: "Bài 6: Nghệ sĩ trống (Tiết 3: Viết: Tìm hiểu cách viết báo cáo thảo luận nhóm)", subSubject: "Viết", curriculumPeriod: 20, integrationNotes: "NLS 3.2.CB1a: Trình bày báo cáo nhóm bằng công cụ soạn thảo số." };
      return { lessonTitle: "Bài 6: Nghệ sĩ trống (Tiết 4: Nói và nghe: Bốn anh tài)", subSubject: "Nói và nghe", curriculumPeriod: 21, integrationNotes: "Lối sống: Bốn anh tài - tinh thần đoàn kết, dũng cảm vì tập thể." };
    }
    return {
      lessonTitle: `Tiếng Việt 4 - Tuần ${week} (Tiết ${p})`,
      subSubject: p % 2 === 1 ? "Đọc" : "Viết",
      curriculumPeriod: (week - 1) * 7 + p,
      integrationNotes: "Phát triển toàn diện năng lực Đọc - Viết - Nói & Nghe lớp 4."
    };
  },

  "toán": (week: number, p: number) => {
    if (week === 1) {
      if (p <= 2) return {
        lessonTitle: `Bài 1: Ôn tập các số đến 100 000 (Tiết ${p})`,
        curriculumPeriod: p,
        integrationNotes: "Tích hợp AI 4.A1.1: Xử lý và sắp xếp lượng dữ liệu số khổng lồ nhanh hơn con người."
      };
      return {
        lessonTitle: `Bài 2: Ôn tập các phép tính trong phạm vi 100 000 (Tiết ${p - 2})`,
        curriculumPeriod: p,
        integrationNotes: "Tích hợp AI 4.A1.2: Kiểm tra và phát hiện lỗi tính toán của máy."
      };
    }
    if (week === 2) {
      if (p <= 2) return {
        lessonTitle: `Bài 3: Số chẵn, số lẻ (Tiết ${p})`,
        curriculumPeriod: 5 + p,
        integrationNotes: "Tích hợp AI 4.C4.1: Tư duy thuật toán dựa trên luật (Nếu... thì...)."
      };
      return {
        lessonTitle: `Bài 4: Biểu thức chứa chữ (Tiết ${p - 2})`,
        curriculumPeriod: 5 + p,
        integrationNotes: "NLS 5.2.CB1a, AI 4.C4.1 (Khái niệm 'biến' trong lập trình điều khiển AI)."
      };
    }
    if (week === 3) {
      if (p <= 2) return {
        lessonTitle: `Bài 5: Giải bài toán có ba bước tính (Tiết ${p})`,
        curriculumPeriod: 10 + p,
        integrationNotes: "Tích hợp AI 4.D1.1: Quy trình giải quyết vấn đề (Thu thập - Xử lý - Đánh giá)."
      };
      if (p <= 4) return {
        lessonTitle: `Bài 6: Luyện tập chung (Tiết ${p - 2})`,
        curriculumPeriod: 10 + p,
        integrationNotes: "Củng cố kỹ năng giải toán nhiều bước."
      };
      return {
        lessonTitle: "Bài 7: Đo góc, đơn vị đo góc (Tiết 1)",
        curriculumPeriod: 15,
        integrationNotes: "Tích hợp AI 4.C5.1: AI dùng camera nhận dạng và đo đạc hình ảnh vật thể."
      };
    }
    return {
      lessonTitle: `Toán 4 - Tuần ${week} (Tiết ${p})`,
      curriculumPeriod: (week - 1) * 5 + p,
      integrationNotes: "Phát triển tư duy logic và kỹ năng toán học lớp 4."
    };
  },

  "khoa học": (week: number, p: number) => {
    if (week === 1) return {
      lessonTitle: `Bài 1: Tính chất của nước và nước với cuộc sống (Tiết ${p})`,
      curriculumPeriod: p,
      integrationNotes: p === 1 ? "Tiết kiệm và bảo vệ nguồn nước sạch." : "AI 4.A1.1: Hệ thống vòi nước thông minh và cảm biến đo nước."
    };
    if (week === 2) return {
      lessonTitle: `Bài 2: Sự chuyển thể của nước và vòng tuần hoàn của nước trong tự nhiên (Tiết ${p})`,
      curriculumPeriod: 2 + p,
      integrationNotes: p === 1 ? "AI 4.D1.1: Dự báo giai đoạn tuần hoàn nước." : "STEM: Sự chuyển thể của nước và vòng tuần hoàn."
    };
    if (week === 3) return {
      lessonTitle: `Bài 3: Sự ô nhiễm và bảo vệ nguồn nước. Một số cách làm sạch nước (Tiết ${p})`,
      curriculumPeriod: 4 + p,
      integrationNotes: p === 1 ? "BVMT & AI 4.A1.1: Robot giám sát nguồn nước tự động." : "NLS 1.1.CB1a: Tìm hiểu nguyên nhân và tác hại ô nhiễm nước."
    };
    if (week === 4) return {
      lessonTitle: `Bài 4: Không khí có ở đâu? Tính chất và thành phần của không khí (Tiết ${p})`,
      curriculumPeriod: 6 + p,
      integrationNotes: "AI 4.A1.1: Cảm biến AI giám sát chất lượng không khí và lọc bụi mịn."
    };
    return {
      lessonTitle: `Khoa học 4 - Tuần ${week} (Tiết ${p})`,
      curriculumPeriod: (week - 1) * 2 + p,
      integrationNotes: "Khám phá khoa học tự nhiên theo chương trình GDPT 2018."
    };
  },

  "lịch sử và địa lí": (week: number, p: number) => {
    if (week === 1) return {
      lessonTitle: `Bài 1: Làm quen với phương tiện học tập môn Lịch sử và Địa lí (Tiết ${p})`,
      curriculumPeriod: p,
      integrationNotes: p === 1 ? "QPAN: Khai thác bản đồ Việt Nam, chủ quyền Hoàng Sa - Trường Sa. NLS 1.1.CB1a" : "AI 4.A1.2: Sử dụng sơ đồ tư duy AI, tự kiểm tra kiến thức."
    };
    if (week === 2) return {
      lessonTitle: `Bài 2: Thiên nhiên và con người ở địa phương em (Tiết ${p})`,
      curriculumPeriod: 2 + p,
      integrationNotes: p === 1 ? "QPAN: Bản đồ hành chính địa phương mới sau sáp nhập." : "NLS 1.1.CB1a, 1.2.CB1a: Tìm thông tin cơ bản về quê hương."
    };
    if (week === 3) return {
      lessonTitle: `Bài 3: Lịch sử và văn hoá truyền thống địa phương em (Tiết ${p})`,
      curriculumPeriod: 4 + p,
      integrationNotes: p === 1 ? "Lối sống: Tự hào, biết ơn thế hệ đi trước." : "STEM & NLS: Trình chiếu giới thiệu lịch sử văn hoá địa phương."
    };
    if (week === 4) return {
      lessonTitle: `Bài 4: Thiên nhiên vùng Trung du và miền núi phía Bắc (Tiết ${p})`,
      curriculumPeriod: 6 + p,
      integrationNotes: p === 1 ? "QPAN: Vị trí biên giới phía Bắc, tôn trọng cột mốc." : "BVMT: Vai trò rừng đầu nguồn, phòng tránh sạt lở."
    };
    return {
      lessonTitle: `Lịch sử & Địa lí 4 - Tuần ${week} (Tiết ${p})`,
      curriculumPeriod: (week - 1) * 2 + p,
      integrationNotes: "Bồi dưỡng lòng yêu nước và hiểu biết địa lí quê hương."
    };
  },

  "đạo đức": (week: number) => {
    if (week <= 4) return {
      lessonTitle: `Bài 1: Biết ơn người lao động (Tiết ${week})`,
      curriculumPeriod: week,
      integrationNotes: week === 1 ? "AI 4.A1.1, 4.C2.1: Người lao động thông minh (Robot thu hoạch, AI chẩn đoán)." : week === 2 ? "Lối sống: Biết ơn người lao động bằng lời nói, việc làm." : week === 3 ? "QCN: Quyền được tôn trọng của người lao động." : "NLS 1.1.CB1a: Tìm hiểu câu chuyện về người lao động."
    };
    if (week <= 8) return {
      lessonTitle: `Bài 2: Cảm thông, giúp đỡ người gặp khó khăn (Tiết ${week - 4})`,
      curriculumPeriod: week,
      integrationNotes: "QCN: Không phân biệt đối xử. AI 4.A2.2: AI hỗ trợ người khiếm thị/khiếm thính."
    };
    return {
      lessonTitle: `Đạo đức 4 - Tuần ${week}`,
      curriculumPeriod: week,
      integrationNotes: "Bồi dưỡng phẩm chất nhân ái, trung thực, trách nhiệm."
    };
  },

  "công nghệ": (week: number) => {
    if (week <= 3) return {
      lessonTitle: `Bài 1: Lợi ích của hoa, cây cảnh đối với đời sống (Tiết ${week})`,
      curriculumPeriod: week,
      integrationNotes: week === 1 ? "AI 4.C2.1: Nhận diện, gọi tên hoa cây cảnh qua ảnh." : week === 2 ? "NLS 1.1.CB1a: Tìm hiểu cây làm sạch không khí." : "BVMT: Trồng và chăm sóc hoa cây cảnh tạo oxy."
    };
    if (week <= 6) return {
      lessonTitle: `Bài 2: Một số loại hoa, cây cảnh phổ biến (Tiết ${week - 3})`,
      curriculumPeriod: week,
      integrationNotes: "QPAN: Hoa mai, hoa sen - biểu tượng văn hóa Việt Nam. NLS 1.1.CB1a"
    };
    return {
      lessonTitle: `Công nghệ 4 - Tuần ${week}`,
      curriculumPeriod: week,
      integrationNotes: "Ứng dụng kỹ thuật trồng trọt và công nghệ đời sống."
    };
  },

  "hoạt động trải nghiệm": (week: number, p: number) => {
    if (week === 1) {
      if (p === 1) return { lessonTitle: "HĐ SHDC: Chào năm học mới", curriculumPeriod: 1, integrationNotes: "Hòa nhập và phấn khởi tựu trường." };
      if (p === 2) return { lessonTitle: "HĐ GDTCĐ: Em tự hào về bản thân", curriculumPeriod: 2, integrationNotes: "QCN: Quyền được tôn trọng đặc điểm riêng. AI 4.A1.2: AI hỗ trợ gợi ý trình bày." };
      return { lessonTitle: "HĐ SHL: Tự hào thể hiện khả năng của bản thân", curriculumPeriod: 3, integrationNotes: "Tự tin phát huy sở trường cá nhân." };
    }
    if (week === 2) {
      if (p === 1) return { lessonTitle: "HĐ SHDC: Câu lạc bộ của em", curriculumPeriod: 4, integrationNotes: "Gắn kết hoạt động ngoại khóa." };
      if (p === 2) return { lessonTitle: "HĐ GDTCĐ: Những việc làm đáng tự hào của bản thân", curriculumPeriod: 5, integrationNotes: "KNS: Tự nhận thức và ghi nhận việc làm tốt." };
      return { lessonTitle: "HĐ SHL: Niềm tự hào trong tim", curriculumPeriod: 6, integrationNotes: "Chia sẻ cảm xúc tích cực với bạn bè." };
    }
    if (week === 3) {
      if (p === 1) return { lessonTitle: "HĐ SHDC: Giao lưu tài năng học trò - Nụ cười lan toả niềm vui", curriculumPeriod: 7, integrationNotes: "Lan tỏa tinh thần lạc quan." };
      if (p === 2) return { lessonTitle: "HĐ GDTCĐ: Khả năng điều chỉnh cảm xúc", curriculumPeriod: 8, integrationNotes: "QCN: Quyền được bày tỏ cảm xúc. KNS: Kỹ năng điều hòa cảm xúc." };
      return { lessonTitle: "HĐ SHL: Điều chỉnh cảm xúc", curriculumPeriod: 9, integrationNotes: "Học cách bình tĩnh và ứng xử lịch sự." };
    }
    return {
      lessonTitle: p === 1 ? `HĐ SHDC Tuần ${week}` : p === 2 ? `HĐ GDTCĐ Tuần ${week}` : `HĐ SHL Tuần ${week}`,
      curriculumPeriod: (week - 1) * 3 + p,
      integrationNotes: "Rèn luyện phẩm chất và kỹ năng sống học đường."
    };
  }
};

// -------------------------------------------------------------
// KHỐI 5 CURRICULUM MAPPING (Tuần 1 - Tuần 35)
// -------------------------------------------------------------
export const GRADE_5_CURRICULUM: Record<string, (week: number, p: number) => LessonInfo> = {
  "tiếng việt": (week: number, p: number) => {
    if (week === 1) {
      if (p === 1) return { lessonTitle: "Bài 1: Thanh âm của gió (Tiết 1: Đọc)", subSubject: "Đọc", curriculumPeriod: 1, integrationNotes: "Cảm thụ âm thanh thiên nhiên." };
      if (p === 2) return { lessonTitle: "Bài 1: Thanh âm của gió (Tiết 2: LTVC: Luyện tập về danh từ, động từ, tính từ)", subSubject: "Luyện từ và câu", curriculumPeriod: 2 };
      if (p === 3) return { lessonTitle: "Bài 1: Thanh âm của gió (Tiết 3: Viết: Tìm hiểu cách viết bài văn kể chuyện sáng tạo)", subSubject: "Viết", curriculumPeriod: 3 };
      if (p <= 5) return { lessonTitle: `Bài 2: Cánh đồng hoa (Tiết ${p - 3}: Đọc)`, subSubject: "Đọc", curriculumPeriod: p };
      if (p === 6) return { lessonTitle: "Bài 2: Cánh đồng hoa (Tiết 3: Viết: Tìm hiểu cách viết bài văn kể chuyện sáng tạo (tiếp theo))", subSubject: "Viết", curriculumPeriod: 6 };
      return { lessonTitle: "Bài 2: Cánh đồng hoa (Tiết 4: Đọc mở rộng)", subSubject: "Đọc mở rộng", curriculumPeriod: 7 };
    }
    if (week === 2) {
      if (p === 1) return { lessonTitle: "Bài 3: Tuổi Ngựa (Tiết 1: Đọc)", subSubject: "Đọc", curriculumPeriod: 8 };
      if (p === 2) return { lessonTitle: "Bài 3: Tuổi Ngựa (Tiết 2: LTVC: Đại từ)", subSubject: "Luyện từ và câu", curriculumPeriod: 9 };
      if (p === 3) return { lessonTitle: "Bài 3: Tuổi Ngựa (Tiết 3: Viết: Lập dàn ý cho bài văn kể chuyện sáng tạo)", subSubject: "Viết", curriculumPeriod: 10 };
      if (p <= 5) return { lessonTitle: `Bài 4: Bến sông tuổi thơ (Tiết ${p - 3}: Đọc)`, subSubject: "Đọc", curriculumPeriod: 8 + p };
      if (p === 6) return { lessonTitle: "Bài 4: Bến sông tuổi thơ (Tiết 3: Viết: Viết bài văn kể chuyện sáng tạo)", subSubject: "Viết", curriculumPeriod: 13 };
      return { lessonTitle: "Bài 4: Bến sông tuổi thơ (Tiết 4: Nói và nghe: Những câu chuyện thú vị)", subSubject: "Nói và nghe", curriculumPeriod: 14 };
    }
    if (week === 3) {
      if (p === 1) return { lessonTitle: "Bài 5: Tiếng hạt nảy mầm (Tiết 1: Đọc)", subSubject: "Đọc", curriculumPeriod: 15, integrationNotes: "Tích hợp AI 1.A1.1, BVMT: Yêu mầm cây xanh." };
      if (p === 2) return { lessonTitle: "Bài 5: Tiếng hạt nảy mầm (Tiết 2: LTVC: Luyện tập về đại từ)", subSubject: "Luyện từ và câu", curriculumPeriod: 16, integrationNotes: "Tích hợp NLS 5.2.CB1a: Bảng phân loại đại từ." };
      if (p === 3) return { lessonTitle: "Bài 5: Tiếng hạt nảy mầm (Tiết 3: Viết: Đánh giá, chỉnh sửa bài văn kể chuyện sáng tạo)", subSubject: "Viết", curriculumPeriod: 17, integrationNotes: "Tích hợp AI 4.A1.2: Gợi ý sửa câu văn." };
      if (p <= 5) return { lessonTitle: `Bài 6: Ngôi sao sân cỏ (Tiết ${p - 3}: Đọc)`, subSubject: "Đọc", curriculumPeriod: 15 + p, integrationNotes: "Tích hợp QCN, Tinh thần thể thao lành mạnh." };
      if (p === 6) return { lessonTitle: "Bài 6: Ngôi sao sân cỏ (Tiết 3: Viết: Tìm hiểu cách viết báo cáo công việc)", subSubject: "Viết", curriculumPeriod: 20, integrationNotes: "Tích hợp NLS 3.2.CB1a: Định dạng văn bản báo cáo." };
      return { lessonTitle: "Bài 6: Ngôi sao sân cỏ (Tiết 4: Đọc mở rộng)", subSubject: "Đọc mở rộng", curriculumPeriod: 21, integrationNotes: "Tích hợp NLS 1.1.CB1a: Tìm đọc sách an toàn." };
    }
    return {
      lessonTitle: `Tiếng Việt 5 - Tuần ${week} (Tiết ${p})`,
      subSubject: p % 2 === 1 ? "Đọc" : "Viết",
      curriculumPeriod: (week - 1) * 7 + p,
      integrationNotes: "Chuẩn kiến thức kỹ năng Tiếng Việt 5 GDPT 2018."
    };
  },

  "toán": (week: number, p: number) => {
    if (week === 1) {
      if (p <= 2) return { lessonTitle: `Bài 1: Ôn tập số tự nhiên (Tiết ${p})`, curriculumPeriod: p };
      if (p <= 4) return { lessonTitle: `Bài 2: Ôn tập các phép tính với số tự nhiên (Tiết ${p - 2})`, curriculumPeriod: p };
      return { lessonTitle: "Bài 3: Ôn tập phân số (Tiết 1)", curriculumPeriod: 5 };
    }
    if (week === 2) {
      if (p === 1) return { lessonTitle: "Bài 3: Ôn tập phân số (Tiết 2)", curriculumPeriod: 6 };
      if (p === 2) return { lessonTitle: "Bài 4: Phân số thập phân (Tiết 1)", curriculumPeriod: 7 };
      return { lessonTitle: `Bài 5: Ôn tập các phép tính với phân số (Tiết ${p - 2})`, curriculumPeriod: 5 + p };
    }
    if (week === 3) {
      if (p <= 2) return { lessonTitle: `Bài 6: Cộng, trừ hai phân số khác mẫu số (Tiết ${p})`, curriculumPeriod: 10 + p, integrationNotes: "Tích hợp AI 4.C4.1, NLS 5.2.CB1a." };
      if (p <= 4) return { lessonTitle: `Bài 7: Hỗn số (Tiết ${p - 2})`, curriculumPeriod: 10 + p, integrationNotes: "STEM: Trực quan hóa hỗn số." };
      return { lessonTitle: "Bài 8: Ôn tập hình học và đo lường (Tiết 1)", curriculumPeriod: 15, integrationNotes: "GDDD: Đo lường nông sản sạch." };
    }
    return {
      lessonTitle: `Toán 5 - Tuần ${week} (Tiết ${p})`,
      curriculumPeriod: (week - 1) * 5 + p,
      integrationNotes: "Toán học ứng dụng và tư duy phân số, số thập phân."
    };
  },

  "khoa học": (week: number, p: number) => {
    if (week === 1) return {
      lessonTitle: `Bài 1: Thành phần và vai trò của đất đối với cây trồng (Tiết ${p})`,
      curriculumPeriod: p,
      integrationNotes: "Đất là tài nguyên quý giá, cung cấp dinh dưỡng cho cây trồng."
    };
    if (week === 2) return {
      lessonTitle: `Bài 2: Ô nhiễm, xói mòn đất và bảo vệ môi trường đất (Tiết ${p})`,
      curriculumPeriod: 2 + p,
      integrationNotes: "BVMT: Nguyên nhân và tác hại của xói mòn đất."
    };
    if (week === 3) {
      if (p === 1) return {
        lessonTitle: "Bài 2: Ô nhiễm, xói mòn đất và bảo vệ môi trường đất (Tiết 3)",
        curriculumPeriod: 5,
        integrationNotes: "BVMT, GDDD: Đất sạch nuôi dưỡng thực phẩm sạch. AI 4.A1.1"
      };
      return {
        lessonTitle: "Bài 3: Hỗn hợp và dung dịch (Tiết 1)",
        curriculumPeriod: 6,
        integrationNotes: "STEM thực nghiệm: Phân biệt hỗn hợp và dung dịch."
      };
    }
    return {
      lessonTitle: `Khoa học 5 - Tuần ${week} (Tiết ${p})`,
      curriculumPeriod: (week - 1) * 2 + p,
      integrationNotes: "Khám phá khoa học tự nhiên lớp 5."
    };
  },

  "lịch sử và địa lí": (week: number, p: number) => {
    if (week === 1) return {
      lessonTitle: `Bài 1: Vị trí địa lí, lãnh thổ, đơn vị hành chính, Quốc kì, Quốc huy, Quốc ca (Tiết ${p})`,
      curriculumPeriod: p,
      integrationNotes: "GDQPAN: Tự hào chủ quyền lãnh thổ, Quốc kì, Quốc ca Việt Nam."
    };
    if (week === 2) return {
      lessonTitle: `Bài 2: Thiên nhiên Việt Nam (Tiết ${p}: Địa hình và khoáng sản)`,
      curriculumPeriod: 2 + p,
      integrationNotes: "Tự hào cảnh quan thiên nhiên đất nước."
    };
    if (week === 3) return {
      lessonTitle: `Bài 2: Thiên nhiên Việt Nam (Tiết ${2 + p}: Khí hậu và sông ngòi)`,
      curriculumPeriod: 4 + p,
      integrationNotes: "BVMT: Bảo vệ nguồn nước các con sông lớn của Tổ quốc."
    };
    return {
      lessonTitle: `Lịch sử & Địa lí 5 - Tuần ${week} (Tiết ${p})`,
      curriculumPeriod: (week - 1) * 2 + p,
      integrationNotes: "Lịch sử hào hùng và địa lí Việt Nam."
    };
  },

  "đạo đức": (week: number) => {
    if (week <= 4) return {
      lessonTitle: `Bài 1: Biết ơn những người có công với quê hương, đất nước (Tiết ${week})`,
      curriculumPeriod: week,
      integrationNotes: "GDQPAN, QCN: Tri ân các anh hùng liệt sĩ, người có công với Tổ quốc."
    };
    if (week <= 7) return {
      lessonTitle: `Bài 2: Tôn trọng sự khác biệt của người khác (Tiết ${week - 4})`,
      curriculumPeriod: week,
      integrationNotes: "QCN: Tôn trọng sự bình đẳng và bản sắc văn hóa các dân tộc."
    };
    return {
      lessonTitle: `Đạo đức 5 - Tuần ${week}`,
      curriculumPeriod: week,
      integrationNotes: "Bồi dưỡng phẩm chất công dân toàn cầu."
    };
  },

  "công nghệ": (week: number) => {
    if (week <= 2) return {
      lessonTitle: `Bài 1: Vai trò của công nghệ (Tiết ${week})`,
      curriculumPeriod: week,
      integrationNotes: "Công nghệ và cuộc sống hiện đại."
    };
    if (week <= 6) return {
      lessonTitle: `Bài 2: Nhà sáng chế (Tiết ${week - 2})`,
      curriculumPeriod: week,
      integrationNotes: "AI 4.D1.1: Khơi dậy niềm đam mê phát minh, sáng chế của học sinh."
    };
    return {
      lessonTitle: `Công nghệ 5 - Tuần ${week}`,
      curriculumPeriod: week,
      integrationNotes: "Khám phá kỹ thuật và công nghệ ứng dụng."
    };
  },

  "hoạt động trải nghiệm": (week: number, p: number) => {
    if (week === 1) {
      if (p === 1) return { lessonTitle: "Sinh hoạt dưới cờ: CHÀO NĂM HỌC MỚI", curriculumPeriod: 1, integrationNotes: "QCN: Quyền được học tập trong môi trường thân thiện." };
      if (p === 2) return { lessonTitle: "HĐGDCĐ: CHÚNG MÌNH ĐÃ LỚN", curriculumPeriod: 2, integrationNotes: "KNS: Ý thức trách nhiệm của học sinh lớp 5." };
      return { lessonTitle: "Sinh hoạt lớp: BẬC THANG TRƯỞNG THÀNH", curriculumPeriod: 3, integrationNotes: "Lập kế hoạch phấn đấu năm học cuối cấp." };
    }
    if (week === 2) {
      if (p === 1) return { lessonTitle: "Sinh hoạt dưới cờ: NGÀY HỘI CÂU LẠC BỘ", curriculumPeriod: 4, integrationNotes: "Khuyến khích phát triển tài năng." };
      if (p === 2) return { lessonTitle: "HĐGDCĐ: TỪNG BƯỚC TRƯỞNG THÀNH", curriculumPeriod: 5, integrationNotes: "Rèn nếp sống tự lập, tự giác." };
      return { lessonTitle: "Sinh hoạt lớp: TIẾN BỘ TRONG VIỆC NHÀ", curriculumPeriod: 6, integrationNotes: "Chia sẻ việc nhà cùng cha mẹ." };
    }
    if (week === 3) {
      if (p === 1) return { lessonTitle: "Sinh hoạt dưới cờ: HOẠT ĐỘNG VUI TRUNG THU", curriculumPeriod: 7, integrationNotes: "Tích hợp nét đẹp văn hóa truyền thống." };
      if (p === 2) return { lessonTitle: "HĐGDCĐ: NIỀM VUI NHÂN ĐÔI, NỖI BUỒN CHIA NỬA", curriculumPeriod: 8, integrationNotes: "KNS: Kỹ năng lắng nghe và chia sẻ cảm xúc." };
      return { lessonTitle: "Sinh hoạt lớp: CÂN BẰNG CẢM XÚC", curriculumPeriod: 9, integrationNotes: "Thực hành làm chủ cảm xúc bản thân." };
    }
    return {
      lessonTitle: p === 1 ? `SHDC Tuần ${week}` : p === 2 ? `HĐGDCĐ Tuần ${week}` : `Sinh hoạt lớp Tuần ${week}`,
      curriculumPeriod: (week - 1) * 3 + p,
      integrationNotes: "Hoạt động trải nghiệm sáng tạo và rèn luyện kỹ năng."
    };
  }
};

// -------------------------------------------------------------
// KHỐI 3 CURRICULUM MAPPING (Tuần 1 - Tuần 35)
// -------------------------------------------------------------
export const GRADE_3_CURRICULUM: Record<string, (week: number, p: number) => LessonInfo> = {
  "tiếng việt": (week: number, p: number) => {
    if (week === 1) {
      if (p <= 2) return { lessonTitle: "Bài 1: Ngày em vào Đội (Tiết 1-2: Đọc)", subSubject: "Đọc", curriculumPeriod: p, integrationNotes: "Tự hào Đội TNTP Hồ Chí Minh." };
      if (p === 3) return { lessonTitle: "Bài 1: Ngày em vào Đội (Tiết 3: Viết)", subSubject: "Viết", curriculumPeriod: 3 };
      if (p === 4) return { lessonTitle: "Bài 1: Ngày em vào Đội (Tiết 4: LTVC: Từ ngữ về Đội)", subSubject: "Luyện từ và câu", curriculumPeriod: 4 };
      if (p <= 6) return { lessonTitle: "Bài 2: Chiếc nhãn vở đặc biệt (Tiết 1-2: Đọc)", subSubject: "Đọc", curriculumPeriod: p };
      return { lessonTitle: "Bài 2: Chiếc nhãn vở đặc biệt (Tiết 3: Viết đoạn văn)", subSubject: "Viết", curriculumPeriod: 7 };
    }
    if (week === 2) {
      if (p <= 2) return { lessonTitle: "Bài 3: Lắng nghe những ngày hè (Tiết 1-2: Đọc)", subSubject: "Đọc", curriculumPeriod: 7 + p };
      if (p === 3) return { lessonTitle: "Bài 3: Lắng nghe những ngày hè (Tiết 3: Viết)", subSubject: "Viết", curriculumPeriod: 10 };
      if (p === 4) return { lessonTitle: "Bài 3: Luyện từ và câu: So sánh", subSubject: "LTVC", curriculumPeriod: 11 };
      if (p <= 6) return { lessonTitle: "Bài 4: Cánh rừng trong nắng (Tiết 1-2: Đọc)", subSubject: "Đọc", curriculumPeriod: 7 + p };
      return { lessonTitle: "Bài 4: Cánh rừng trong nắng (Tiết 3: Đọc mở rộng)", subSubject: "Đọc mở rộng", curriculumPeriod: 14 };
    }
    if (week === 3) {
      if (p <= 2) return { lessonTitle: "Bài 5: Mùa thu của em (Tiết 1-2: Đọc)", subSubject: "Đọc", curriculumPeriod: 14 + p, integrationNotes: "BVMT: Yêu cảnh sắc mùa thu quê hương." };
      if (p === 3) return { lessonTitle: "Bài 5: Mùa thu của em (Tiết 3: Viết)", subSubject: "Viết", curriculumPeriod: 17 };
      if (p === 4) return { lessonTitle: "Bài 5: LTVC: Từ chỉ đặc điểm", subSubject: "LTVC", curriculumPeriod: 18 };
      if (p <= 6) return { lessonTitle: "Bài 6: Gió heo may (Tiết 1-2: Đọc)", subSubject: "Đọc", curriculumPeriod: 14 + p };
      return { lessonTitle: "Bài 6: Gió heo may (Tiết 3: Kể chuyện)", subSubject: "Nói và nghe", curriculumPeriod: 21 };
    }
    return {
      lessonTitle: `Tiếng Việt 3 - Tuần ${week} (Tiết ${p})`,
      subSubject: p % 2 === 1 ? "Đọc" : "Viết",
      curriculumPeriod: (week - 1) * 7 + p,
      integrationNotes: "Chương trình Tiếng Việt 3 Kết nối tri thức."
    };
  },

  "toán": (week: number, p: number) => {
    if (week === 1) return {
      lessonTitle: `Bài 1: Ôn tập phép cộng, phép trừ trong phạm vi 1000 (Tiết ${p})`,
      curriculumPeriod: p,
      integrationNotes: "Củng cố tính nhẩm và đặt tính phép cộng, phép trừ."
    };
    if (week === 2) return {
      lessonTitle: `Bài 2: Ôn tập phép nhân, phép chia trong bảng (Tiết ${p})`,
      curriculumPeriod: 5 + p,
      integrationNotes: "Ôn bảng nhân, chia 2, 3, 4, 5."
    };
    if (week === 3) {
      if (p <= 3) return { lessonTitle: `Bài 3: Bảng nhân 3, Bảng chia 3 (Tiết ${p})`, curriculumPeriod: 10 + p };
      return { lessonTitle: `Bài 4: Bảng nhân 4, Bảng chia 4 (Tiết ${p - 3})`, curriculumPeriod: 10 + p };
    }
    return {
      lessonTitle: `Toán 3 - Tuần ${week} (Tiết ${p})`,
      curriculumPeriod: (week - 1) * 5 + p,
      integrationNotes: "Toán lớp 3 GDPT 2018."
    };
  },

  "tự nhiên và xã hội": (week: number, p: number) => {
    if (week === 1) return { lessonTitle: `Bài 1: Họ hàng nội, ngoại (Tiết ${p})`, curriculumPeriod: p, integrationNotes: "Tình cảm gắn bó với họ hàng hai bên nội ngoại." };
    if (week === 2) return { lessonTitle: `Bài 2: Một số ngày kỉ niệm, sự kiện của gia đình (Tiết ${p})`, curriculumPeriod: 2 + p, integrationNotes: "Biết ơn và trân trọng những ngày sum họp gia đình." };
    if (week === 3) return { lessonTitle: `Bài 3: Phòng tránh hỏa hoạn khi ở nhà (Tiết ${p})`, curriculumPeriod: 4 + p, integrationNotes: "KNS & ANQP: Phòng chống cháy nổ, thoát hiểm an toàn." };
    return { lessonTitle: `TNXH 3 - Tuần ${week} (Tiết ${p})`, curriculumPeriod: (week - 1) * 2 + p };
  },

  "đạo đức": (week: number) => {
    if (week <= 2) return { lessonTitle: `Bài 1: Kính trọng thầy giáo, cô giáo (Tiết ${week})`, curriculumPeriod: week };
    if (week <= 4) return { lessonTitle: `Bài 2: Yêu quý bạn bè (Tiết ${week - 2})`, curriculumPeriod: week };
    return { lessonTitle: `Đạo đức 3 - Tuần ${week}`, curriculumPeriod: week };
  },

  "hoạt động trải nghiệm": (week: number, p: number) => {
    if (week === 1) return { lessonTitle: p === 1 ? "SHDC: Chào năm học mới" : p === 2 ? "HĐGDCĐ: Khám phá bản thân" : "SHL: Sơ kết tuần 1", curriculumPeriod: p };
    if (week === 2) return { lessonTitle: p === 1 ? "SHDC: Giao lưu các câu lạc bộ" : p === 2 ? "HĐGDCĐ: Tự tin trong học tập" : "SHL: Sơ kết tuần 2", curriculumPeriod: 3 + p };
    if (week === 3) return { lessonTitle: p === 1 ? "SHDC: Hoạt động vui Tết Trung Thu" : p === 2 ? "HĐGDCĐ: Em và những người bạn" : "SHL: Cân bằng cảm xúc", curriculumPeriod: 6 + p };
    return { lessonTitle: `HĐTN 3 Tuần ${week} (Tiết ${p})`, curriculumPeriod: (week - 1) * 3 + p };
  }
};

// -------------------------------------------------------------
// SPECIALIST SUBJECT CURRICULUM (Môn Chuyên theo từng khối)
// -------------------------------------------------------------
export function getSpecialistLessonInfo(
  specialistSubject: string,
  grade: Grade,
  week: number,
  periodInWeek: number
): LessonInfo {
  const subLower = specialistSubject.toLowerCase();

  // 1. TIẾNG ANH (Lớp 1, 2, 3, 4, 5)
  if (subLower.includes("tiếng anh") || subLower.includes("anh văn") || subLower.includes("ta")) {
    const curP = (week - 1) * 4 + ((periodInWeek - 1) % 4) + 1;
    if (grade === 1) {
      const units1 = ["School Things", "Colors", "Numbers 1-5", "Family", "My Body", "Animals", "Toys", "Food"];
      const uName = units1[(week - 1) % units1.length];
      return {
        lessonTitle: `Unit ${Math.min(week, 8)}: ${uName} - Lesson ${((periodInWeek - 1) % 2) + 1}`,
        curriculumPeriod: curP,
        integrationNotes: "Tích hợp nhận biết âm thanh và từ vựng Tiếng Anh 1 sinh động.",
        specificCompetencies: [
          `Nhận diện và phát âm chuẩn các từ vựng chủ đề ${uName} trong Tiếng Anh 1.`,
          "Hào hứng tham gia các trò chơi ngôn ngữ, vận động theo bài hát Tiếng Anh."
        ]
      };
    }
    if (grade === 2) {
      const units2 = ["In the Classroom", "My House", "At the Zoo", "My Birthday", "Shapes", "Clothes", "Sports", "Activities"];
      const uName = units2[(week - 1) % units2.length];
      return {
        lessonTitle: `Unit ${Math.min(week, 8)}: ${uName} - Lesson ${((periodInWeek - 1) % 2) + 1}`,
        curriculumPeriod: curP,
        integrationNotes: "Tích hợp học qua chơi (STEM / Play-based learning).",
        specificCompetencies: [
          `Nắm vững từ vựng và mẫu câu giao tiếp đơn giản chủ đề ${uName}.`,
          "Tự tin đối thoại theo cặp và phản xạ với giáo viên."
        ]
      };
    }
    if (grade === 3) {
      return {
        lessonTitle: `Unit ${Math.min(week, 10)}: My School & Friends - Lesson ${((periodInWeek - 1) % 3) + 1} (Vocabulary & Phonics)`,
        curriculumPeriod: curP,
        integrationNotes: "Tích hợp trò chơi tương tác số, rèn luyện 4 kỹ năng Nghe - Nói - Đọc - Viết."
      };
    }
    if (grade === 4) {
      return {
        lessonTitle: `Unit ${Math.min(week, 10)}: My Week & Daily Activities - Lesson ${((periodInWeek - 1) % 3) + 1} (Communication & Grammar)`,
        curriculumPeriod: curP,
        integrationNotes: "Tích hợp NLS: Sử dụng thẻ từ vựng số Flashcard, luyện phát âm chuẩn."
      };
    }
    // Grade 5
    return {
      lessonTitle: `Unit ${Math.min(week, 10)}: All About Us & Life Skills - Lesson ${((periodInWeek - 1) % 3) + 1} (Grammar & Skills)`,
      curriculumPeriod: curP,
      integrationNotes: "Tích hợp AI: Phát âm chuẩn xác qua giọng đọc máy (1.A1.1), NLS 1.1.CB1a."
    };
  }

  // 2. TIN HỌC (Lớp 1-5)
  if (subLower.includes("tin học") || subLower.includes("th")) {
    const curP = (week - 1) * 2 + ((periodInWeek - 1) % 2) + 1;
    if (grade <= 2) {
      return {
        lessonTitle: `Làm quen thế giới số: Trò chơi rèn luyện tư duy logic (Tiết ${((periodInWeek - 1) % 2) + 1})`,
        curriculumPeriod: curP,
        integrationNotes: "Tích hợp phát triển Năng lực số (CV 3456) và an toàn thiết bị điện tử."
      };
    }
    if (grade === 3) {
      return {
        lessonTitle: `Chủ đề ${Math.min(week, 6)}: Máy tính và em - Thao tác chuột và bàn phím (Tiết ${((periodInWeek - 1) % 2) + 1})`,
        curriculumPeriod: curP,
        integrationNotes: "Tích hợp NLS 1.1.CB1a: Khám phá thiết bị số an toàn, bảo vệ mắt."
      };
    }
    if (grade === 4) {
      return {
        lessonTitle: `Chủ đề ${Math.min(week, 6)}: Soạn thảo văn bản và chèn hình ảnh minh họa (Tiết ${((periodInWeek - 1) % 2) + 1})`,
        curriculumPeriod: curP,
        integrationNotes: "Tích hợp NLS: Kỹ năng định dạng tài liệu số chuẩn A4, bảo mật thông tin."
      };
    }
    return {
      lessonTitle: `Chủ đề ${Math.min(week, 6)}: Khám phá thế giới số & Ứng dụng AI trong học tập (Tiết ${((periodInWeek - 1) % 2) + 1})`,
      curriculumPeriod: curP,
      integrationNotes: "Tích hợp NLS (CV 3456): 1.1.CB1a, 5.2.CB1a, An toàn thông tin mạng."
    };
  }

  // 3. ÂM NHẠC
  if (subLower.includes("âm nhạc") || subLower.includes("an")) {
    return {
      lessonTitle: `Chủ đề ${Math.min(week, 8)}: Giai điệu tuổi thơ Lớp ${grade} - Học hát và gõ đệm theo phách`,
      curriculumPeriod: week,
      integrationNotes: "Tích hợp văn hóa truyền thống quê hương, tự tin biểu diễn trước lớp."
    };
  }

  // 4. MĨ THUẬT
  if (subLower.includes("mĩ thuật") || subLower.includes("mỹ thuật") || subLower.includes("mt")) {
    return {
      lessonTitle: `Chủ đề ${Math.min(week, 8)}: Sắc màu quê hương Lớp ${grade} - Sáng tạo sản phẩm từ vật liệu tái chế`,
      curriculumPeriod: week,
      integrationNotes: "Tích hợp STEM: Tái chế rác thải nhựa, bảo vệ môi trường."
    };
  }

  // 5. GIÁO DỤC THỂ CHẤT
  if (subLower.includes("thể chất") || subLower.includes("gdtc")) {
    return {
      lessonTitle: `Bài tập phát triển chung & Đội hình đội ngũ Lớp ${grade} (Tiết ${((periodInWeek - 1) % 2) + 1})`,
      curriculumPeriod: (week - 1) * 2 + ((periodInWeek - 1) % 2) + 1,
      integrationNotes: "Tích hợp GDDD: Lợi ích vận động và chế độ uống nước đầy đủ."
    };
  }

  // 6. HĐTN
  return {
    lessonTitle: `HĐTN Lớp ${grade} - Hoạt động giáo dục theo chủ đề tuần ${week}`,
    curriculumPeriod: week,
    integrationNotes: "Tích hợp rèn nếp sống tự lập và kỹ năng giao tiếp."
  };
}

// -------------------------------------------------------------
// MASTER LOOKUP FUNCTION: GET EXACT LESSON BY GRADE & SUBJECT
// -------------------------------------------------------------
export function getGradeCurriculumLesson(
  grade: Grade,
  subject: string,
  week: number,
  periodInWeek: number = 1
): LessonInfo {
  const normSub = subject.toLowerCase().trim();

  // Pick curriculum dictionary by grade
  let gradeDict = GRADE_5_CURRICULUM;
  if (grade === 1) gradeDict = GRADE_1_CURRICULUM;
  else if (grade === 2) gradeDict = GRADE_2_CURRICULUM;
  else if (grade === 3) gradeDict = GRADE_3_CURRICULUM;
  else if (grade === 4) gradeDict = GRADE_4_CURRICULUM;
  else if (grade === 5) gradeDict = GRADE_5_CURRICULUM;

  // Match subject key
  for (const [key, fn] of Object.entries(gradeDict)) {
    if (normSub.includes(key) || key.includes(normSub)) {
      return fn(week, periodInWeek);
    }
  }

  // Fallback for specialist subjects
  if (normSub.includes("tiếng anh") || normSub.includes("anh văn") || normSub.includes("ta") ||
      normSub.includes("tin học") || normSub.includes("th") ||
      normSub.includes("âm nhạc") || normSub.includes("an") ||
      normSub.includes("mĩ thuật") || normSub.includes("mt") ||
      normSub.includes("thể chất") || normSub.includes("gdtc")) {
    return getSpecialistLessonInfo(subject, grade, week, periodInWeek);
  }

  return {
    lessonTitle: `${subject} Lớp ${grade} - Bài học tuần ${week} (Tiết ${periodInWeek})`,
    curriculumPeriod: (week - 1) * 2 + periodInWeek,
    integrationNotes: `Tích hợp GDPT 2018 môn ${subject} Lớp ${grade}.`
  };
}
