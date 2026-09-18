import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  BorderStyle,
  PageBreak,
  PageOrientation,
} from "docx";
import { SchoolInfo } from "../types";
import { SubjectWorksheet } from "../data/weeklyWorksheetsData";
import { saveDocxFile } from "./docxExporter";

const STANDARD_A4_PAGE_PORTRAIT = {
  size: {
    width: 11906, // A4 width: 210mm
    height: 16838, // A4 height: 297mm
    orientation: PageOrientation.PORTRAIT,
  },
  margin: {
    top: 1134, // 20mm
    bottom: 1134, // 20mm
    left: 1417, // 25mm
    right: 992, // 17.5mm
  },
};

const BORDER_SINGLE = {
  top: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
  bottom: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
  left: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
  right: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
};

const BORDER_NONE = {
  top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
};

/**
 * Build children paragraphs and tables for a single subject worksheet
 */
function buildWorksheetDocumentChildren(
  worksheet: SubjectWorksheet,
  schoolInfo: SchoolInfo,
  includeAnswerKey: boolean = true
): (Paragraph | Table)[] {
  const font = schoolInfo.fontFamily || "Times New Roman";
  const baseSize = (schoolInfo.fontSize || 13) * 2;
  const smallSize = Math.max(20, baseSize - 4);
  const titleSize = baseSize + 4;
  const headingSize = baseSize + 2;

  const children: (Paragraph | Table)[] = [];

  // 1. Administrative Top Header (Trường & Tiêu đề phiếu)
  children.push(
    new Table({
      width: { size: 9800, type: WidthType.DXA },
      borders: BORDER_NONE,
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 5000, type: WidthType.DXA },
              children: [
                new Paragraph({ children: [new TextRun({ text: schoolInfo.schoolName.toUpperCase(), bold: true, font, size: baseSize })] }),
                new Paragraph({ children: [new TextRun({ text: (schoolInfo.branchName || "Phân hiệu Kiến Bình").toUpperCase(), bold: true, font, size: smallSize })] }),
                new Paragraph({ children: [new TextRun({ text: `Lớp: ${schoolInfo.className} (Khối ${worksheet.grade})`, font, size: baseSize })] }),
              ],
            }),
            new TableCell({
              width: { size: 4800, type: WidthType.DXA },
              children: [
                new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: `PHIẾU BÀI TẬP CUỐI TUẦN ${worksheet.week}`, bold: true, font, size: baseSize })] }),
                new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: `Năm học: ${schoolInfo.academicYear}`, font, size: smallSize })] }),
                new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: `Nguồn: loigiaihay.com`, italics: true, font, size: smallSize })] }),
              ],
            }),
          ],
        }),
      ],
    })
  );

  children.push(new Paragraph({ spacing: { before: 100, after: 100 } }));

  // 2. Main Title Banner
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 80, after: 60 },
      children: [
        new TextRun({
          text: `BÀI TẬP CUỐI TUẦN ${worksheet.week} - MÔN ${worksheet.subject.toUpperCase()}`,
          bold: true,
          font,
          size: titleSize,
        }),
      ],
    })
  );

  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 140 },
      children: [
        new TextRun({
          text: `(Bám sát Lịch Báo Giảng KHBD • Tham khảo lời giải chuẩn: https://loigiaihay.com/)`,
          italics: true,
          font,
          size: smallSize,
        }),
      ],
    })
  );

  // 3. Student Info & Score Box Table
  children.push(
    new Table({
      width: { size: 9800, type: WidthType.DXA },
      borders: BORDER_SINGLE,
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 6000, type: WidthType.DXA },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({ text: "Họ và tên học sinh: ", bold: true, font, size: baseSize }),
                    new TextRun({ text: ".......................................................................", font, size: baseSize }),
                  ],
                }),
                new Paragraph({
                  spacing: { before: 40 },
                  children: [
                    new TextRun({ text: `Lớp: ${schoolInfo.className}   -   Thời gian làm bài: 40 phút`, font, size: baseSize }),
                  ],
                }),
              ],
            }),
            new TableCell({
              width: { size: 1800, type: WidthType.DXA },
              children: [
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "ĐIỂM SỐ", bold: true, font, size: smallSize })] }),
                new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 80, after: 80 }, children: [new TextRun({ text: "....... / 10", font, size: baseSize })] }),
              ],
            }),
            new TableCell({
              width: { size: 2000, type: WidthType.DXA },
              children: [
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "LỜI PHÊ CỦA THẦY CÔ", bold: true, font, size: smallSize })] }),
                new Paragraph({ spacing: { before: 80, after: 80 }, children: [new TextRun({ text: "", font, size: baseSize })] }),
              ],
            }),
          ],
        }),
      ],
    })
  );

  // 4. Focus Lessons from Schedule Box
  if (worksheet.focusLessons && worksheet.focusLessons.length > 0) {
    children.push(
      new Paragraph({
        spacing: { before: 140, after: 40 },
        children: [
          new TextRun({ text: "★ KIẾN THỨC TRỌNG TÂM TRONG TUẦN (THEO LỊCH BÁO GIẢNG):", bold: true, font, size: baseSize }),
        ],
      })
    );
    worksheet.focusLessons.forEach((lesson, i) => {
      children.push(
        new Paragraph({
          spacing: { before: 20, after: 20 },
          children: [
            new TextRun({ text: `   • ${lesson}`, font, size: baseSize }),
          ],
        })
      );
    });
  }

  // 5. Section I: Trắc nghiệm khách quan
  children.push(
    new Paragraph({
      spacing: { before: 160, after: 80 },
      children: [
        new TextRun({
          text: "I. PHẦN TRẮC NGHIỆM (Khoanh tròn vào chữ cái A, B, C hoặc D đặt trước câu trả lời đúng)",
          bold: true,
          font,
          size: headingSize,
        }),
      ],
    })
  );

  worksheet.multipleChoiceQuestions.forEach((q, idx) => {
    children.push(
      new Paragraph({
        spacing: { before: 80, after: 40 },
        children: [
          new TextRun({ text: `Câu ${idx + 1}: `, bold: true, font, size: baseSize }),
          new TextRun({ text: q.question, font, size: baseSize }),
        ],
      })
    );

    // Render options 2 columns or stacked
    const optRows: Paragraph[] = [];
    q.options.forEach((opt) => {
      optRows.push(
        new Paragraph({
          spacing: { before: 20, after: 20 },
          children: [
            new TextRun({ text: `   ${opt.key}. `, bold: true, font, size: baseSize }),
            new TextRun({ text: opt.text, font, size: baseSize }),
          ],
        })
      );
    });
    children.push(...optRows);
  });

  // 6. Section II: Tự luận / Thực hành
  if (worksheet.essayQuestions && worksheet.essayQuestions.length > 0) {
    children.push(
      new Paragraph({
        spacing: { before: 180, after: 80 },
        children: [
          new TextRun({
            text: "II. PHẦN TỰ LUẬN / VẬN DỤNG THỰC HÀNH",
            bold: true,
            font,
            size: headingSize,
          }),
        ],
      })
    );

    worksheet.essayQuestions.forEach((eq, idx) => {
      children.push(
        new Paragraph({
          spacing: { before: 80, after: 40 },
          children: [
            new TextRun({ text: `Bài ${idx + 1}: `, bold: true, font, size: baseSize }),
            new TextRun({ text: eq.question, font, size: baseSize }),
          ],
        })
      );

      children.push(
        new Paragraph({
          spacing: { before: 20, after: 20 },
          children: [new TextRun({ text: "Bài làm:", italics: true, font, size: smallSize })],
        })
      );
      children.push(
        new Paragraph({
          spacing: { before: 40, after: 40 },
          children: [new TextRun({ text: "................................................................................................................................................................", font, size: baseSize })],
        })
      );
      children.push(
        new Paragraph({
          spacing: { before: 40, after: 40 },
          children: [new TextRun({ text: "................................................................................................................................................................", font, size: baseSize })],
        })
      );
      children.push(
        new Paragraph({
          spacing: { before: 40, after: 40 },
          children: [new TextRun({ text: "................................................................................................................................................................", font, size: baseSize })],
        })
      );
    });
  }

  // 7. Section III: Đáp án và hướng dẫn giải (Nguồn: Loigiaihay.com)
  if (includeAnswerKey) {
    children.push(new Paragraph({ children: [new PageBreak()] }));

    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 80, after: 60 },
        children: [
          new TextRun({
            text: `ĐÁP ÁN & HƯỚNG DẪN GIẢI CHI TIẾT - TUẦN ${worksheet.week} (${worksheet.subject.toUpperCase()})`,
            bold: true,
            font,
            size: headingSize,
          }),
        ],
      })
    );

    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 120 },
        children: [
          new TextRun({
            text: `(Biên soạn theo tài liệu bài tập cuối tuần tại: https://loigiaihay.com/)`,
            italics: true,
            font,
            size: smallSize,
          }),
        ],
      })
    );

    // Quick Answer Table
    const headerCells = [
      new TableCell({
        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Câu", bold: true, font, size: baseSize })] })],
      }),
    ];
    const ansCells = [
      new TableCell({
        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Đáp án", bold: true, font, size: baseSize })] })],
      }),
    ];

    worksheet.multipleChoiceQuestions.forEach((q, idx) => {
      headerCells.push(
        new TableCell({
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${idx + 1}`, bold: true, font, size: baseSize })] })],
        })
      );
      ansCells.push(
        new TableCell({
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: q.correctAnswer, bold: true, color: "1E40AF", font, size: baseSize })] })],
        })
      );
    });

    children.push(
      new Table({
        width: { size: 9800, type: WidthType.DXA },
        borders: BORDER_SINGLE,
        rows: [
          new TableRow({ children: headerCells }),
          new TableRow({ children: ansCells }),
        ],
      })
    );

    children.push(
      new Paragraph({
        spacing: { before: 140, after: 40 },
        children: [new TextRun({ text: "Hướng dẫn giải chi tiết từng câu:", bold: true, font, size: baseSize })],
      })
    );

    worksheet.multipleChoiceQuestions.forEach((q, idx) => {
      children.push(
        new Paragraph({
          spacing: { before: 40, after: 20 },
          children: [
            new TextRun({ text: `• Câu ${idx + 1} (Chọn ${q.correctAnswer}): `, bold: true, font, size: baseSize }),
            new TextRun({ text: q.explanation, font, size: baseSize }),
          ],
        })
      );
    });

    if (worksheet.essayQuestions && worksheet.essayQuestions.length > 0) {
      children.push(
        new Paragraph({
          spacing: { before: 120, after: 40 },
          children: [new TextRun({ text: "Gợi ý đáp án phần Tự luận:", bold: true, font, size: baseSize })],
        })
      );

      worksheet.essayQuestions.forEach((eq, idx) => {
        children.push(
          new Paragraph({
            spacing: { before: 40, after: 20 },
            children: [
              new TextRun({ text: `• Bài ${idx + 1}: `, bold: true, font, size: baseSize }),
              new TextRun({ text: eq.sampleAnswer, font, size: baseSize }),
            ],
          })
        );
      });
    }
  }

  return children;
}

/**
 * Export single subject worksheet to A4 Word docx
 */
export async function exportSubjectWorksheetDocx(
  worksheet: SubjectWorksheet,
  schoolInfo: SchoolInfo,
  includeAnswerKey: boolean = true
) {
  const children = buildWorksheetDocumentChildren(worksheet, schoolInfo, includeAnswerKey);

  const doc = new Document({
    sections: [
      {
        properties: {
          page: STANDARD_A4_PAGE_PORTRAIT,
        },
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const safeSubj = worksheet.subject.replace(/[^a-zA-Z0-9_\u00C0-\u024F\u1EA0-\u1EF9]/g, "_");
  const filename = `Phieu_Bai_Tap_Cuoi_Tuan_${worksheet.week}_${safeSubj}_Lop_${schoolInfo.className}_Loigiaihay.docx`;
  return saveDocxFile(blob, filename);
}

/**
 * Export all weekly worksheets of all required subjects for that grade to a consolidated A4 Word docx
 */
export async function exportAllSubjectsWeeklyWorksheetDocx(
  worksheets: SubjectWorksheet[],
  schoolInfo: SchoolInfo
) {
  const font = schoolInfo.fontFamily || "Times New Roman";
  const baseSize = (schoolInfo.fontSize || 13) * 2;
  const bigTitleSize = baseSize + 8;

  const allChildren: (Paragraph | Table)[] = [];

  // Cover / Header banner for the bundle
  allChildren.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 180, after: 60 },
      children: [
        new TextRun({
          text: `BỘ PHIẾU BÀI TẬP CUỐI TUẦN ${schoolInfo.week} TOÀN DIỆN`,
          bold: true,
          font,
          size: bigTitleSize,
        }),
      ],
    })
  );

  allChildren.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 60 },
      children: [
        new TextRun({
          text: `DÀNH CHO HỌC SINH KHỐI ${schoolInfo.grade} (LỚP ${schoolInfo.className})`,
          bold: true,
          font,
          size: baseSize + 2,
        }),
      ],
    })
  );

  allChildren.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 120 },
      children: [
        new TextRun({
          text: `Trường Tiểu học Tân Thạnh - Phân hiệu Kiến Bình • Năm học ${schoolInfo.academicYear}`,
          font,
          size: baseSize,
        }),
      ],
    })
  );

  allChildren.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 180 },
      children: [
        new TextRun({
          text: `(Nguồn tham khảo bài tập & lời giải: https://loigiaihay.com/ - GDPT 2018)`,
          italics: true,
          font,
          size: baseSize - 2,
        }),
      ],
    })
  );

  // Table of Contents of included subjects
  allChildren.push(
    new Paragraph({
      spacing: { before: 80, after: 40 },
      children: [new TextRun({ text: "DANH MỤC CÁC MÔN HỌC TRONG BỘ PHIẾU BÀI TẬP TUẦN NÀY:", bold: true, font, size: baseSize })],
    })
  );

  worksheets.forEach((ws, i) => {
    allChildren.push(
      new Paragraph({
        spacing: { before: 20, after: 20 },
        children: [
          new TextRun({ text: `  ${i + 1}. Môn: `, bold: true, font, size: baseSize }),
          new TextRun({ text: ws.subject, font, size: baseSize }),
          new TextRun({ text: ` - ${ws.multipleChoiceQuestions.length} câu trắc nghiệm + ${ws.essayQuestions.length} bài tự luận (Kèm đáp án Loigiaihay.com)`, italics: true, font, size: baseSize - 2 }),
        ],
      })
    );
  });

  allChildren.push(new Paragraph({ spacing: { before: 100, after: 100 } }));

  // Append each worksheet sequentially
  worksheets.forEach((ws, idx) => {
    allChildren.push(new Paragraph({ children: [new PageBreak()] }));
    const wsChildren = buildWorksheetDocumentChildren(ws, schoolInfo, true);
    allChildren.push(...wsChildren);
  });

  const doc = new Document({
    sections: [
      {
        properties: {
          page: STANDARD_A4_PAGE_PORTRAIT,
        },
        children: allChildren,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const filename = `Tron_Bo_Phieu_Bai_Tap_Cuoi_Tuan_${schoolInfo.week}_Khoi_${schoolInfo.grade}_Lop_${schoolInfo.className}_Loigiaihay.docx`;
  return saveDocxFile(blob, filename);
}
