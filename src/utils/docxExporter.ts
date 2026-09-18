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
  convertInchesToTwip,
  PageOrientation,
} from "docx";
import { saveAs } from "file-saver";
import { LessonPlan, ScheduleItem, SchoolInfo, MasterTimetable } from "../types";
import { DAYS_OF_WEEK, DEFAULT_TEACHERS, isSlotMatchingTeacherOrSubject } from "../data/defaultTimetables";
import { getDetailedActivitiesForLesson } from "./detailedActivitiesHelper";
import { getDayDatesForWeek } from "./dateHelper";

/**
 * Universal robust file download helper for Web & sandboxed iFrame environments
 */
export function saveDocxFile(blob: Blob, filename: string): { blob: Blob; filename: string; url: string } {
  const url = URL.createObjectURL(blob);
  try {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.setAttribute("download", filename);
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();

    setTimeout(() => {
      try {
        if (document.body.contains(link)) {
          document.body.removeChild(link);
        }
      } catch {
        // Ignore
      }
    }, 1500);
  } catch (err) {
    console.warn("DOM click download encountered error, trying file-saver saveAs:", err);
    try {
      saveAs(blob, filename);
    } catch (saveAsErr) {
      console.error("file-saver saveAs error:", saveAsErr);
    }
  }

  return { blob, filename, url };
}

// Helper to convert pt to half-points for docx library (e.g. 12pt -> 24 half-points, 13pt -> 26, 14pt -> 28)
function getFontSizeHalfPoints(pt: number): number {
  return pt * 2;
}

// Vietnam Administrative Document Margins (Standard Nghị định 30/2020/NĐ-CP)
// Top: 20mm (~1134 dxa), Bottom: 20mm (~1134 dxa), Left: 25-30mm (~1417 dxa), Right: 15-20mm (~850 dxa)
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

const STANDARD_A4_PAGE_LANDSCAPE = {
  size: {
    width: 16838, // A4 width: 297mm
    height: 11906, // A4 height: 210mm
    orientation: PageOrientation.LANDSCAPE,
  },
  margin: {
    top: 1134,
    bottom: 1134,
    left: 1134,
    right: 1134,
  },
};

/**
 * 1. Generate Word (.docx) A4 for Thời Khóa Biểu (TKB) - Lớp hoặc Toàn trường
 */
