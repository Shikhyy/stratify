import pptxgen from "pptxgenjs";
import { useDeck, THEME } from "../context/DeckContext";
import type { SlideData } from "../types/deck";

export function useExportDeck() {
    const { slides } = useDeck();

    const exportToPPT = async () => {
        if (slides.length === 0) {
            window.alert("No slides to export yet. Generate slides first.");
            return;
        }

        const pres = new pptxgen();
        pres.layout = "LAYOUT_16x9";
        pres.title = "Stratify Strategy Deck";
        pres.author = "Stratify AI";

        slides.forEach((slide) => {
            const pptSlide = pres.addSlide();
            const slideData: SlideData = {
                id: slide.id,
                type: slide.type,
                props: slide.props,
                theme: THEME,
            };

            // 1. DRAW THE BASE LAYOUT
            if (slideData.type !== 'TitleSlide') {
                drawConsultingLayout(pres, pptSlide, slideData);
            }

            // 2. DRAW THE SPECIFIC CONTENT
            try {
                switch (slideData.type) {
                    case 'TitleSlide':
                        drawTitleContent(pres, pptSlide, slideData);
                        break;
                    case 'MarketSizingSlide':
                        drawMarketContent(pres, pptSlide, slideData);
                        break;
                    case 'WaterfallBridge':
                        drawWaterfallContent(pres, pptSlide, slideData);
                        break;
                    case 'HarveyBallMatrix':
                        drawHarveyBallContent(pres, pptSlide, slideData);
                        break;
                    case 'ChevronProcess':
                        drawChevronContent(pres, pptSlide, slideData);
                        break;
                    case 'FinancialImpactSlide':
                        drawFinancialContent(pres, pptSlide, slideData);
                        break;
                    default:
                        console.warn("Unknown slide type for export:", slideData.type);
                        pptSlide.addText("Content not supported for export yet.", { x: 1, y: 3, color: "FF0000" });
                }
            } catch (e) {
                console.error("Failed to export slide:", slideData, e);
                pptSlide.addText("Error exporting slide content.", { x: 1, y: 3, color: "FF0000" });
            }
        });

        try {
            await pres.writeFile({ fileName: "Stratify_Consulting_Deck.pptx" });
        } catch (error) {
            console.error("PPTX export failed:", error);
            window.alert("Export failed. Check the console for details.");
        }
    };

    return { exportToPPT };
}

// --- HELPER FUNCTIONS (The Mapping Logic) ---

function drawConsultingLayout(pres: any, pptSlide: any, data: SlideData) {
    const { actionTitle, kicker, section, phase } = data.props;
    const { secondary } = data.theme;

    const activeSection = phase || section || 'Analysis';
    const sections = ['Context', 'Analysis', 'Strategy', 'Impact'];

    // A. Action Title (Top Left)
    pptSlide.addText(actionTitle || "Untitled Slide", {
        x: 0.5, y: 0.4, w: '80%', h: 0.8,
        fontSize: 24, fontFace: "Arial", bold: true, color: "0F172A", // Slate-900
        valign: "top"
    });

    // B. Tracker (Top Right pills)
    sections.forEach((step: string, i: number) => {
        const isActive = step === activeSection;
        const xPos = 8.5 + (i * 1.2); // Calculate position

        // Pill Shape
        pptSlide.addShape(pres.ShapeType.roundRect, {
            x: xPos, y: 0.4, w: 1.1, h: 0.3,
            fill: { color: isActive ? secondary.replace('#', '') : "F1F5F9" },
            rectRadius: 10,
            line: { color: "FFFFFF", width: 0 }
        });
        // Pill Text
        pptSlide.addText(step, {
            x: xPos, y: 0.4, w: 1.1, h: 0.3,
            fontSize: 9, align: "center", color: isActive ? "FFFFFF" : "94A3B8"
        });
    });

    // C. Divider Line
    pptSlide.addShape(pres.ShapeType.line, {
        x: 0.5, y: 1.3, w: '93%', h: 0,
        line: { color: "E2E8F0", width: 1 }
    });

    // D. The Kicker (Bottom Bar)
    pptSlide.addShape(pres.ShapeType.rect, {
        x: 0, y: 6.8, w: '100%', h: 0.7,
        fill: { color: "F8FAFC" }
    });
    // Top Border for Kicker
    pptSlide.addShape(pres.ShapeType.line, {
        x: 0, y: 6.8, w: '100%', h: 0,
        line: { color: secondary.replace('#', ''), width: 3 }
    });
    // Kicker Text
    pptSlide.addText(`Takeaway: ${kicker || ""}`, {
        x: 0.5, y: 6.9, w: '90%', h: 0.5,
        fontSize: 14, italic: true, color: "334155", fontFace: "Georgia"
    });
}

