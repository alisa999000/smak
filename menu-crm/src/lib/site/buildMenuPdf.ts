import type { Content, TDocumentDefinitions } from "pdfmake/interfaces";
import type { MenuPdfDay, MenuWeekPdfData } from "@/lib/site/menuWeekExport";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfmake = require("pdfmake");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const vfsFonts = require("pdfmake/build/vfs_fonts");

let fontsReady = false;

function ensurePdfFonts() {
  if (fontsReady) return;
  for (const [filename, data] of Object.entries(vfsFonts as Record<string, string>)) {
    pdfmake.virtualfs.writeFileSync(filename, data, "base64");
  }
  pdfmake.setFonts({
    Roboto: {
      normal: "Roboto-Regular.ttf",
      bold: "Roboto-Medium.ttf",
      italics: "Roboto-Italic.ttf",
      bolditalics: "Roboto-MediumItalic.ttf",
    },
  });
  fontsReady = true;
}

const BRAND = {
  green: "#517B39",
  greenDark: "#3F5F2D",
  cream: "#FAF3E9",
  creamDark: "#F0E6D8",
  ink: "#2C2724",
  muted: "#6B6560",
  line: "#E5DDD2",
};

function daySection(day: MenuPdfDay, index: number): Content[] {
  const blocks: Content[] = [
    {
      table: {
        widths: ["*"],
        body: [
          [
            {
              text: `${day.weekdayRu}, ${day.dateLabel}`,
              style: "dayTitle",
              fillColor: BRAND.green,
              color: "#FFFFFF",
              margin: [14, 10, 14, 10],
            },
          ],
        ],
      },
      layout: "noBorders",
      pageBreak: index > 0 ? "before" : undefined,
      margin: [0, index === 0 ? 8 : 0, 0, 14],
    },
  ];

  if (!day.categories.length) {
    blocks.push({ text: "На этот день блюда не запланированы.", style: "muted", margin: [0, 0, 0, 12] });
    return blocks;
  }

  for (const category of day.categories) {
    blocks.push({
      text: category.name,
      style: "categoryTitle",
      margin: [0, 4, 0, 6],
    });

    const body: Content[][] = [
      [
        { text: "Блюдо", style: "tableHeader" },
        { text: "Вес", style: "tableHeader", alignment: "center" },
        { text: "Цена", style: "tableHeader", alignment: "right" },
      ],
    ];

    for (const item of category.items) {
      const nameCell: Content = item.composition
        ? {
            stack: [
              { text: item.name, style: "dishName" },
              { text: item.composition, style: "dishMeta" },
            ],
          }
        : { text: item.name, style: "dishName" };

      body.push([
        nameCell,
        { text: item.weight || "—", style: "tableCell", alignment: "center" },
        { text: item.price || "—", style: "tablePrice", alignment: "right" },
      ]);
    }

    blocks.push({
      table: {
        headerRows: 1,
        widths: ["*", 52, 58],
        body,
      },
      layout: {
        hLineWidth: (i: number, node: { table: { body: unknown[] } }) =>
          i === 0 || i === 1 || i === node.table.body.length ? 0.8 : 0.4,
        vLineWidth: () => 0,
        hLineColor: (i: number) => (i === 1 ? BRAND.green : BRAND.line),
        fillColor: (rowIndex: number) => (rowIndex === 0 ? BRAND.creamDark : rowIndex % 2 === 0 ? BRAND.cream : null),
        paddingLeft: () => 10,
        paddingRight: () => 10,
        paddingTop: () => 7,
        paddingBottom: () => 7,
      },
      margin: [0, 0, 0, 14],
    });
  }

  return blocks;
}

function buildDocDefinition(data: MenuWeekPdfData): TDocumentDefinitions {
  const content: Content[] = [
    {
      canvas: [{ type: "rect", x: 0, y: 0, w: 515, h: 110, r: 16, color: BRAND.cream }],
      margin: [0, 0, 0, -98],
    },
    {
      columns: [
        {
          width: "*",
          stack: [
            { text: "Смачная точка", style: "brand" },
            { text: "Меню на текущую неделю", style: "title" },
            { text: data.periodLabel, style: "period" },
          ],
        },
        {
          width: 150,
          stack: [
            { text: data.shiftLabel, style: "badge", alignment: "right" },
            { text: "smachnaya.ru", style: "site", alignment: "right", margin: [0, 8, 0, 0] },
            { text: "+7 (911) 792-48-29", style: "site", alignment: "right", margin: [0, 2, 0, 0] },
          ],
        },
      ],
      margin: [18, 18, 18, 24],
    },
    {
      columns: [
        {
          width: "*",
          text: "Корпоративное питание · доставка обедов по Санкт-Петербургу",
          style: "muted",
        },
        {
          width: "auto",
          text: `Сформировано ${data.generatedAt}`,
          style: "muted",
          alignment: "right",
        },
      ],
      margin: [0, 0, 0, 18],
    },
    ...data.days.flatMap((day, index) => daySection(day, index)),
  ];

  return {
    pageSize: "A4",
    pageMargins: [36, 42, 36, 48],
    defaultStyle: {
      font: "Roboto",
      fontSize: 9.5,
      color: BRAND.ink,
      lineHeight: 1.25,
    },
    footer: (currentPage, pageCount) => ({
      margin: [36, 0, 36, 18],
      columns: [
        { text: "Смачная точка · меню на неделю", style: "footer" },
        { text: `${currentPage} / ${pageCount}`, style: "footer", alignment: "right" },
      ],
    }),
    styles: {
      brand: { fontSize: 11, bold: true, color: BRAND.green, margin: [0, 0, 0, 4] },
      title: { fontSize: 22, bold: true, color: BRAND.ink, margin: [0, 0, 0, 6] },
      period: { fontSize: 13, color: BRAND.greenDark, margin: [0, 0, 0, 0] },
      badge: {
        fontSize: 10,
        bold: true,
        color: BRAND.green,
        fillColor: "#E8F0E2",
        margin: [0, 2, 0, 0],
      },
      site: { fontSize: 9, color: BRAND.muted },
      muted: { fontSize: 8.5, color: BRAND.muted },
      dayTitle: { fontSize: 13, bold: true },
      categoryTitle: { fontSize: 11, bold: true, color: BRAND.greenDark },
      tableHeader: { fontSize: 8.5, bold: true, color: BRAND.greenDark },
      dishName: { fontSize: 9.5, bold: true, color: BRAND.ink },
      dishMeta: { fontSize: 8, color: BRAND.muted, margin: [0, 2, 0, 0] },
      tableCell: { fontSize: 9, color: BRAND.ink },
      tablePrice: { fontSize: 9.5, bold: true, color: BRAND.greenDark },
      footer: { fontSize: 8, color: BRAND.muted },
    },
    content,
  };
}

export async function buildMenuPdfBuffer(data: MenuWeekPdfData): Promise<Buffer> {
  ensurePdfFonts();
  const doc = pdfmake.createPdf(buildDocDefinition(data));
  return doc.getBuffer();
}