export async function exportTimetableDocx(
  schoolInfo: SchoolInfo,
  masterTimetable: MasterTimetable,
  targetClass?: string,
  orientation: "portrait" | "landscape" = "portrait"
) {
  const font = schoolInfo.fontFamily || "Times New Roman";
  const baseSize = getFontSizeHalfPoints(schoolInfo.fontSize || 13);
  const smallSize = getFontSizeHalfPoints((schoolInfo.fontSize || 13) - 1);
  const subTitleSize = getFontSizeHalfPoints((schoolInfo.fontSize || 13) + 1);
  const titleSize = getFontSizeHalfPoints((schoolInfo.fontSize || 13) + 3);

  const cls = targetClass || schoolInfo.className;
  const isLandscape = orientation === "landscape";
  const tableWidth = isLandscape ? 14500 : 9400;

  // Header rows
  const tableRows: TableRow[] = [];

  // Table Column Headers
  const colWidths = isLandscape
    ? [1600, 1000, 2380, 2380, 2380, 2380, 2380]
    : [1300, 900, 1440, 1440, 1440, 1440, 1440];

  const dayDates = getDayDatesForWeek(schoolInfo.week || 1);

  tableRows.push(
    new TableRow({
      tableHeader: true,
      children: [
        new TableCell({
          width: { size: colWidths[0], type: WidthType.DXA },
          shading: { fill: "E2E8F0" },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun({ text: "Buổi", bold: true, font, size: baseSize })],
            }),
          ],
        }),
        new TableCell({
          width: { size: colWidths[1], type: WidthType.DXA },
          shading: { fill: "E2E8F0" },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun({ text: "Tiết", bold: true, font, size: baseSize })],
            }),
          ],
        }),
        ...DAYS_OF_WEEK.map(
          (day, dIdx) =>
            new TableCell({
              width: { size: colWidths[2 + dIdx], type: WidthType.DXA },
              shading: { fill: "E2E8F0" },
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({ text: day, bold: true, font, size: baseSize }),
                    ...(dayDates[dIdx]
                      ? [new TextRun({ text: `\n(${dayDates[dIdx].shortDate})`, italics: true, font, size: smallSize })]
                      : []),
                  ],
                }),
              ],
            })
        ),
      ],
    })
  );

  // Sáng: 5 Tiết
  for (let p = 1; p <= 5; p++) {
    const cells: TableCell[] = [];

    if (p === 1) {
      cells.push(
        new TableCell({
          rowSpan: 5,
          width: { size: colWidths[0], type: WidthType.DXA },
          shading: { fill: "F8FAFC" },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({ text: "SÁNG", bold: true, font, size: baseSize }),
                new TextRun({ text: "\n(7h15 - 11h15)", italics: true, font, size: smallSize }),
              ],
            }),
          ],
        })
      );
    }

    cells.push(
      new TableCell({
        width: { size: colWidths[1], type: WidthType.DXA },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: String(p), bold: true, font, size: baseSize })],
          }),
        ],
      })
    );

    DAYS_OF_WEEK.forEach((day, dIdx) => {
      const slotKey = `${day}_Sáng_${p}`;
      const subject = masterTimetable.slots[slotKey]?.[cls] || "—";
      const isBold = subject !== "—" && !subject.includes("(");

      cells.push(
        new TableCell({
          width: { size: colWidths[2 + dIdx], type: WidthType.DXA },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: subject,
                  bold: isBold,
                  font,
                  size: baseSize,
                }),
              ],
            }),
          ],
        })
      );
    });

    tableRows.push(new TableRow({ children: cells }));
  }

  // Chiều: 3 Tiết
  for (let p = 1; p <= 3; p++) {
    const cells: TableCell[] = [];

    if (p === 1) {
      cells.push(
        new TableCell({
          rowSpan: 3,
          width: { size: colWidths[0], type: WidthType.DXA },
          shading: { fill: "F8FAFC" },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({ text: "CHIỀU", bold: true, font, size: baseSize }),
                new TextRun({ text: "\n(13h30 - 16h00)", italics: true, font, size: smallSize }),
              ],
            }),
          ],
        })
      );
    }

    cells.push(
      new TableCell({
        width: { size: colWidths[1], type: WidthType.DXA },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: String(p), bold: true, font, size: baseSize })],
          }),
        ],
      })
    );

    DAYS_OF_WEEK.forEach((day, dIdx) => {
      const slotKey = `${day}_Chiều_${p}`;
      const subject = masterTimetable.slots[slotKey]?.[cls] || "—";
      const isBold = subject !== "—" && !subject.includes("(");

      cells.push(
        new TableCell({
          width: { size: colWidths[2 + dIdx], type: WidthType.DXA },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: subject,
                  bold: isBold,
                  font,
                  size: baseSize,
                }),
              ],
            }),
          ],
        })
      );
    });

    tableRows.push(new TableRow({ children: cells }));
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: isLandscape ? STANDARD_A4_PAGE_LANDSCAPE : STANDARD_A4_PAGE_PORTRAIT,
        },
        children: [
          // Official Header
          new Table({
            width: { size: tableWidth, type: WidthType.DXA },
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
              insideHorizontal: { style: BorderStyle.NONE },
              insideVertical: { style: BorderStyle.NONE },
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: isLandscape ? 7000 : 4500, type: WidthType.DXA },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: (schoolInfo.departmentName || "PHÒNG GIÁO DỤC VÀ ĐÀO TẠO").toUpperCase(),
                            font,
                            size: smallSize,
                          }),
                        ],
                      }),
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: (schoolInfo.schoolName || "TRƯỜNG TIỂU HỌC").toUpperCase(),
                            bold: true,
                            font,
                            size: baseSize,
                          }),
                        ],
                      }),
                      ...(schoolInfo.branchName
                        ? [
                            new Paragraph({
                              alignment: AlignmentType.CENTER,
                              children: [
                                new TextRun({
                                  text: `Phân hiệu: ${schoolInfo.branchName}`,
                                  font,
                                  size: smallSize,
                                }),
                              ],
                            }),
                          ]
                        : []),
                    ],
                  }),
                  new TableCell({
                    width: { size: isLandscape ? 7500 : 4900, type: WidthType.DXA },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: "CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM",
                            bold: true,
                            font,
                            size: baseSize,
                          }),
                        ],
                      }),
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: "Độc lập - Tự do - Hạnh phúc",
                            bold: true,
                            font,
                            size: baseSize,
                          }),
                        ],
                      }),
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: "---------------------------",
                            font,
                            size: smallSize,
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),

          new Paragraph({ text: "", spacing: { before: 150 } }),

          // Title
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: `THỜI KHÓA BIỂU CHI TIẾT - LỚP ${cls}`,
                bold: true,
                font,
                size: titleSize,
                color: "0F172A",
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: `Năm học: ${schoolInfo.academicYear} | Áp dụng từ tuần ${schoolInfo.week} (${schoolInfo.startDate} - ${schoolInfo.endDate})`,
                italics: true,
                font,
                size: baseSize,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: `Giáo viên chủ nhiệm: ${schoolInfo.teacherName} | Lớp: ${cls} (Khối ${cls.charAt(0)})`,
                bold: true,
                font,
                size: baseSize,
              }),
            ],
          }),

          // Main Timetable Table
          new Table({
            width: { size: tableWidth, type: WidthType.DXA },
            rows: tableRows,
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const fileName = `TKB_A4_Lop_${cls}_GV_${schoolInfo.teacherName}_NMH${schoolInfo.academicYear.replace(/\s+/g, "")}.docx`;
  return saveDocxFile(blob, fileName);
}

/**
 * 1.1 Generate Word (.docx) A4 for Teacher's Personal Timetable (TKB Giáo Viên Riêng Biệt)
 */
export async function exportTeacherTimetableDocx(
  schoolInfo: SchoolInfo,
  masterTimetable: MasterTimetable,
  teacherName: string,
  orientation: "portrait" | "landscape" = "portrait"
) {
  const font = schoolInfo.fontFamily || "Times New Roman";
  const baseSize = getFontSizeHalfPoints(schoolInfo.fontSize || 13);
  const smallSize = getFontSizeHalfPoints((schoolInfo.fontSize || 13) - 1);
  const subTitleSize = getFontSizeHalfPoints((schoolInfo.fontSize || 13) + 1);
  const titleSize = getFontSizeHalfPoints((schoolInfo.fontSize || 13) + 3);

  const isLandscape = orientation === "landscape";
  const tableWidth = isLandscape ? 14500 : 9400;

  // Find teacher info
  const matchedTeacher = DEFAULT_TEACHERS.find((t) => t.name === teacherName);
  const teacherRole = matchedTeacher?.role || (schoolInfo.teacherType === "specialist" ? `GV Chuyên ${schoolInfo.specialistSubject}` : `GVCN Lớp ${schoolInfo.className}`);
  const specialistSubject = matchedTeacher?.specialistSubject || schoolInfo.specialistSubject;

  const colWidths = isLandscape
    ? [1600, 1000, 2380, 2380, 2380, 2380, 2380]
    : [1300, 900, 1440, 1440, 1440, 1440, 1440];

  const dayDates = getDayDatesForWeek(schoolInfo.week || 1);

  const tableRows: TableRow[] = [
    new TableRow({
      tableHeader: true,
      children: [
        new TableCell({
          width: { size: colWidths[0], type: WidthType.DXA },
          shading: { fill: "E2E8F0" },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun({ text: "Buổi", bold: true, font, size: baseSize })],
            }),
          ],
        }),
        new TableCell({
          width: { size: colWidths[1], type: WidthType.DXA },
          shading: { fill: "E2E8F0" },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun({ text: "Tiết", bold: true, font, size: baseSize })],
            }),
          ],
        }),
        ...DAYS_OF_WEEK.map(
          (day, dIdx) =>
            new TableCell({
              width: { size: colWidths[2 + dIdx], type: WidthType.DXA },
              shading: { fill: "E2E8F0" },
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({ text: day, bold: true, font, size: baseSize }),
                    ...(dayDates[dIdx]
                      ? [new TextRun({ text: `\n(${dayDates[dIdx].shortDate})`, italics: true, font, size: smallSize })]
                      : []),
                  ],
                }),
              ],
            })
        ),
      ],
    }),
  ];

  // Helper to find taught classes & subjects for this teacher at a slot
  const getTeacherClassesForSlot = (slotKey: string, day: string, session: string, period: number) => {
    const taught: { cls: string; sub: string }[] = [];
    masterTimetable.classes.forEach((cls) => {
      const val = (masterTimetable.slots[slotKey]?.[cls] || "").trim();
      if (!val) return;
      if (
        isSlotMatchingTeacherOrSubject(val, teacherName, specialistSubject) ||
        (matchedTeacher?.assignedClasses?.includes(cls) && matchedTeacher?.type === "homeroom" && !val.includes("(")) ||
        (teacherName.includes("Tuấn") && cls === "5A" && !val.includes("(")) ||
        (teacherName.includes("Huế") && cls === "5B" && !val.includes("(")) ||
        (teacherName.includes("Hằng") && cls === "4A" && !val.includes("(")) ||
        (teacherName.includes("Yến") && cls === "4B" && !val.includes("(")) ||
        (teacherName.includes("Dương") && cls === "3A" && !val.includes("(")) ||
        (teacherName.includes("Đạt") && cls === "3B" && !val.includes("(")) ||
        (teacherName.includes("Chinh") && cls === "2A" && !val.includes("(")) ||
        (teacherName.includes("Phước") && cls === "2B" && !val.includes("(")) ||
        (teacherName.includes("Chi") && cls === "1A" && !val.includes("(")) ||
        (teacherName.includes("Năm") && cls === "1B" && !val.includes("("))
      ) {
        taught.push({ cls, sub: val });
      }
    });
    return taught;
  };

  // Morning 1 -> 5
  for (let p = 1; p <= 5; p++) {
    const cells: TableCell[] = [];
    if (p === 1) {
      cells.push(
        new TableCell({
          rowSpan: 5,
          width: { size: colWidths[0], type: WidthType.DXA },
          shading: { fill: "F8FAFC" },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({ text: "SÁNG", bold: true, font, size: baseSize }),
                new TextRun({ text: "\n(7h15 - 11h15)", italics: true, font, size: smallSize }),
              ],
            }),
          ],
        })
      );
    }

    cells.push(
      new TableCell({
        width: { size: colWidths[1], type: WidthType.DXA },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: String(p), bold: true, font, size: baseSize })],
          }),
        ],
      })
    );

    DAYS_OF_WEEK.forEach((day, dIdx) => {
      const slotKey = `${day}_Sáng_${p}`;
      const taught = getTeacherClassesForSlot(slotKey, day, "Sáng", p);

      const paragraphs: Paragraph[] = [];
      if (taught.length > 0) {
        taught.forEach((t) => {
          paragraphs.push(
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({ text: `Lớp ${t.cls}: `, bold: true, font, size: baseSize }),
                new TextRun({ text: t.sub, font, size: baseSize }),
              ],
            })
          );
        });
      } else {
        paragraphs.push(
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: "—", italics: true, font, size: baseSize })],
          })
        );
      }

      cells.push(
        new TableCell({
          width: { size: colWidths[2 + dIdx], type: WidthType.DXA },
          children: paragraphs,
        })
      );
    });

    tableRows.push(new TableRow({ children: cells }));
  }

  // Afternoon 1 -> 3
  for (let p = 1; p <= 3; p++) {
    const cells: TableCell[] = [];
    if (p === 1) {
      cells.push(
        new TableCell({
          rowSpan: 3,
          width: { size: colWidths[0], type: WidthType.DXA },
          shading: { fill: "F8FAFC" },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({ text: "CHIỀU", bold: true, font, size: baseSize }),
                new TextRun({ text: "\n(13h30 - 16h00)", italics: true, font, size: smallSize }),
              ],
            }),
          ],
        })
      );
    }

    cells.push(
      new TableCell({
        width: { size: colWidths[1], type: WidthType.DXA },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: String(p), bold: true, font, size: baseSize })],
          }),
        ],
      })
    );

    DAYS_OF_WEEK.forEach((day, dIdx) => {
      const slotKey = `${day}_Chiều_${p}`;
      const taught = getTeacherClassesForSlot(slotKey, day, "Chiều", p);

      const paragraphs: Paragraph[] = [];
      if (day === "Thứ Năm") {
        paragraphs.push(
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: "SHCM", bold: true, font, size: baseSize })],
          })
        );
      } else if (taught.length > 0) {
        taught.forEach((t) => {
          paragraphs.push(
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({ text: `Lớp ${t.cls}: `, bold: true, font, size: baseSize }),
                new TextRun({ text: t.sub, font, size: baseSize }),
              ],
            })
          );
        });
      } else {
        paragraphs.push(
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: "—", italics: true, font, size: baseSize })],
          })
        );
      }

      cells.push(
        new TableCell({
          width: { size: colWidths[2 + dIdx], type: WidthType.DXA },
          children: paragraphs,
        })
      );
    });

    tableRows.push(new TableRow({ children: cells }));
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: isLandscape ? STANDARD_A4_PAGE_LANDSCAPE : STANDARD_A4_PAGE_PORTRAIT,
        },
        children: [
          // Official Header
          new Table({
            width: { size: tableWidth, type: WidthType.DXA },
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
              insideHorizontal: { style: BorderStyle.NONE },
              insideVertical: { style: BorderStyle.NONE },
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: isLandscape ? 7000 : 4500, type: WidthType.DXA },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: (schoolInfo.departmentName || "PHÒNG GIÁO DỤC VÀ ĐÀO TẠO").toUpperCase(),
                            font,
                            size: smallSize,
                          }),
                        ],
                      }),
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: (schoolInfo.schoolName || "TRƯỜNG TIỂU HỌC").toUpperCase(),
                            bold: true,
                            font,
                            size: baseSize,
                          }),
                        ],
                      }),
                      ...(schoolInfo.branchName
                        ? [
                            new Paragraph({
                              alignment: AlignmentType.CENTER,
                              children: [
                                new TextRun({
                                  text: `Phân hiệu: ${schoolInfo.branchName}`,
                                  font,
                                  size: smallSize,
                                }),
                              ],
                            }),
                          ]
                        : []),
                    ],
                  }),
                  new TableCell({
                    width: { size: isLandscape ? 7500 : 4900, type: WidthType.DXA },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: "CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM",
                            bold: true,
                            font,
                            size: baseSize,
                          }),
                        ],
                      }),
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: "Độc lập - Tự do - Hạnh phúc",
                            bold: true,
                            font,
                            size: baseSize,
                          }),
                        ],
                      }),
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: "---------------------------",
                            font,
                            size: smallSize,
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),

          new Paragraph({ text: "", spacing: { before: 150 } }),

          // Title
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: `THỜI KHÓA BIỂU CÁ NHÂN GIÁO VIÊN`,
                bold: true,
                font,
                size: titleSize,
                color: "0F172A",
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: `Năm học: ${schoolInfo.academicYear} | Áp dụng từ tuần ${schoolInfo.week} (${schoolInfo.startDate} - ${schoolInfo.endDate})`,
                italics: true,
                font,
                size: baseSize,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: `Giáo viên: ${teacherName}  |  Nhiệm vụ: ${teacherRole}`,
                bold: true,
                font,
                size: baseSize,
              }),
            ],
          }),

          // Main Timetable Table
          new Table({
            width: { size: tableWidth, type: WidthType.DXA },
            rows: tableRows,
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const cleanTeacherName = teacherName.replace(/\s+/g, "_");
  const fileName = `TKB_A4_GiaoVien_${cleanTeacherName}_NMH${schoolInfo.academicYear.replace(/\s+/g, "")}.docx`;
  return saveDocxFile(blob, fileName);
}

/**
 * Helper to build the Official 7-column LBG Table (1 Thứ, 1 Ngày cho tất cả các tiết trong ngày, Tên bài dạy tinh gọn, Ghi chú để trống)
 */
export function buildOfficialLBGTable(
  schoolInfo: SchoolInfo,
  scheduleItems: ScheduleItem[],
  font: string,
  baseSize: number,
  smallSize: number,
  tableWidth: number = 9400
): Table {
  const dayOrder = ["Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy", "Chủ Nhật"];
  const groupedDays: { day: string; dateStr?: string; items: ScheduleItem[] }[] = [];

  dayOrder.forEach((d) => {
    const items = scheduleItems.filter((it) => it.day === d);
    if (items.length > 0) {
      groupedDays.push({
        day: d,
        dateStr: items[0]?.dateStr || "",
        items,
      });
    }
  });

  scheduleItems.forEach((it) => {
    if (!dayOrder.includes(it.day) && !groupedDays.some((g) => g.day === it.day)) {
      const items = scheduleItems.filter((x) => x.day === it.day);
      groupedDays.push({
        day: it.day,
        dateStr: items[0]?.dateStr || "",
        items,
      });
    }
  });

  const rows: TableRow[] = [
    new TableRow({
      tableHeader: true,
      children: [
        new TableCell({
          width: { size: 1400, type: WidthType.DXA },
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Thứ / Ngày", bold: true, font, size: baseSize })] })],
          shading: { fill: "E2E8F0" },
        }),
        new TableCell({
          width: { size: 800, type: WidthType.DXA },
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Buổi", bold: true, font, size: baseSize })] })],
          shading: { fill: "E2E8F0" },
        }),
        new TableCell({
          width: { size: 600, type: WidthType.DXA },
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Tiết", bold: true, font, size: baseSize })] })],
          shading: { fill: "E2E8F0" },
        }),
        new TableCell({
          width: { size: 1800, type: WidthType.DXA },
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Môn / Phân môn", bold: true, font, size: baseSize })] })],
          shading: { fill: "E2E8F0" },
        }),
        new TableCell({
          width: { size: 800, type: WidthType.DXA },
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Tiết PPCT", bold: true, font, size: baseSize })] })],
          shading: { fill: "E2E8F0" },
        }),
        new TableCell({
          width: { size: 3200, type: WidthType.DXA },
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Tên bài dạy", bold: true, font, size: baseSize })] })],
          shading: { fill: "E2E8F0" },
        }),
        new TableCell({
          width: { size: 800, type: WidthType.DXA },
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Ghi chú", bold: true, font, size: baseSize })] })],
          shading: { fill: "E2E8F0" },
        }),
      ],
    }),
  ];

  groupedDays.forEach((group) => {
    // Precompute session spans for Word table
    const sessionSpans: number[] = [];
    let i = 0;
    while (i < group.items.length) {
      let count = 1;
      while (i + count < group.items.length && group.items[i + count].session === group.items[i].session) {
        count++;
      }
      for (let c = 0; c < count; c++) {
        sessionSpans.push(c === 0 ? count : 0);
      }
      i += count;
    }

    group.items.forEach((item, itemIdx) => {
      const cells: TableCell[] = [];

      // Row 0 of this day: Spans all periods of the day
      if (itemIdx === 0) {
        cells.push(
          new TableCell({
            rowSpan: group.items.length,
            width: { size: 1400, type: WidthType.DXA },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ text: group.day, bold: true, font, size: baseSize }),
                  ...(group.dateStr
                    ? [new TextRun({ text: `\n(${group.dateStr})`, font, size: smallSize })]
                    : []),
                ],
              }),
            ],
          })
        );
      }

      // Buổi: Gộp hiển thị 1 lần cho Sáng / Chiều trong ngày
      const sessionSpan = sessionSpans[itemIdx];
      if (sessionSpan > 0) {
        cells.push(
          new TableCell({
            rowSpan: sessionSpan,
            width: { size: 800, type: WidthType.DXA },
            shading: item.session === "Sáng" ? { fill: "F8FAFC" } : { fill: "F1F5F9" },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: item.session, bold: true, font, size: baseSize })],
              }),
            ],
          })
        );
      }

      // Tiết
      cells.push(
        new TableCell({
          width: { size: 600, type: WidthType.DXA },
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: String(item.period), font, size: baseSize })] })],
        })
      );

      // Môn / Phân môn
      cells.push(
        new TableCell({
          width: { size: 1800, type: WidthType.DXA },
          children: [
            new Paragraph({
              children: [
                new TextRun({ text: item.subject, bold: true, font, size: baseSize }),
                ...(item.className && item.className !== schoolInfo.className
                  ? [new TextRun({ text: ` [Lớp ${item.className}]`, bold: true, color: "1E40AF", font, size: smallSize })]
                  : []),
              ],
            }),
          ],
        })
      );

      // Tiết PPCT
      cells.push(
        new TableCell({
          width: { size: 800, type: WidthType.DXA },
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: String(item.curriculumPeriod || "-"), font, size: baseSize })] })],
        })
      );

      // Tên bài dạy (Chỉ tên bài dạy, KHÔNG nêu nội dung tích hợp theo yêu cầu)
      cells.push(
        new TableCell({
          width: { size: 3200, type: WidthType.DXA },
          children: [
            new Paragraph({
              children: [
                new TextRun({ text: item.lessonTitle || "Bài học", bold: true, font, size: baseSize }),
              ],
            }),
          ],
        })
      );

      // Ghi chú (Bỏ trống theo yêu cầu người dùng)
      cells.push(
        new TableCell({
          width: { size: 800, type: WidthType.DXA },
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "", font, size: smallSize })] })],
        })
      );

      rows.push(new TableRow({ children: cells }));
    });
  });

  return new Table({
    width: { size: tableWidth, type: WidthType.DXA },
    rows,
  });
}

