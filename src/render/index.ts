import type { CommandResult, TerminalConfig } from "../types";

import { getTheme } from "../themes";
import { renderTerminal } from "./terminal";
import { renderText, renderTypingText } from "./text";
import { renderCursor } from "./cursor";
import { renderReposTable } from "./repos";
import { renderDonut, renderProgressRing } from "./circle-chart";
import { renderHeatmap } from "./heatmap";
import { renderMetricCards } from "./metric-cards";
import { renderLangPills } from "./lang-pills";
import { barsHeight, renderBars } from "./bar";
import { renderSegments } from "./segments";
import { animatedNumber } from "./animated-number";
import { renderProjectPills } from "./project-pills";
import { renderLangBlocks } from "./lang-blocks";

const SPEED_TO_STEP_MS: Record<TerminalConfig["speed"], number> = {
  slow: 80,
  normal: 40,
  fast: 15,
  instant: 0,
};

interface TypingState {
  currentStep: number;
}

export function renderSvg(results: CommandResult[], config: TerminalConfig): string {
  const theme = getTheme(config.theme);

  const width = config.width;
  const height = config.height;

  const state: TypingState = { currentStep: 0 };
  const stepMs = config.noanimation ? 0 : SPEED_TO_STEP_MS[config.speed];
  const animEnabled = stepMs > 0;

  let y = 75;
  let content = "";

  for (const result of results) {
    content += emitText(result.title, 28, y, theme.muted, 13, state, stepMs, false, "600");
    y += 30;

    const animState = { enabled: animEnabled, stepMs, startStep: state.currentStep };

    if (result.metrics && result.metrics.length > 0) {
      const rendered = renderMetricCards(
        result.metrics,
        y,
        theme.muted,
        theme.foreground,
        theme.border,
        animState,
      );
      content += rendered.svg;
      state.currentStep = rendered.endStep;
      y += rendered.height + 10;
    } else if (result.langBlocks && result.langBlocks.length > 0) {
      const rendered = renderLangBlocks(
        result.langBlocks,
        y,
        theme.accent,
        theme.muted,
        theme.foreground,
        animState,
      );
      content += rendered.svg;
      state.currentStep = rendered.endStep;
      y += rendered.height + 10;
    } else if (result.langPills && result.langPills.length > 0) {
      const rendered = renderLangPills(
        result.langPills,
        y,
        theme.muted,
        theme.foreground,
        animState,
      );
      content += rendered.svg;
      state.currentStep = rendered.endStep;
      y += rendered.height + 10;
    } else if (result.donut && result.donut.slices.length > 0) {
      const donutCx = 130;
      const donutCy = y + 65;
      const layout = result.donut.layout || "horizontal";

      const donut = renderDonut(
        result.donut.slices,
        donutCx,
        donutCy,
        55,
        32,
        {
          centerLabel: result.donut.centerLabel,
          centerValue: result.donut.centerValue,
          centerSubLabel: result.donut.centerSubLabel,
          showLegend: layout === "horizontal",
        },
        animState,
      );
      content += donut.svg;
      state.currentStep = donut.endStep;
      y += donut.height + 10;
    } else if (result.rings && result.rings.length > 0) {
      const ringSize = 50;
      const ringGap = 18;
      const totalRingsWidth = result.rings.length * (ringSize * 2 + ringGap) - ringGap;
      let ringX = Math.max(28, (width - totalRingsWidth) / 2);
      const ringY = y + ringSize;

      for (const ring of result.rings) {
        const rendered = renderProgressRing(
          ringX + ringSize,
          ringY,
          ringSize - 8,
          ring.value,
          ring.max,
          ring.color,
          theme.muted,
          ring.centerText,
          { enabled: animEnabled, stepMs, startStep: state.currentStep },
        );
        content += rendered.svg;
        state.currentStep = rendered.endStep;

        content += `
          <text
            x="${ringX + ringSize}"
            y="${ringY + ringSize + 16}"
            fill="${theme.muted}"
            font-family="Courier New, monospace"
            font-size="10"
            text-anchor="middle"
            letter-spacing="1"
          >
            ${ring.label.toUpperCase()}
          </text>
        `;
        ringX += ringSize * 2 + ringGap;
      }

      y += ringSize * 2 + 28;
    } else if (result.heatmap && result.heatmap.length > 0) {
      const cellSize = 12;
      const cellGap = 3;
      const maxValue = Math.max(...result.heatmap.flat(), 1);

      const heat = renderHeatmap(
        result.heatmap,
        28,
        y,
        cellSize,
        cellGap,
        maxValue,
        theme.accent,
        theme.muted,
        animState,
      );
      content += heat.svg;
      state.currentStep = heat.endStep;
      y += heat.height + 10;
    } else if (result.segments && result.segments.length > 0) {
      const rendered = renderSegments(result.segments, y);
      content += rendered.svg;
      y += rendered.height;
    } else if (result.bars && result.bars.length > 0) {
      content += renderBars(result.bars, y, theme.muted);
      y += barsHeight(result.bars);
    } else if (result.repos && result.repos.length > 0) {
      const rendered = renderReposTable(
        result.repos,
        y,
        theme.muted,
        theme.foreground,
        theme.accent,
        theme.border,
      );
      content += rendered.svg;
      y += rendered.height;
    } else if (result.rows && result.rows.length > 0) {
      for (const row of result.rows) {
        const labelCell = row.cells[0];
        const valueCell = row.cells[1];

        const labelText = labelCell?.text ?? "";
        const labelWidth = labelText.length * 8 + 16;

        content += emitText(
          labelText,
          28,
          y,
          labelCell?.color ?? theme.muted,
          13,
          state,
          stepMs,
          false,
        );

        const valueX = 28 + labelWidth;
        const valueText = valueCell?.text ?? "0";
        const valueColor = valueCell?.color ?? theme.accent;

        if (valueCell?.animated) {
          const beginSec = stepMs > 0 ? (state.currentStep * stepMs) / 1000 : 0;
          content += animatedNumber(
            Number(valueText),
            valueX,
            y,
            valueColor,
            { beginSec, fontSize: 13, fontWeight: "700", enabled: animEnabled },
          );
          state.currentStep += 1;
        } else {
          content += emitText(
            valueText,
            valueX,
            y,
            valueColor,
            13,
            state,
            stepMs,
            false,
            "700",
          );
        }

        y += 22;
      }
    } else if (result.projects && result.projects.length > 0) {
      const rendered = renderProjectPills(
        result.projects,
        y,
        { enabled: animEnabled, stepMs, startStep: state.currentStep },
      );
      content += rendered.svg;
      state.currentStep = rendered.endStep;
      y += rendered.height;
    } else {
      const highlights = new Set(result.highlights ?? []);
      result.lines.forEach((line, index) => {
        const color = highlights.has(index) ? theme.accent : theme.foreground;
        const weight = highlights.has(index) ? "600" : undefined;
        content += emitText(line, 28, y, color, 13, state, stepMs, false, weight);
        y += 21;
      });
    }

    if (
      result.lines &&
      (result.metrics ||
        result.langBlocks ||
        result.langPills ||
        result.donut ||
        result.rings ||
        result.heatmap ||
        result.repos)
    ) {
      y += 8;
      for (const line of result.lines) {
        content += emitText(line, 28, y, theme.muted, 11, state, stepMs, true);
        y += 18;
      }
    }

    y += 24;
  }

  content += renderCursor(28, y, theme.accent);

  return `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="${width}"
      height="${height}"
      viewBox="0 0 ${width} ${height}"
    >

      ${renderTerminal(width, height, theme)}

      ${content}

    </svg>
  `;
}

function emitText(
  text: string,
  x: number,
  y: number,
  color: string,
  fontSize: number,
  state: TypingState,
  stepMs: number,
  forceStatic: boolean,
  fontWeight?: string,
): string {
  if (stepMs === 0 || forceStatic) {
    return renderText(text, x, y, color, fontSize, { fontWeight });
  }
  const startStep = state.currentStep;
  const out = renderTypingText(text, x, y, color, fontSize, {
    startStep,
    stepDurationMs: stepMs,
    fontWeight,
  });
  state.currentStep += text.length;
  return out;
}