function drawTitleContent(_pres: any, pptSlide: any, data: SlideData) {
    const title = data.props?.title || "Untitled Deck";
    const subtitle = data.props?.subtitle || data.props?.kicker || "";
    const presenter = data.props?.presenter || data.props?.teamName || "";

    pptSlide.addText(title, {
        x: 0.7, y: 2.2, w: 12, h: 1,
        fontSize: 40, fontFace: "Arial", bold: true, color: "0F172A",
        align: "left"
    });

    if (subtitle) {
        pptSlide.addText(subtitle, {
            x: 0.7, y: 3.4, w: 12, h: 0.6,
            fontSize: 20, fontFace: "Arial", color: "475569",
            align: "left"
        });
    }

    if (presenter) {
        pptSlide.addText(presenter, {
            x: 0.7, y: 5.6, w: 12, h: 0.5,
            fontSize: 16, fontFace: "Arial", color: "64748B",
            align: "left"
        });
    }
}

function drawMarketContent(pres: any, pptSlide: any, data: SlideData) {
    const segments = data.props.segments || [];
    const safeSegments = segments.filter((s: any) => typeof s.value === 'number' && s.name);

    if (safeSegments.length === 0) {
        pptSlide.addText("No market segments available for export.", {
            x: 1, y: 3, w: 8, h: 1, color: "94A3B8", fontSize: 16
        });
        return;
    }

    // Transform to chart data
    const chartData = [
        {
            name: "Market Size",
            labels: safeSegments.map((s: any) => s.name || "Segment"),
            values: safeSegments.map((s: any) => s.value || 0)
        }
    ];

    const primaryColor = data.theme.primary.replace('#', '');
    const secondaryColor = data.theme.secondary.replace('#', '');

    pptSlide.addChart(pres.ChartType.bar, chartData, {
        x: 1.5, y: 2, w: 7, h: 4,
        barDir: 'col',
        chartColors: [primaryColor, secondaryColor],
        showValue: true,
        title: "Market Opportunity (Billions)",
        valAxisMinVal: 0
    });
}

function drawWaterfallContent(pres: any, pptSlide: any, data: SlideData) {
    // Waterfall is tricky in basic PPTX, approximating with bar chart or just listing data for now
    // A true waterfall chart type exists in newer PPT versions, let's try 'bar' with logic or native 'waterfall' if supported (requires newer library version/PPT).
    // PptxGenJS 3.12+ supports 'waterfall' chart type? No, usually done via 'bar' with hidden stack.
    // For simplicity/robustness, we'll map it to a column chart for now, or a simple table if structure is complex.

    const steps = data.props.steps || [];
    if (steps.length === 0) {
        pptSlide.addText("No waterfall steps available for export.", {
            x: 1, y: 3, w: 8, h: 1, color: "94A3B8", fontSize: 16
        });
        return;
    }
    const labels = steps.map((s: any) => s.label);
    const values = steps.map((s: any) => s.value);

    // Using a simple column chart to represent the movements
    const chartData = [{
        name: "Impact",
        labels: labels,
        values: values
    }];

    pptSlide.addChart(pres.ChartType.bar, chartData, {
        x: 1, y: 2, w: 8, h: 4,
        barDir: 'col',
        title: "Profitability Bridge",
        showValue: true,
        chartColors: [data.theme.primary.replace('#', '')]
    });
}