/**
 * 2. Generate Word (.docx) A4 for Weekly Teaching Schedule (Lịch Báo Giảng - LBG)
 */
export async function exportScheduleDocx(
  schoolInfo: SchoolInfo,
  scheduleItems: ScheduleItem[]
) {
  const font = schoolInfo.fontFamily || "Times New Roman";
  const baseSize = getFontSizeHalfPoints(schoolInfo.fontSize || 13);
  const smallSize = getFontSizeHalfPoints((schoolInfo.fontSize || 13) - 1);
  const titleSize = getFontSizeHalfPoints((schoolInfo.fontSize || 13) + 2);

  const tableWidth = 9400;

  const doc = new Document({
    sections: [
      {
        properties: {
          page: STANDARD_A4_PAGE_PORTRAIT,
        },
        children: [
          // Official Header
          new Table({
            width: { size: tableWidth, type: WidthType.DXA },
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
              insideHorizontal: { style: BorderStyle.NONE },
              insideVertical: { style: BorderStyle.NONE },
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 4500, type: WidthType.DXA },
                    children: [
                      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: (schoolInfo.departmentName || "PHÒNG GIÁO DỤC VÀ ĐÀO TẠO").toUpperCase(), font, size: smallSize })] }),
                      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: (schoolInfo.schoolName || "TRƯỜNG TIỂU HỌC").toUpperCase(), bold: true, font, size: baseSize })] }),
                      ...(schoolInfo.branchName
                        ? [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `Phân hiệu: ${schoolInfo.branchName}`, font, size: smallSize })] })]
                        : []),
                      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `Lớp: ${schoolInfo.className} - GV: ${schoolInfo.teacherName}`, bold: true, font, size: baseSize })] }),
                    ],
                  }),
                  new TableCell({
                    width: { size: 4900, type: WidthType.DXA },
                    children: [
                      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM", bold: true, font, size: baseSize })] }),
                      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Độc lập - Tự do - Hạnh phúc", bold: true, font, size: baseSize })] }),
                      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "---------------------------", font, size: smallSize })] }),
                    ],
                  }),
                ],
              }),
            ],
          }),
          new Paragraph({ text: "", spacing: { before: 180 } }),
          // Title
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ 
                text: schoolInfo.teacherType === "specialist" 
                  ? `LỊCH BÁO GIẢNG DẠY CHUYÊN MÔN: ${schoolInfo.specialistSubject?.toUpperCase()} - TUẦN ${schoolInfo.week}`
                  : `LỊCH BÁO GIẢNG TUẦN ${schoolInfo.week}`, 
                bold: true, 
                font, 
                size: titleSize, 
                color: "0F172A" 
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: `Từ ngày ${schoolInfo.startDate} đến ngày ${schoolInfo.endDate} --- Năm học: ${schoolInfo.academicYear}`, italics: true, font, size: baseSize }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 180 },
            children: [
              new TextRun({ 
                text: schoolInfo.teacherType === "specialist"
                  ? `TUẦN HỌC THỨ : ${schoolInfo.week}  |  MÔN CHUYÊN : ${schoolInfo.specialistSubject?.toUpperCase()}  |  GV : ${schoolInfo.teacherName}`
                  : `TUẦN HỌC THỨ : ${schoolInfo.week}  |  KHỐI : ${schoolInfo.grade}  |  LỚP : ${schoolInfo.className}`, 
                bold: true, 
                font, 
                size: baseSize 
              }),
            ],
          }),
          // Main Table (1 Thứ, 1 Ngày cho tất cả các tiết trong ngày, Tên bài dạy tinh gọn, Ghi chú để trống)
          buildOfficialLBGTable(schoolInfo, scheduleItems, font, baseSize, smallSize, tableWidth),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const filePrefix = schoolInfo.teacherType === "specialist" 
    ? `LBG_A4_Tuan_${schoolInfo.week}_GVChuyen_${schoolInfo.specialistSubject}_GV_${schoolInfo.teacherName}`
    : `LBG_A4_Tuan_${schoolInfo.week}_Lop_${schoolInfo.className}_GV_${schoolInfo.teacherName}`;
  return saveDocxFile(blob, `${filePrefix}.docx`);
}

