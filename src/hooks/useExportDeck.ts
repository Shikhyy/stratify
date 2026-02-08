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
                    case 'StrategicRoadmap':
                        drawStrategicRoadmapContent(pres, pptSlide, slideData);
                        break;
                    case 'CompetitorBenchmarking':
                        drawCompetitorBenchmarkingContent(pptSlide, slideData);
                        break;
                    case 'UnitEconomics':
                        drawUnitEconomicsContent(pres, pptSlide, slideData);
                        break;
                    case 'FinancialProjections':
                        drawFinancialProjectionsContent(pres, pptSlide, slideData);
                        break;
                    case 'MarketWaterfall':
                        drawMarketWaterfallContent(pres, pptSlide, slideData);
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
    const { primary, secondary } = data.theme;

    const activeSection = phase || section || 'Analysis';
    const sections = ['Context', 'Analysis', 'Strategy', 'Impact'];

    // A. Action Title (Top Left)
    pptSlide.addText(actionTitle || "Untitled Slide", {
        x: 0.5, y: 0.4, w: '80%', h: 0.8,
        fontSize: 28, fontFace: "Calibri", bold: true, color: "1F2933",
        valign: "top"
    });

    // B. Tracker (Top Right pills)
    sections.forEach((step: string, i: number) => {
        const isActive = step === activeSection;
        const xPos = 8.5 + (i * 1.2); // Calculate position

        // Pill Shape
        pptSlide.addShape(pres.ShapeType.roundRect, {
            x: xPos, y: 0.4, w: 1.1, h: 0.3,
            fill: { color: isActive ? primary.replace('#', '') : "F1F5F9" },
            rectRadius: 5,
            line: { color: "FFFFFF", width: 0 }
        });
        // Pill Text
        pptSlide.addText(step, {
            x: xPos, y: 0.4, w: 1.1, h: 0.3,
            fontSize: 9, align: "center", color: isActive ? "FFFFFF" : "94A3B8", fontFace: "Calibri"
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
    const steps = data.props.steps || [];
    if (steps.length === 0) {
        pptSlide.addText("No waterfall steps available for export.", {
            x: 1, y: 3, w: 8, h: 1, color: "94A3B8", fontSize: 16
        });
        return;
    }

    // Calculate cumulative values for proper waterfall visualization
    let cumulative = 0;
    const waterfallData: any[] = [];
    
    steps.forEach((step: any, idx: number) => {
        const value = step.value || 0;
        const type = step.type || 'plus';
        
        if (type === 'total') {
            cumulative = value;
            waterfallData.push({ 
                label: step.label, 
                value: value, 
                base: 0,
                type: 'total',
                idx 
            });
        } else if (type === 'subtotal') {
            waterfallData.push({ 
                label: step.label, 
                value: cumulative, 
                base: 0,
                type: 'subtotal',
                idx 
            });
        } else {
            const prevCumulative = cumulative;
            cumulative += value;
            waterfallData.push({ 
                label: step.label, 
                value: Math.abs(value),
                base: value >= 0 ? prevCumulative : cumulative,
                type: type,
                idx
            });
        }
    });

    // Draw improved waterfall with rectangles
    const chartX = 1.5;
    const chartY = 2;
    const chartWidth = 7;
    const chartHeight = 3.5;
    const barWidth = chartWidth / Math.max(steps.length, 1);
    const maxValue = Math.max(...waterfallData.map((d: any) => 
        (d.type === 'total' || d.type === 'subtotal') ? d.value : d.base + d.value
    ));
    const scale = maxValue > 0 ? chartHeight / maxValue : 0;

    waterfallData.forEach((item: any) => {
        const xPos = chartX + (item.idx * barWidth);
        const color = item.type === 'minus' 
            ? 'FF6B6B' 
            : item.type === 'total' || item.type === 'subtotal'
            ? data.theme.primary.replace('#', '')
            : data.theme.secondary.replace('#', '');

        const barHeight = item.value * scale;
        const baseHeight = item.base * scale;
        const yPos = chartY + chartHeight - baseHeight - barHeight;

        // Draw floating connector line from previous bar (if not total)
        if (item.idx > 0 && item.type !== 'total' && item.type !== 'subtotal') {
            const prevItem = waterfallData[item.idx - 1];
            const prevTop = chartY + chartHeight - (prevItem.type === 'total' || prevItem.type === 'subtotal' 
                ? prevItem.value * scale 
                : (prevItem.base + prevItem.value) * scale);
            
            pptSlide.addShape(pres.ShapeType.line, {
                x: xPos - barWidth + 0.05,
                y: prevTop,
                w: barWidth - 0.1,
                h: 0,
                line: { color: "CBD5E1", width: 1, dashType: "dash" }
            });
        }

        // Draw bar
        pptSlide.addShape(pres.ShapeType.rect, {
            x: xPos + 0.05,
            y: yPos,
            w: barWidth - 0.15,
            h: barHeight,
            fill: { color: color },
            line: { color: "FFFFFF", width: 1 }
        });

        // Label
        pptSlide.addText(item.label || "", {
            x: xPos,
            y: chartY + chartHeight + 0.1,
            w: barWidth - 0.05,
            h: 0.4,
            fontSize: 9,
            align: "center",
            color: "334155",
            valign: "top"
        });

        // Value text on bar
        const displayValue = steps[item.idx]?.value || 0;
        pptSlide.addText(displayValue > 0 ? `+${displayValue}` : String(displayValue), {
            x: xPos + 0.05,
            y: yPos - 0.25,
            w: barWidth - 0.15,
            h: 0.2,
            fontSize: 10,
            align: "center",
            bold: true,
            color: "1F2933"
        });
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

function drawCompetitorBenchmarkingContent(pptSlide: any, data: SlideData) {
    const columns = data.props.competitors || [];
    const rows = data.props.criteria || [];
    const scores = data.props.scores || [];

    if (columns.length === 0 || rows.length === 0) {
        pptSlide.addText("No benchmark data available for export.", {
            x: 1, y: 3, w: 8, h: 1, color: "94A3B8", fontSize: 16
        });
        return;
    }

    const tableRows = [];

    const headerRow: any[] = [
        { text: "Criteria", options: { bold: true, fill: "F1F5F9" } },
        ...columns.map((c: string) => ({ text: c, options: { bold: true, fill: "F1F5F9", align: "center" as const } }))
    ];
    tableRows.push(headerRow);

    rows.forEach((row: string, rIdx: number) => {
        const cells: any[] = [
            { text: row, options: { bold: true } }
        ];

        columns.forEach((_: any, cIdx: number) => {
            const score = scores[rIdx]?.[cIdx] ?? 0;
            let symbol = "○";
            if (score === 1) symbol = "◐";
            if (score >= 2) symbol = "●";

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

function drawStrategicRoadmapContent(pres: any, pptSlide: any, data: SlideData) {
    const phases = data.props.phases || [];
    if (phases.length === 0) {
        pptSlide.addText("No roadmap phases available for export.", {
            x: 1, y: 3, w: 8, h: 1, color: "94A3B8", fontSize: 16
        });
        return;
    }

    const width = 8 / phases.length;

    phases.forEach((phase: any, i: number) => {
        const xPos = 1 + (i * width);

        pptSlide.addShape(pres.ShapeType.chevron, {
            x: xPos, y: 2.3, w: width - 0.1, h: 2,
            fill: { color: i % 2 === 0 ? data.theme.primary.replace('#', '') : data.theme.secondary.replace('#', '') },
            line: { color: "FFFFFF", width: 2 }
        });

        pptSlide.addText(phase.phase || "Phase", {
            x: xPos, y: 2.35, w: width - 0.1, h: 0.4,
            align: "center", color: "FFFFFF", bold: true, fontSize: 14
        });

        pptSlide.addText(phase.duration || "", {
            x: xPos, y: 2.75, w: width - 0.1, h: 0.3,
            align: "center", color: "FFFFFF", fontSize: 10
        });

        const bulletText = (phase.milestones || []).slice(0, 3).join("\n• ");
        pptSlide.addText(bulletText ? "• " + bulletText : "", {
            x: xPos + 0.2, y: 3.15, w: width - 0.5, h: 0.9,
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
function drawUnitEconomicsContent(pres: any, pptSlide: any, data: SlideData) {
    const { cac, ltv, ratio } = data.props;
    
    if (!cac || !ltv) {
        pptSlide.addText("No unit economics data available for export.", {
            x: 1, y: 3, w: 8, h: 1, color: "94A3B8", fontSize: 16
        });
        return;
    }

    // Title
    pptSlide.addText("Unit Economics", {
        x: 0.5, y: 1.5, w: 4, h: 0.5,
        fontSize: 24, bold: true, color: data.theme.secondary.replace('#', '')
    });

    // CAC Circle
    pptSlide.addShape(pres.ShapeType.ellipse, {
        x: 1.5, y: 2.5, w: 2, h: 2,
        fill: { color: "F1F5F9" },
        line: { color: data.theme.secondary.replace('#', ''), width: 3 }
    });
    pptSlide.addText("CAC", {
        x: 1.5, y: 2.7, w: 2, h: 0.3,
        fontSize: 12, align: "center", color: "64748B"
    });
    pptSlide.addText(`$${cac}`, {
        x: 1.5, y: 3.1, w: 2, h: 0.5,
        fontSize: 28, align: "center", bold: true, color: "1F2933"
    });

    // Arrow
    pptSlide.addShape(pres.ShapeType.rightArrow, {
        x: 3.7, y: 3.3, w: 1, h: 0.4,
        fill: { color: "CBD5E1" }
    });

    // LTV Circle
    pptSlide.addShape(pres.ShapeType.ellipse, {
        x: 5, y: 2.5, w: 2, h: 2,
        fill: { color: data.theme.primary.replace('#', '') },
        line: { color: "FFFFFF", width: 2 }
    });
    pptSlide.addText("LTV", {
        x: 5, y: 2.7, w: 2, h: 0.3,
        fontSize: 12, align: "center", color: "FFFFFF"
    });
    pptSlide.addText(`$${ltv}`, {
        x: 5, y: 3.1, w: 2, h: 0.5,
        fontSize: 28, align: "center", bold: true, color: "FFFFFF"
    });

    // Ratio display
    const isHealthy = ratio >= 3;
    pptSlide.addText(`LTV:CAC Ratio: ${ratio.toFixed(1)}x`, {
        x: 2, y: 5, w: 5, h: 0.5,
        fontSize: 18, align: "center", bold: true,
        color: isHealthy ? "10B981" : "EF4444"
    });
    pptSlide.addText(isHealthy ? "✓ Healthy" : "⚠ Below Target", {
        x: 2, y: 5.5, w: 5, h: 0.3,
        fontSize: 14, align: "center",
        color: isHealthy ? "10B981" : "EF4444"
    });
}

function drawFinancialProjectionsContent(pres: any, pptSlide: any, data: SlideData) {
    const { years, revenue, ebitda } = data.props;
    
    if (!years || !revenue || !ebitda || years.length === 0) {
        pptSlide.addText("No financial projections data available for export.", {
            x: 1, y: 3, w: 8, h: 1, color: "94A3B8", fontSize: 16
        });
        return;
    }

    const chartData = [
        { name: "Revenue ($M)", labels: years, values: revenue },
        { name: "EBITDA Margin (%)", labels: years, values: ebitda }
    ];

    pptSlide.addChart(pres.ChartType.bar, chartData, {
        x: 1, y: 2, w: 8, h: 4,
        barDir: 'col',
        barGrouping: "clustered",
        chartColors: [data.theme.primary.replace('#', ''), data.theme.secondary.replace('#', '')],
        showLegend: true,
        showValue: true,
        title: "Financial Projections (5-Year)"
    });
}

function drawMarketWaterfallContent(pres: any, pptSlide: any, data: SlideData) {
    const { tam, sam, som, currency } = data.props;
    
    if (!tam || !sam || !som) {
        pptSlide.addText("No market waterfall data available for export.", {
            x: 1, y: 3, w: 8, h: 1, color: "94A3B8", fontSize: 16
        });
        return;
    }

    // Title
    pptSlide.addText("Market Opportunity", {
        x: 0.5, y: 1.5, w: 8, h: 0.5,
        fontSize: 24, bold: true, color: data.theme.secondary.replace('#', '')
    });

    const markets = [
        { label: "TAM", value: tam, color: data.theme.secondary.replace('#', ''), sub: "Total Addressable" },
        { label: "SAM", value: sam, color: data.theme.primary.replace('#', ''), sub: "Serviceable Available" },
        { label: "SOM", value: som, color: "10B981", sub: "Serviceable Obtainable" }
    ];

    const maxValue = tam;
    const chartHeight = 3.5;
    const barWidth = 1.5;
    const spacing = 2;

    markets.forEach((market, idx) => {
        const xPos = 2 + (idx * spacing);
        const heightRatio = market.value / maxValue;
        const barHeight = chartHeight * heightRatio;
        const yPos = 6 - barHeight;

        // Bar
        pptSlide.addShape(pres.ShapeType.rect, {
            x: xPos, y: yPos, w: barWidth, h: barHeight,
            fill: { color: market.color },
            line: { color: "FFFFFF", width: 2 }
        });

        // Label
        pptSlide.addText(market.label, {
            x: xPos, y: 6.2, w: barWidth, h: 0.3,
            fontSize: 14, align: "center", bold: true, color: "1F2933"
        });

        // Sub-label
        pptSlide.addText(market.sub, {
            x: xPos, y: 6.5, w: barWidth, h: 0.3,
            fontSize: 10, align: "center", color: "64748B"
        });

        // Value on top
        const formattedValue = `${currency || '$'}${market.value}M`;
        pptSlide.addText(formattedValue, {
            x: xPos, y: yPos - 0.35, w: barWidth, h: 0.3,
            fontSize: 12, align: "center", bold: true, color: "1F2933"
        });
    });
}