function drawHarveyBallContent(_pres: any, pptSlide: any, data: SlideData) {
    const columns = data.props.columns || [];
    const rows = data.props.rows || [];
    const scores = data.props.scores || [];

    if (columns.length === 0 || rows.length === 0) {
        pptSlide.addText("No matrix data available for export.", {
            x: 1, y: 3, w: 8, h: 1, color: "94A3B8", fontSize: 16
        });
        return;
    }

    // Create a table
    const tableRows = [];

    // Header
    const headerRow: any[] = [
        { text: "Criteria", options: { bold: true, fill: "F1F5F9" } },
        ...columns.map((c: string) => ({ text: c, options: { bold: true, fill: "F1F5F9", align: "center" as const } }))
    ];
    tableRows.push(headerRow);

    // Data
    rows.forEach((row: string, rIdx: number) => {
        const cells: any[] = [
            { text: row, options: { bold: true } }
        ];

        columns.forEach((_: any, cIdx: number) => {
            const score = scores[rIdx]?.[cIdx] ?? 0;
            let symbol = "○"; // Empty
            if (score === 1) symbol = "◐"; // Half
            if (score === 2) symbol = "●"; // Full

            cells.push({ text: symbol, options: { align: "center", fontSize: 18 } });
        });
        tableRows.push(cells);
    });

    pptSlide.addTable(tableRows, { x: 1, y: 2, w: 8, color: "363636" });
}

function drawChevronContent(pres: any, pptSlide: any, data: SlideData) {
    const steps = data.props.steps || [];
    if (steps.length === 0) {
        pptSlide.addText("No process steps available for export.", {
            x: 1, y: 3, w: 8, h: 1, color: "94A3B8", fontSize: 16
        });
        return;
    }
    const width = 8 / steps.length;

    steps.forEach((step: any, i: number) => {
        const xPos = 1 + (i * width);

        pptSlide.addShape(pres.ShapeType.chevron, {
            x: xPos, y: 2.5, w: width - 0.1, h: 1.5,
            fill: { color: i % 2 === 0 ? data.theme.primary.replace('#', '') : data.theme.secondary.replace('#', '') },
            line: { color: "FFFFFF", width: 2 }
        });

        pptSlide.addText(step.title || "", {
            x: xPos, y: 2.6, w: width - 0.1, h: 0.5,
            align: "center", color: "FFFFFF", bold: true, fontSize: 14
        });

        const bulletText = (step.bullets || []).join("\n• ");
        pptSlide.addText(bulletText ? "• " + bulletText : "", {
            x: xPos + 0.2, y: 3.2, w: width - 0.5, h: 0.8,
            color: "FFFFFF", fontSize: 10
        });
    });
}

function drawFinancialContent(pres: any, pptSlide: any, data: SlideData) {
    const financialData = data.props.data || [];
    if (financialData.length === 0) {
        pptSlide.addText("No financial data available for export.", {
            x: 1, y: 3, w: 8, h: 1, color: "94A3B8", fontSize: 16
        });
        return;
    }

    const hasRevenueEbitda = financialData.some((d: any) => d.revenue !== undefined || d.ebitda !== undefined);
    if (hasRevenueEbitda) {
        const labels = financialData.map((d: any) => d.year);
        const revenue = financialData.map((d: any) => d.revenue || 0);
        const ebitda = financialData.map((d: any) => d.ebitda || 0);

        const chartData = [
            { name: "Revenue", labels, values: revenue },
            { name: "EBITDA", labels, values: ebitda }
        ];

        pptSlide.addChart(pres.ChartType.bar, chartData, {
            x: 1, y: 2, w: 8, h: 4,
            barDir: 'col',
            barGrouping: "clustered",
            chartColors: [data.theme.secondary.replace('#', ''), data.theme.primary.replace('#', '')],
            showLegend: true,
            title: "Financial Projections"
        });
        return;
    }

    const labels = financialData.map((d: any) => d.year);
    const values = financialData.map((d: any) => d.value || 0);

    const chartData = [
        { name: "Impact", labels, values }
    ];

    pptSlide.addChart(pres.ChartType.bar, chartData, {
        x: 1, y: 2, w: 8, h: 4,
        barDir: 'col',
        chartColors: [data.theme.primary.replace('#', '')],
        showLegend: false,
        title: "Financial Impact"
    });
}