/**
 * 3. Generate Word (.docx) A4 for Full Week or Single Lesson Plan (Kế hoạch bài dạy - KHBD)
 * Following CV 2345/BGDĐT standard: 2-column activities, all competencies & integrations, font size 12-14pt.
 */
export async function exportLessonPlansDocx(
  schoolInfo: SchoolInfo,
  lessonPlans: LessonPlan[],
  titleSuffix: string = "Cả_Tuần"
) {
  const font = schoolInfo.fontFamily || "Times New Roman";
  const baseSize = getFontSizeHalfPoints(schoolInfo.fontSize || 13);
  const smallSize = getFontSizeHalfPoints((schoolInfo.fontSize || 13) - 1);
  const subTitleSize = getFontSizeHalfPoints((schoolInfo.fontSize || 13) + 1);
  const titleSize = getFontSizeHalfPoints((schoolInfo.fontSize || 13) + 3);

  const tableWidth = 9400;
  const colHalfWidth = 4700;

  const docChildren: any[] = [];

  const dayOrder: Record<string, number> = {
    "Thứ Hai": 1,
    "Thứ Ba": 2,
    "Thứ Tư": 3,
    "Thứ Năm": 4,
    "Thứ Sáu": 5,
  };
  const sessionRank = (s?: string) => {
    if (!s) return 1;
    const lower = s.toLowerCase();
    if (lower.includes("chiều") || lower === "afternoon") return 2;
    return 1;
  };

  const sortedPlans = [...lessonPlans].sort((a, b) => {
    const orderA = dayOrder[a.dayOfWeek] || 99;
    const orderB = dayOrder[b.dayOfWeek] || 99;
    if (orderA !== orderB) return orderA - orderB;
    const sessA = sessionRank(a.session);
    const sessB = sessionRank(b.session);
    if (sessA !== sessB) return sessA - sessB;
    return Number(a.periodNumber || 0) - Number(b.periodNumber || 0);
  });

  sortedPlans.forEach((plan, planIdx) => {
    if (planIdx > 0) {
      docChildren.push(new Paragraph({ children: [new PageBreak()] }));
    }

    // Top Header of Lesson Plan
    docChildren.push(
      new Table({
        width: { size: tableWidth, type: WidthType.DXA },
        borders: {
          top: { style: BorderStyle.NONE },
          bottom: { style: BorderStyle.NONE },
          left: { style: BorderStyle.NONE },
          right: { style: BorderStyle.NONE },
          insideHorizontal: { style: BorderStyle.NONE },
          insideVertical: { style: BorderStyle.NONE },
        },
        rows: [
          new TableRow({
            children: [
              new TableCell({
                width: { size: 4500, type: WidthType.DXA },
                children: [
                  new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: (plan.departmentName || schoolInfo.departmentName || "PHÒNG GD&ĐT").toUpperCase(), font, size: smallSize })] }),
                  new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: (plan.schoolName || schoolInfo.schoolName || "TRƯỜNG TIỂU HỌC").toUpperCase(), bold: true, font, size: baseSize })] }),
                  new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `TỔ CHUYÊN MÔN KHỐI ${plan.grade}`, font, size: smallSize })] }),
                ],
              }),
              new TableCell({
                width: { size: 4900, type: WidthType.DXA },
                children: [
                  new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `LỚP: ${plan.className.toUpperCase()}`, bold: true, font, size: baseSize })] }),
                  new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `Năm học: ${schoolInfo.academicYear}`, font, size: smallSize })] }),
                  new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `Thời gian: ${plan.dateStr || schoolInfo.startDate}`, font, size: smallSize })] }),
                ],
              }),
            ],
          }),
        ],
      })
    );

    // Document Title
    docChildren.push(new Paragraph({ text: "", spacing: { before: 150 } }));
    docChildren.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({ text: `KẾ HOẠCH BÀI DẠY CHI TIẾT TUẦN ${plan.week}`, bold: true, font, size: titleSize, color: "0F172A" }),
        ],
      })
    );
    docChildren.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({ text: `NĂM HỌC ${schoolInfo.academicYear} (LỚP ${plan.className})`, bold: true, font, size: subTitleSize }),
        ],
      })
    );
    docChildren.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 150 },
        children: [
          new TextRun({ text: `Giáo viên giảng dạy: ${plan.teacherName}`, font, size: baseSize }),
        ],
      })
    );

    // Lesson Banner
    docChildren.push(
      new Paragraph({
        spacing: { before: 80, after: 80 },
        children: [
          new TextRun({ text: `★ ${plan.dayOfWeek.toUpperCase()}, NGÀY ${plan.dateStr || ""}`, bold: true, color: "B91C1C", font, size: subTitleSize }),
        ],
      })
    );

    docChildren.push(
      new Paragraph({
        children: [
          new TextRun({ text: `MÔN: ${plan.subject.toUpperCase()}${plan.subSubject ? ` (${plan.subSubject.toUpperCase()})` : ""} - TIẾT PPCT: ${plan.curriculumPeriod}`, bold: true, color: "1E3A8A", font, size: subTitleSize }),
        ],
      })
    );

    docChildren.push(
      new Paragraph({
        spacing: { after: 120 },
        children: [
          new TextRun({ text: `Bài học: ${plan.lessonTitle}`, bold: true, font, size: baseSize }),
          new TextRun({ text: ` | Mẫu Công văn 2345/BGDĐT`, italics: true, font, size: smallSize, color: "475569" }),
        ],
      })
    );

    // Section I: Objectives (YÊU CẦU CẦN ĐẠT)
    docChildren.push(
      new Paragraph({
        children: [new TextRun({ text: "I. YÊU CẦU CẦN ĐẠT", bold: true, color: "0F172A", font, size: baseSize })],
      })
    );

    // 1. Specific competencies
    docChildren.push(
      new Paragraph({
        children: [
          new TextRun({ text: "1. Năng lực đặc thù: ", bold: true, font, size: baseSize }),
          new TextRun({ text: plan.objectives.specificCompetencies.join(" "), font, size: baseSize }),
        ],
      })
    );

    // 2. General competencies
    docChildren.push(
      new Paragraph({
        children: [
          new TextRun({ text: "2. Năng lực chung: ", bold: true, font, size: baseSize }),
          new TextRun({ text: plan.objectives.generalCompetencies.join(" "), font, size: baseSize }),
        ],
      })
    );

    // 3. Qualities
    docChildren.push(
      new Paragraph({
        children: [
          new TextRun({ text: "3. Phẩm chất: ", bold: true, font, size: baseSize }),
          new TextRun({ text: plan.objectives.qualities.join(" "), font, size: baseSize }),
        ],
      })
    );

    // Integrations
    if (plan.objectives.integrations) {
      const ints = plan.objectives.integrations;
      const intLines: string[] = [];
      if (ints.ai) intLines.push(`• Tích hợp Trí tuệ nhân tạo (AI): ${ints.ai}`);
      if (ints.digitalCompetence) intLines.push(`• Tích hợp Năng lực số (CV 3456/BGDĐT): ${ints.digitalCompetence}`);
      if (ints.humanRights) intLines.push(`• Tích hợp Giáo dục Quyền con người (QCN): ${ints.humanRights}`);
      if (ints.defense) intLines.push(`• Tích hợp Giáo dục Quốc phòng và An ninh (TT 08/2024): ${ints.defense}`);
      if (ints.nutrition) intLines.push(`• Tích hợp Giáo dục Dinh dưỡng: ${ints.nutrition}`);
      if (ints.stem) intLines.push(`• Tích hợp STEM / Học thông qua chơi: ${ints.stem}`);
      if (ints.environment) intLines.push(`• Tích hợp Bảo vệ môi trường: ${ints.environment}`);
      if (ints.lifeSkills) intLines.push(`• Tích hợp Kỹ năng sống: ${ints.lifeSkills}`);

      if (intLines.length > 0) {
        docChildren.push(
          new Paragraph({
            children: [
              new TextRun({ text: "4. Nội dung tích hợp lồng ghép: ", bold: true, color: "047857", font, size: baseSize }),
              new TextRun({ text: intLines.join("\n"), italics: true, color: "065F46", font, size: baseSize }),
            ],
          })
        );
      }
    }

    // Section II: Materials
    docChildren.push(new Paragraph({ text: "", spacing: { before: 80 } }));
    docChildren.push(
      new Paragraph({
        children: [new TextRun({ text: "II. ĐỒ DÙNG DẠY HỌC VÀ HỌC LIỆU", bold: true, color: "0F172A", font, size: baseSize })],
      })
    );
    docChildren.push(
      new Paragraph({
        children: [
          new TextRun({ text: "- Giáo viên: ", bold: true, font, size: baseSize }),
          new TextRun({ text: plan.materials.teacher.join("; "), font, size: baseSize }),
        ],
      })
    );
    docChildren.push(
      new Paragraph({
        children: [
          new TextRun({ text: "- Học sinh: ", bold: true, font, size: baseSize }),
          new TextRun({ text: plan.materials.student.join("; "), font, size: baseSize }),
        ],
      })
    );

    // Section III: 2-Column Teaching Activities Table
    docChildren.push(new Paragraph({ text: "", spacing: { before: 80 } }));
    docChildren.push(
      new Paragraph({
        children: [new TextRun({ text: "III. CÁC HOẠT ĐỘNG DẠY HỌC CHỦ YẾU", bold: true, color: "0F172A", font, size: baseSize })],
      })
    );

    const activityTableRows: TableRow[] = [
      new TableRow({
        tableHeader: true,
        children: [
          new TableCell({
            width: { size: colHalfWidth, type: WidthType.DXA },
            shading: { fill: "1E3A8A" },
            children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "HOẠT ĐỘNG CỦA GIÁO VIÊN", bold: true, color: "FFFFFF", font, size: baseSize })] })],
          }),
          new TableCell({
            width: { size: colHalfWidth, type: WidthType.DXA },
            shading: { fill: "1E3A8A" },
            children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "HOẠT ĐỘNG CỦA HỌC SINH", bold: true, color: "FFFFFF", font, size: baseSize })] })],
          }),
        ],
      }),
    ];

    // Ensure detailed classroom activities
    let activitiesToRender = plan.activities;
    if (!activitiesToRender || activitiesToRender.length === 0 || activitiesToRender.some(a => a.teacherActivity.length < 80)) {
      const detailed = getDetailedActivitiesForLesson(
        plan.subject,
        plan.lessonTitle,
        plan.grade,
        plan.subSubject,
        plan.curriculumPeriod
      );
      activitiesToRender = [
        {
          name: "1. Hoạt động Khởi động",
          objective: "Tạo tâm thế hứng khởi, kích hoạt kiến thức nền tảng và kết nối vào bài mới.",
          teacherActivity: detailed.act1Teacher,
          studentActivity: detailed.act1Student,
        },
        {
          name: "2. Hoạt động Khám phá",
          objective: "Hình thành kiến thức mới và các kỹ năng trọng tâm của bài học.",
          teacherActivity: detailed.act2Teacher,
          studentActivity: detailed.act2Student,
        },
        {
          name: "3. Hoạt động Luyện tập - Thực hành",
          objective: "Củng cố và rèn luyện kỹ năng qua các bài tập và tình huống vận dụng.",
          teacherActivity: detailed.act3Teacher,
          studentActivity: detailed.act3Student,
        },
        {
          name: "4. Hoạt động Vận dụng",
          objective: "Vận dụng kiến thức bài học vào thực tế đời sống và kết nối bài học sau.",
          teacherActivity: detailed.act4Teacher,
          studentActivity: detailed.act4Student,
        },
      ];
    }

    activitiesToRender.forEach((act) => {
      const teacherParas: Paragraph[] = [
        new Paragraph({ children: [new TextRun({ text: act.name, bold: true, color: "1E40AF", font, size: baseSize })] }),
        new Paragraph({ children: [new TextRun({ text: `- Mục tiêu: `, bold: true, font, size: baseSize }), new TextRun({ text: act.objective, font, size: baseSize })] }),
        new Paragraph({ children: [new TextRun({ text: `- Cách tiến hành:`, bold: true, font, size: baseSize })] }),
      ];

      act.teacherActivity.split("\n").forEach((line) => {
        if (line.trim()) {
          teacherParas.push(
            new Paragraph({
              spacing: { before: 20, after: 20 },
              children: [new TextRun({ text: line.trim(), font, size: baseSize })],
            })
          );
        }
      });

      const studentParas: Paragraph[] = [];
      act.studentActivity.split("\n").forEach((line) => {
        if (line.trim()) {
          studentParas.push(
            new Paragraph({
              spacing: { before: 20, after: 20 },
              children: [new TextRun({ text: line.trim(), font, size: baseSize })],
            })
          );
        }
      });
      if (studentParas.length === 0) {
        studentParas.push(new Paragraph({ children: [new TextRun({ text: act.studentActivity, font, size: baseSize })] }));
      }

      activityTableRows.push(
        new TableRow({
          children: [
            new TableCell({
              width: { size: colHalfWidth, type: WidthType.DXA },
              children: teacherParas,
            }),
            new TableCell({
              width: { size: colHalfWidth, type: WidthType.DXA },
              children: studentParas,
            }),
          ],
        })
      );
    });

    docChildren.push(
      new Table({
        width: { size: tableWidth, type: WidthType.DXA },
        rows: activityTableRows,
      })
    );

    // Section IV: Post Lesson Adjustment
    docChildren.push(new Paragraph({ text: "", spacing: { before: 80 } }));
    docChildren.push(
      new Paragraph({
        children: [new TextRun({ text: "IV. ĐIỀU CHỈNH SAU BÀI DẠY", bold: true, color: "0F172A", font, size: baseSize })],
      })
    );
    docChildren.push(
      new Paragraph({
        children: [new TextRun({ text: plan.postLessonAdjustment || "...........................................................................................................................................................................\n...........................................................................................................................................................................", font, size: smallSize, color: "64748B" })],
      })
    );
    docChildren.push(
      new Paragraph({
        spacing: { after: 120 },
        children: [new TextRun({ text: "------------------------------------------------------------------------------------------------------------------------", font, size: smallSize, color: "CBD5E1" })],
      })
    );
  });

  const doc = new Document({
    sections: [
      {
        properties: {
          page: STANDARD_A4_PAGE_PORTRAIT,
        },
        children: docChildren,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const filePrefix = schoolInfo.teacherType === "specialist"
    ? `KHBD_A4_${titleSuffix}_GVChuyen_${schoolInfo.specialistSubject}_GV_${schoolInfo.teacherName}`
    : `KHBD_A4_${titleSuffix}_Lop_${schoolInfo.className}_GV_${schoolInfo.teacherName}`;
  return saveDocxFile(blob, `${filePrefix}.docx`);
}

/**
 * 4. Generate Combo Word (.docx) A4 All-In-One Document containing TKB + LBG + KHBD
 */
export async function exportCombinedAllInOneDocx(
  schoolInfo: SchoolInfo,
  masterTimetable: MasterTimetable,
  scheduleItems: ScheduleItem[],
  lessonPlans: LessonPlan[]
) {
  const font = schoolInfo.fontFamily || "Times New Roman";
  const baseSize = getFontSizeHalfPoints(schoolInfo.fontSize || 13);
  const smallSize = getFontSizeHalfPoints((schoolInfo.fontSize || 13) - 1);
  const subTitleSize = getFontSizeHalfPoints((schoolInfo.fontSize || 13) + 1);
  const titleSize = getFontSizeHalfPoints((schoolInfo.fontSize || 13) + 3);

  const tableWidth = 9400;
  const colHalfWidth = 4700;
  const cls = schoolInfo.className;

  const docChildren: any[] = [];

  // =================== PART 1: THỜI KHÓA BIỂU (TKB) ===================
  docChildren.push(
    new Table({
      width: { size: tableWidth, type: WidthType.DXA },
      borders: {
        top: { style: BorderStyle.NONE },
        bottom: { style: BorderStyle.NONE },
        left: { style: BorderStyle.NONE },
        right: { style: BorderStyle.NONE },
        insideHorizontal: { style: BorderStyle.NONE },
        insideVertical: { style: BorderStyle.NONE },
      },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 4500, type: WidthType.DXA },
              children: [
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: (schoolInfo.departmentName || "PHÒNG GIÁO DỤC VÀ ĐÀO TẠO").toUpperCase(), font, size: smallSize })] }),
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: (schoolInfo.schoolName || "TRƯỜNG TIỂU HỌC").toUpperCase(), bold: true, font, size: baseSize })] }),
                ...(schoolInfo.branchName ? [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `Phân hiệu: ${schoolInfo.branchName}`, font, size: smallSize })] })] : []),
              ],
            }),
            new TableCell({
              width: { size: 4900, type: WidthType.DXA },
              children: [
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM", bold: true, font, size: baseSize })] }),
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Độc lập - Tự do - Hạnh phúc", bold: true, font, size: baseSize })] }),
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "---------------------------", font, size: smallSize })] }),
              ],
            }),
          ],
        }),
      ],
    })
  );

  docChildren.push(new Paragraph({ text: "", spacing: { before: 150 } }));
  docChildren.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: `[PHẦN 1] THỜI KHÓA BIỂU - LỚP ${cls}`, bold: true, font, size: titleSize, color: "0F172A" })],
    })
  );
  docChildren.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 150 },
      children: [new TextRun({ text: `Năm học: ${schoolInfo.academicYear} | GVCN: ${schoolInfo.teacherName}`, italics: true, font, size: baseSize })],
    })
  );

  // TKB Table
  const tkbColWidths = [1300, 900, 1440, 1440, 1440, 1440, 1440];
  const tkbRows: TableRow[] = [
    new TableRow({
      tableHeader: true,
      children: [
        new TableCell({ width: { size: tkbColWidths[0], type: WidthType.DXA }, shading: { fill: "E2E8F0" }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Buổi", bold: true, font, size: baseSize })] })] }),
        new TableCell({ width: { size: tkbColWidths[1], type: WidthType.DXA }, shading: { fill: "E2E8F0" }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Tiết", bold: true, font, size: baseSize })] })] }),
        ...DAYS_OF_WEEK.map((d, di) => new TableCell({ width: { size: tkbColWidths[2 + di], type: WidthType.DXA }, shading: { fill: "E2E8F0" }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: d, bold: true, font, size: baseSize })] })] })),
      ],
    }),
  ];

  for (let p = 1; p <= 5; p++) {
    const cells: TableCell[] = [];
    if (p === 1) {
      cells.push(new TableCell({ rowSpan: 5, width: { size: tkbColWidths[0], type: WidthType.DXA }, shading: { fill: "F8FAFC" }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "SÁNG", bold: true, font, size: baseSize })] })] }));
    }
    cells.push(new TableCell({ width: { size: tkbColWidths[1], type: WidthType.DXA }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: String(p), bold: true, font, size: baseSize })] })] }));
    DAYS_OF_WEEK.forEach((d, di) => {
      const subject = masterTimetable.slots[`${d}_Sáng_${p}`]?.[cls] || "—";
      cells.push(new TableCell({ width: { size: tkbColWidths[2 + di], type: WidthType.DXA }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: subject, bold: subject !== "—", font, size: baseSize })] })] }));
    });
    tkbRows.push(new TableRow({ children: cells }));
  }

  for (let p = 1; p <= 3; p++) {
    const cells: TableCell[] = [];
    if (p === 1) {
      cells.push(new TableCell({ rowSpan: 3, width: { size: tkbColWidths[0], type: WidthType.DXA }, shading: { fill: "F8FAFC" }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "CHIỀU", bold: true, font, size: baseSize })] })] }));
    }
    cells.push(new TableCell({ width: { size: tkbColWidths[1], type: WidthType.DXA }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: String(p), bold: true, font, size: baseSize })] })] }));
    DAYS_OF_WEEK.forEach((d, di) => {
      const subject = masterTimetable.slots[`${d}_Chiều_${p}`]?.[cls] || "—";
      cells.push(new TableCell({ width: { size: tkbColWidths[2 + di], type: WidthType.DXA }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: subject, bold: subject !== "—", font, size: baseSize })] })] }));
    });
    tkbRows.push(new TableRow({ children: cells }));
  }

  docChildren.push(new Table({ width: { size: tableWidth, type: WidthType.DXA }, rows: tkbRows }));

  // =================== PART 2: LỊCH BÁO GIẢNG (LBG) ===================
  docChildren.push(new Paragraph({ children: [new PageBreak()] }));
  docChildren.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: `[PHẦN 2] LỊCH BÁO GIẢNG TUẦN ${schoolInfo.week}`, bold: true, font, size: titleSize, color: "0F172A" })],
    })
  );
  docChildren.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 150 },
      children: [new TextRun({ text: `Từ ngày ${schoolInfo.startDate} đến ngày ${schoolInfo.endDate} - Lớp ${schoolInfo.className}`, italics: true, font, size: baseSize })],
    })
  );

  docChildren.push(buildOfficialLBGTable(schoolInfo, scheduleItems, font, baseSize, smallSize, tableWidth));

  // =================== PART 3: KẾ HOẠCH BÀI DẠY (KHBD) CẢ TUẦN ===================
  docChildren.push(new Paragraph({ children: [new PageBreak()] }));
  docChildren.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: `[PHẦN 3] KẾ HOẠCH BÀI DẠY TUẦN ${schoolInfo.week} (CV 2345/BGDĐT)`, bold: true, font, size: titleSize, color: "0F172A" })],
    })
  );

  lessonPlans.forEach((plan, planIdx) => {
    if (planIdx > 0) {
      docChildren.push(new Paragraph({ children: [new PageBreak()] }));
    }

    docChildren.push(new Paragraph({ spacing: { before: 100, after: 60 }, children: [new TextRun({ text: `★ ${plan.dayOfWeek.toUpperCase()}, NGÀY ${plan.dateStr || ""}`, bold: true, color: "B91C1C", font, size: subTitleSize })] }));
    docChildren.push(new Paragraph({ children: [new TextRun({ text: `MÔN: ${plan.subject.toUpperCase()}${plan.subSubject ? ` (${plan.subSubject.toUpperCase()})` : ""} - TIẾT PPCT: ${plan.curriculumPeriod}`, bold: true, color: "1E3A8A", font, size: subTitleSize })] }));
    docChildren.push(new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: `Bài học: ${plan.lessonTitle}`, bold: true, font, size: baseSize })] }));

    // I. Yêu cầu cần đạt
    docChildren.push(new Paragraph({ children: [new TextRun({ text: "I. YÊU CẦU CẦN ĐẠT", bold: true, font, size: baseSize })] }));
    docChildren.push(new Paragraph({ children: [new TextRun({ text: "1. Năng lực đặc thù: ", bold: true, font, size: baseSize }), new TextRun({ text: plan.objectives.specificCompetencies.join(" "), font, size: baseSize })] }));
    docChildren.push(new Paragraph({ children: [new TextRun({ text: "2. Năng lực chung: ", bold: true, font, size: baseSize }), new TextRun({ text: plan.objectives.generalCompetencies.join(" "), font, size: baseSize })] }));
    docChildren.push(new Paragraph({ children: [new TextRun({ text: "3. Phẩm chất: ", bold: true, font, size: baseSize }), new TextRun({ text: plan.objectives.qualities.join(" "), font, size: baseSize })] }));

    if (plan.objectives.integrations) {
      const ints = plan.objectives.integrations;
      const intLines: string[] = [];
      if (ints.ai) intLines.push(`• AI: ${ints.ai}`);
      if (ints.digitalCompetence) intLines.push(`• Năng lực số: ${ints.digitalCompetence}`);
      if (ints.humanRights) intLines.push(`• Quyền con người: ${ints.humanRights}`);
      if (ints.defense) intLines.push(`• QPAN: ${ints.defense}`);
      if (ints.nutrition) intLines.push(`• Dinh dưỡng: ${ints.nutrition}`);
      if (ints.stem) intLines.push(`• STEM: ${ints.stem}`);
      if (intLines.length > 0) {
        docChildren.push(new Paragraph({ children: [new TextRun({ text: "4. Tích hợp: ", bold: true, color: "047857", font, size: baseSize }), new TextRun({ text: intLines.join("\n"), italics: true, color: "065F46", font, size: baseSize })] }));
      }
    }

    // II. Đồ dùng
    docChildren.push(new Paragraph({ text: "", spacing: { before: 60 } }));
    docChildren.push(new Paragraph({ children: [new TextRun({ text: "II. ĐỒ DÙNG DẠY HỌC", bold: true, font, size: baseSize })] }));
    docChildren.push(new Paragraph({ children: [new TextRun({ text: "- GV: ", bold: true, font, size: baseSize }), new TextRun({ text: plan.materials.teacher.join("; "), font, size: baseSize })] }));
    docChildren.push(new Paragraph({ children: [new TextRun({ text: "- HS: ", bold: true, font, size: baseSize }), new TextRun({ text: plan.materials.student.join("; "), font, size: baseSize })] }));

    // III. Các hoạt động
    docChildren.push(new Paragraph({ text: "", spacing: { before: 60 } }));
    docChildren.push(new Paragraph({ children: [new TextRun({ text: "III. CÁC HOẠT ĐỘNG DẠY HỌC CHỦ YẾU", bold: true, font, size: baseSize })] }));

    const activityRows: TableRow[] = [
      new TableRow({
        tableHeader: true,
        children: [
          new TableCell({ width: { size: colHalfWidth, type: WidthType.DXA }, shading: { fill: "1E3A8A" }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "HOẠT ĐỘNG CỦA GIÁO VIÊN", bold: true, color: "FFFFFF", font, size: baseSize })] })] }),
          new TableCell({ width: { size: colHalfWidth, type: WidthType.DXA }, shading: { fill: "1E3A8A" }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "HOẠT ĐỘNG CỦA HỌC SINH", bold: true, color: "FFFFFF", font, size: baseSize })] })] }),
        ],
      }),
    ];

    plan.activities.forEach((act) => {
      activityRows.push(
        new TableRow({
          children: [
            new TableCell({
              width: { size: colHalfWidth, type: WidthType.DXA },
              children: [
                new Paragraph({ children: [new TextRun({ text: act.name, bold: true, color: "1E40AF", font, size: baseSize })] }),
                new Paragraph({ children: [new TextRun({ text: `- Mục tiêu: `, bold: true, font, size: baseSize }), new TextRun({ text: act.objective, font, size: baseSize })] }),
                new Paragraph({ children: [new TextRun({ text: `- Cách tiến hành: `, bold: true, font, size: baseSize }), new TextRun({ text: act.teacherActivity, font, size: baseSize })] }),
              ],
            }),
            new TableCell({
              width: { size: colHalfWidth, type: WidthType.DXA },
              children: [new Paragraph({ children: [new TextRun({ text: act.studentActivity, font, size: baseSize })] })],
            }),
          ],
        })
      );
    });

    docChildren.push(new Table({ width: { size: tableWidth, type: WidthType.DXA }, rows: activityRows }));

    // IV. Điều chỉnh
    docChildren.push(new Paragraph({ text: "", spacing: { before: 60 } }));
    docChildren.push(new Paragraph({ children: [new TextRun({ text: "IV. ĐIỀU CHỈNH SAU BÀI DẠY: ", bold: true, font, size: baseSize }), new TextRun({ text: plan.postLessonAdjustment || ".....................................................................................................................................", font, size: smallSize, color: "64748B" })] }));
  });

  const doc = new Document({
    sections: [
      {
        properties: {
          page: STANDARD_A4_PAGE_PORTRAIT,
        },
        children: docChildren,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const comboPrefix = schoolInfo.teacherType === "specialist"
    ? `TRON_BO_A4_TKB_LBG_KHBD_Tuan_${schoolInfo.week}_GVChuyen_${schoolInfo.specialistSubject}_GV_${schoolInfo.teacherName}`
    : `TRON_BO_A4_TKB_LBG_KHBD_Tuan_${schoolInfo.week}_Lop_${schoolInfo.className}_GV_${schoolInfo.teacherName}`;
  return saveDocxFile(blob, `${comboPrefix}.docx`);
}

/**
 * 4. Generate Word (.docx) A4 for KHBD Cả Tuần: Trang 1 là LBG, kế tiếp là KHBD từ Thứ 2 đến Thứ 6
 * Chuẩn nộp Ban Giám Hiệu & Tổ chuyên môn theo CV 2345/BGDĐT
 */
export async function exportWeeklyKHBDWithLBGFirstPageDocx(
  schoolInfo: SchoolInfo,
  scheduleItems: ScheduleItem[],
  lessonPlans: LessonPlan[]
) {
  const font = schoolInfo.fontFamily || "Times New Roman";
  const baseSize = getFontSizeHalfPoints(schoolInfo.fontSize || 13);
  const smallSize = getFontSizeHalfPoints((schoolInfo.fontSize || 13) - 1);
  const subTitleSize = getFontSizeHalfPoints((schoolInfo.fontSize || 13) + 1);
  const titleSize = getFontSizeHalfPoints((schoolInfo.fontSize || 13) + 3);

  const tableWidth = 9400;
  const colHalfWidth = 4700;

  const docChildren: any[] = [];

  // =================== TRANG 1: LỊCH BÁO GIẢNG (LBG) ===================
  // Administrative Header for LBG
  docChildren.push(
    new Table({
      width: { size: tableWidth, type: WidthType.DXA },
      borders: {
        top: { style: BorderStyle.NONE },
        bottom: { style: BorderStyle.NONE },
        left: { style: BorderStyle.NONE },
        right: { style: BorderStyle.NONE },
        insideHorizontal: { style: BorderStyle.NONE },
        insideVertical: { style: BorderStyle.NONE },
      },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 4500, type: WidthType.DXA },
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: (schoolInfo.departmentName || "PHÒNG GIÁO DỤC VÀ ĐÀO TẠO").toUpperCase(), font, size: smallSize })],
                }),
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: schoolInfo.schoolName.toUpperCase(), bold: true, font, size: baseSize })],
                }),
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: schoolInfo.branchName
                        ? `PHÂN HIỆU: ${schoolInfo.branchName.toUpperCase()}`
                        : (schoolInfo.teacherType === "specialist" ? "TỔ CHUYÊN MÔN NĂNG KHIẾU" : `TỔ CHUYÊN MÔN KHỐI ${schoolInfo.grade}`),
                      font,
                      size: smallSize,
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              width: { size: 4900, type: WidthType.DXA },
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: "CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM", bold: true, font, size: baseSize })],
                }),
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: "Độc lập - Tự do - Hạnh phúc", bold: true, font, size: baseSize })],
                }),
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: "-----------------------", font, size: smallSize })],
                }),
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: `${schoolInfo.branchName || "Tiểu học"}, ngày ${schoolInfo.startDate}`, italics: true, font, size: smallSize })],
                }),
              ],
            }),
          ],
        }),
      ],
    })
  );

  // LBG Title
  docChildren.push(new Paragraph({ text: "", spacing: { before: 120 } }));
  docChildren.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: schoolInfo.teacherType === "specialist"
            ? `LỊCH BÁO GIẢNG DẠY CHUYÊN MÔN: ${schoolInfo.specialistSubject?.toUpperCase()} - TUẦN ${schoolInfo.week}`
            : `LỊCH BÁO GIẢNG TUẦN ${schoolInfo.week}`,
          bold: true,
          font,
          size: titleSize,
          color: "0F172A",
        }),
      ],
    })
  );
  docChildren.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: `Từ ngày ${schoolInfo.startDate} đến ngày ${schoolInfo.endDate} (Năm học ${schoolInfo.academicYear})`,
          italics: true,
          font,
          size: baseSize,
        }),
      ],
    })
  );
  docChildren.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 150 },
      children: [
        new TextRun({
          text: schoolInfo.teacherType === "specialist"
            ? `TUẦN : ${schoolInfo.week}  |  MÔN CHUYÊN : ${schoolInfo.specialistSubject?.toUpperCase()}  |  GV BỘ MÔN : ${schoolInfo.teacherName}`
            : `TUẦN : ${schoolInfo.week}  |  KHỐI : ${schoolInfo.grade}  |  LỚP : ${schoolInfo.className}  |  GVCN : ${schoolInfo.teacherName}`,
          bold: true,
          font,
          size: baseSize,
        }),
      ],
    })
  );

  // LBG 7-column Table (1 Thứ, 1 Ngày cho tất cả các tiết trong ngày, Tên bài dạy tinh gọn, Ghi chú để trống)
  docChildren.push(buildOfficialLBGTable(schoolInfo, scheduleItems, font, baseSize, smallSize, tableWidth));

  // =================== TRANG 2 TRỞ ĐI: KHBD TỪ THỨ 2 ĐẾN THỨ 6 ===================
  docChildren.push(new Paragraph({ children: [new PageBreak()] }));

  // Top header for KHBD Section
  docChildren.push(
    new Table({
      width: { size: tableWidth, type: WidthType.DXA },
      borders: {
        top: { style: BorderStyle.NONE },
        bottom: { style: BorderStyle.NONE },
        left: { style: BorderStyle.NONE },
        right: { style: BorderStyle.NONE },
        insideHorizontal: { style: BorderStyle.NONE },
        insideVertical: { style: BorderStyle.NONE },
      },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 4500, type: WidthType.DXA },
              children: [
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: (schoolInfo.departmentName || "PHÒNG GD&ĐT").toUpperCase(), font, size: smallSize })] }),
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: schoolInfo.schoolName.toUpperCase(), bold: true, font, size: baseSize })] }),
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: schoolInfo.teacherType === "specialist" ? "TỔ CHUYÊN MÔN NĂNG KHIẾU" : `TỔ CHUYÊN MÔN KHỐI ${schoolInfo.grade}`,
                      font,
                      size: smallSize,
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              width: { size: 4900, type: WidthType.DXA },
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: schoolInfo.teacherType === "specialist" ? `MÔN: ${(schoolInfo.specialistSubject || "").toUpperCase()}` : `LỚP: ${schoolInfo.className.toUpperCase()}`,
                      bold: true,
                      font,
                      size: baseSize,
                    }),
                  ],
                }),
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: `Năm học: ${schoolInfo.academicYear}`, font, size: smallSize })],
                }),
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: `Thời gian: ${schoolInfo.startDate} - ${schoolInfo.endDate}`, font, size: smallSize })],
                }),
              ],
            }),
          ],
        }),
      ],
    })
  );

  docChildren.push(new Paragraph({ text: "", spacing: { before: 120 } }));
  docChildren.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: `KẾ HOẠCH BÀI DẠY TUẦN ${schoolInfo.week} (TỪ THỨ 2 ĐẾN THỨ 6)`,
          bold: true,
          font,
          size: titleSize,
          color: "0F172A",
        }),
      ],
    })
  );
  docChildren.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: "Thực hiện theo Công văn số 2345/BGDĐT-GDTH của Bộ Giáo dục và Đào tạo",
          italics: true,
          font,
          size: smallSize,
        }),
      ],
    })
  );
  docChildren.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 150 },
      children: [
        new TextRun({
          text: schoolInfo.teacherType === "specialist"
            ? `Tuần ${schoolInfo.week} (${schoolInfo.startDate} - ${schoolInfo.endDate})  |  Môn: ${schoolInfo.specialistSubject}  |  GV: ${schoolInfo.teacherName}`
            : `Tuần ${schoolInfo.week} (${schoolInfo.startDate} - ${schoolInfo.endDate})  |  Lớp: ${schoolInfo.className}  |  GVCN: ${schoolInfo.teacherName}`,
          font,
          size: baseSize,
        }),
      ],
    })
  );

  // Group and sort lesson plans day by day (Thứ Hai -> Thứ Sáu) and period by period
  const dayOrder: Record<string, number> = {
    "Thứ Hai": 1,
    "Thứ Ba": 2,
    "Thứ Tư": 3,
    "Thứ Năm": 4,
    "Thứ Sáu": 5,
  };
  const sessionRank = (s?: string) => {
    if (!s) return 1;
    const lower = s.toLowerCase();
    if (lower.includes("chiều") || lower === "afternoon") return 2;
    return 1;
  };

  const sortedPlans = [...lessonPlans].sort((a, b) => {
    const orderA = dayOrder[a.dayOfWeek] || 99;
    const orderB = dayOrder[b.dayOfWeek] || 99;
    if (orderA !== orderB) return orderA - orderB;
    const sessA = sessionRank(a.session);
    const sessB = sessionRank(b.session);
    if (sessA !== sessB) return sessA - sessB;
    return Number(a.periodNumber || 0) - Number(b.periodNumber || 0);
  });

  const weekDays = ["Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu"];

  weekDays.forEach((day, dayIndex) => {
    const plansForDay = sortedPlans.filter((p) => p.dayOfWeek === day);
    if (plansForDay.length === 0) return;

    if (dayIndex > 0) {
      docChildren.push(new Paragraph({ children: [new PageBreak()] }));
    }

    // Day banner
    docChildren.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 140, after: 100 },
        shading: { fill: "1E293B" },
        children: [
          new TextRun({
            text: `★ ★ ★ ${day.toUpperCase()} (NGÀY ${plansForDay[0]?.dateStr || ""}) ★ ★ ★`,
            bold: true,
            color: "FFFFFF",
            font,
            size: subTitleSize,
          }),
        ],
      })
    );

    plansForDay.forEach((plan, planIdxInDay) => {
      if (planIdxInDay > 0) {
        docChildren.push(new Paragraph({ text: "", spacing: { before: 150 } }));
        docChildren.push(
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: "-------------------------------------------------------------------------------------------------------------",
                font,
                size: smallSize,
                color: "94A3B8",
              }),
            ],
          })
        );
        docChildren.push(new Paragraph({ text: "", spacing: { before: 100 } }));
      }

      // Lesson Header
      docChildren.push(
        new Paragraph({
          spacing: { before: 80, after: 40 },
          children: [
            new TextRun({
              text: `MÔN: ${plan.subject.toUpperCase()}${plan.subSubject ? ` (${plan.subSubject.toUpperCase()})` : ""} - TIẾT PPCT: ${plan.curriculumPeriod || 1}${plan.className ? ` [Lớp ${plan.className}]` : ""}`,
              bold: true,
              color: "1E3A8A",
              font,
              size: subTitleSize,
            }),
          ],
        })
      );
      docChildren.push(
        new Paragraph({
          spacing: { after: 80 },
          children: [new TextRun({ text: `BÀI HỌC: ${plan.lessonTitle}`, bold: true, font, size: baseSize })],
        })
      );

      // I. Yêu cầu cần đạt
      docChildren.push(new Paragraph({ children: [new TextRun({ text: "I. YÊU CẦU CẦN ĐẠT", bold: true, font, size: baseSize })] }));
      docChildren.push(
        new Paragraph({
          children: [
            new TextRun({ text: "1. Năng lực đặc thù: ", bold: true, font, size: baseSize }),
            new TextRun({ text: plan.objectives.specificCompetencies.join(" "), font, size: baseSize }),
          ],
        })
      );
      docChildren.push(
        new Paragraph({
          children: [
            new TextRun({ text: "2. Năng lực chung: ", bold: true, font, size: baseSize }),
            new TextRun({ text: plan.objectives.generalCompetencies.join(" "), font, size: baseSize }),
          ],
        })
      );
      docChildren.push(
        new Paragraph({
          children: [
            new TextRun({ text: "3. Phẩm chất: ", bold: true, font, size: baseSize }),
            new TextRun({ text: plan.objectives.qualities.join(" "), font, size: baseSize }),
          ],
        })
      );

      if (plan.objectives.integrations) {
        const ints = plan.objectives.integrations;
        const intLines: string[] = [];
        if (ints.ai) intLines.push(`• AI: ${ints.ai}`);
        if (ints.digitalCompetence) intLines.push(`• Năng lực số: ${ints.digitalCompetence}`);
        if (ints.humanRights) intLines.push(`• Quyền con người: ${ints.humanRights}`);
        if (ints.defense) intLines.push(`• QPAN: ${ints.defense}`);
        if (ints.nutrition) intLines.push(`• Dinh dưỡng: ${ints.nutrition}`);
        if (ints.stem) intLines.push(`• STEM: ${ints.stem}`);
        if (intLines.length > 0) {
          docChildren.push(
            new Paragraph({
              children: [
                new TextRun({ text: "4. Tích hợp giáo dục: ", bold: true, color: "047857", font, size: baseSize }),
                new TextRun({ text: intLines.join("\n"), italics: true, color: "065F46", font, size: baseSize }),
              ],
            })
          );
        }
      }

      // II. Đồ dùng dạy học
      docChildren.push(new Paragraph({ text: "", spacing: { before: 60 } }));
      docChildren.push(new Paragraph({ children: [new TextRun({ text: "II. ĐỒ DÙNG DẠY HỌC", bold: true, font, size: baseSize })] }));
      docChildren.push(
        new Paragraph({
          children: [
            new TextRun({ text: "- Giáo viên: ", bold: true, font, size: baseSize }),
            new TextRun({ text: plan.materials.teacher.join("; "), font, size: baseSize }),
          ],
        })
      );
      docChildren.push(
        new Paragraph({
          children: [
            new TextRun({ text: "- Học sinh: ", bold: true, font, size: baseSize }),
            new TextRun({ text: plan.materials.student.join("; "), font, size: baseSize }),
          ],
        })
      );

      // III. Các hoạt động dạy học chủ yếu (Bảng 2 cột CV 2345)
      docChildren.push(new Paragraph({ text: "", spacing: { before: 60 } }));
      docChildren.push(new Paragraph({ children: [new TextRun({ text: "III. CÁC HOẠT ĐỘNG DẠY HỌC CHỦ YẾU", bold: true, font, size: baseSize })] }));

      const activityRows: TableRow[] = [
        new TableRow({
          tableHeader: true,
          children: [
            new TableCell({ width: { size: colHalfWidth, type: WidthType.DXA }, shading: { fill: "1E3A8A" }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "HOẠT ĐỘNG CỦA GIÁO VIÊN", bold: true, color: "FFFFFF", font, size: baseSize })] })] }),
            new TableCell({ width: { size: colHalfWidth, type: WidthType.DXA }, shading: { fill: "1E3A8A" }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "HOẠT ĐỘNG CỦA HỌC SINH", bold: true, color: "FFFFFF", font, size: baseSize })] })] }),
          ],
        }),
      ];

      // Ensure detailed classroom activities
      let activitiesToRender = plan.activities;
      if (!activitiesToRender || activitiesToRender.length === 0 || activitiesToRender.some(a => a.teacherActivity.length < 80)) {
        const detailed = getDetailedActivitiesForLesson(
          plan.subject,
          plan.lessonTitle,
          plan.grade,
          plan.subSubject,
          plan.curriculumPeriod
        );
        activitiesToRender = [
          {
            name: "1. Hoạt động Khởi động",
            objective: "Tạo tâm thế hứng khởi, kích hoạt kiến thức nền tảng và kết nối vào bài mới.",
            teacherActivity: detailed.act1Teacher,
            studentActivity: detailed.act1Student,
          },
          {
            name: "2. Hoạt động Khám phá",
            objective: "Hình thành kiến thức mới và các kỹ năng trọng tâm của bài học.",
            teacherActivity: detailed.act2Teacher,
            studentActivity: detailed.act2Student,
          },
          {
            name: "3. Hoạt động Luyện tập - Thực hành",
            objective: "Củng cố và rèn luyện kỹ năng qua các bài tập và tình huống vận dụng.",
            teacherActivity: detailed.act3Teacher,
            studentActivity: detailed.act3Student,
          },
          {
            name: "4. Hoạt động Vận dụng",
            objective: "Vận dụng kiến thức bài học vào thực tế đời sống và kết nối bài học sau.",
            teacherActivity: detailed.act4Teacher,
            studentActivity: detailed.act4Student,
          },
        ];
      }

      activitiesToRender.forEach((act) => {
        const teacherParas: Paragraph[] = [
          new Paragraph({ children: [new TextRun({ text: act.name, bold: true, color: "1E40AF", font, size: baseSize })] }),
          new Paragraph({ children: [new TextRun({ text: `- Mục tiêu: `, bold: true, font, size: baseSize }), new TextRun({ text: act.objective, font, size: baseSize })] }),
          new Paragraph({ children: [new TextRun({ text: `- Cách tiến hành:`, bold: true, font, size: baseSize })] }),
        ];

        act.teacherActivity.split("\n").forEach((line) => {
          if (line.trim()) {
            teacherParas.push(
              new Paragraph({
                spacing: { before: 20, after: 20 },
                children: [new TextRun({ text: line.trim(), font, size: baseSize })],
              })
            );
          }
        });

        const studentParas: Paragraph[] = [];
        act.studentActivity.split("\n").forEach((line) => {
          if (line.trim()) {
            studentParas.push(
              new Paragraph({
                spacing: { before: 20, after: 20 },
                children: [new TextRun({ text: line.trim(), font, size: baseSize })],
              })
            );
          }
        });
        if (studentParas.length === 0) {
          studentParas.push(new Paragraph({ children: [new TextRun({ text: act.studentActivity, font, size: baseSize })] }));
        }

        activityRows.push(
          new TableRow({
            children: [
              new TableCell({
                width: { size: colHalfWidth, type: WidthType.DXA },
                children: teacherParas,
              }),
              new TableCell({
                width: { size: colHalfWidth, type: WidthType.DXA },
                children: studentParas,
              }),
            ],
          })
        );
      });

      docChildren.push(new Table({ width: { size: tableWidth, type: WidthType.DXA }, rows: activityRows }));

      // IV. Điều chỉnh sau bài dạy
      docChildren.push(new Paragraph({ text: "", spacing: { before: 60 } }));
      docChildren.push(
        new Paragraph({
          children: [
            new TextRun({ text: "IV. ĐIỀU CHỈNH SAU BÀI DẠY: ", bold: true, font, size: baseSize }),
            new TextRun({ text: plan.postLessonAdjustment || ".....................................................................................................................................", font, size: smallSize, color: "64748B" }),
          ],
        })
      );
    });
  });

  const doc = new Document({
    sections: [
      {
        properties: {
          page: STANDARD_A4_PAGE_PORTRAIT,
        },
        children: docChildren,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const filePrefix = schoolInfo.teacherType === "specialist"
    ? `KHBD_Kem_LBG_TrangDau_Tuan_${schoolInfo.week}_GVChuyen_${schoolInfo.specialistSubject}_GV_${schoolInfo.teacherName}`
    : `KHBD_Kem_LBG_TrangDau_Tuan_${schoolInfo.week}_Lop_${schoolInfo.className}_GV_${schoolInfo.teacherName}`;
  return saveDocxFile(blob, `${filePrefix}.docx`);
}

/**
 * 5. One-click Batch Download: Downloads 3 separate files (.TKB.docx, .LBG.docx, .KHBD.docx)
 */
export async function exportAllThreeFiles(
  schoolInfo: SchoolInfo,
  masterTimetable: MasterTimetable,
  scheduleItems: ScheduleItem[],
  lessonPlans: LessonPlan[]
) {
  await exportTimetableDocx(schoolInfo, masterTimetable, schoolInfo.className, "portrait");
  // Brief delay to ensure browser handles consecutive downloads smoothly
  await new Promise((resolve) => setTimeout(resolve, 600));
  await exportScheduleDocx(schoolInfo, scheduleItems);
  await new Promise((resolve) => setTimeout(resolve, 600));
  await exportLessonPlansDocx(schoolInfo, lessonPlans, `Tuan_${schoolInfo.week}_Ca_Tuan`);
}
