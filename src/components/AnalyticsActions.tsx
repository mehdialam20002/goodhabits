"use client";

import { Download, FileImage, FileJson, FileSpreadsheet, FileText, Printer, Share2, Sparkles, X } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

interface ExportPayload {
  rangeLabel: string;
  averageCompletion: number;
  strongestHabit: string;
  weakestHabit: string;
  streakDays: number;
  topHabits: Array<{ title: string; rate: number; completions: number }>;
  achievements: Array<{ title: string; unlocked: boolean }>;
}

function downloadFile(filename: string, content: BlobPart, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function wrapText(context: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";

  words.forEach((word) => {
    const next = current ? `${current} ${word}` : word;
    if (context.measureText(next).width > maxWidth && current) {
      lines.push(current);
      current = word;
      return;
    }

    current = next;
  });

  if (current) lines.push(current);
  return lines;
}

export default function AnalyticsActions({
  title,
  summary,
  payload,
}: {
  title: string;
  summary: string;
  payload: ExportPayload;
}) {
  const [open, setOpen] = useState(false);

  const textReport = useMemo(
    () =>
      [
        title,
        "",
        `Range: ${payload.rangeLabel}`,
        `Average Completion: ${payload.averageCompletion}%`,
        `Current Streak: ${payload.streakDays} days`,
        `Strongest Habit: ${payload.strongestHabit}`,
        `Needs Attention: ${payload.weakestHabit}`,
        "",
        "Top Habits:",
        ...payload.topHabits.map(
          (habit, index) => `${index + 1}. ${habit.title} - ${habit.rate}% (${habit.completions} completions)`,
        ),
        "",
        "Achievements:",
        ...payload.achievements.map((achievement) =>
          `${achievement.unlocked ? "[Unlocked]" : "[In Progress]"} ${achievement.title}`,
        ),
        "",
        "Summary:",
        summary,
      ].join("\n"),
    [payload, summary, title],
  );

  const csvReport = useMemo(() => {
    const rows = [
      ["section", "label", "value"],
      ["overview", "title", title],
      ["overview", "range", payload.rangeLabel],
      ["overview", "average_completion", `${payload.averageCompletion}`],
      ["overview", "streak_days", `${payload.streakDays}`],
      ["overview", "strongest_habit", payload.strongestHabit],
      ["overview", "weakest_habit", payload.weakestHabit],
      ...payload.topHabits.map((habit, index) => ["top_habit", `${index + 1}_${habit.title}`, `${habit.rate}% | ${habit.completions} completions`]),
      ...payload.achievements.map((achievement) => ["achievement", achievement.title, achievement.unlocked ? "Unlocked" : "In Progress"]),
      ["summary", "summary", summary],
    ];

    return rows
      .map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(","))
      .join("\n");
  }, [payload, summary, title]);

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title, text: summary });
      return;
    }

    await navigator.clipboard.writeText(`${title}\n\n${summary}`);
    toast.success("Summary copied to clipboard.");
  };

  const exportTextReport = () => {
    downloadFile("aura-analytics-report.txt", textReport, "text/plain;charset=utf-8");
    toast.success("Text report downloaded.");
    setOpen(false);
  };

  const exportJsonReport = () => {
    downloadFile("aura-analytics-report.json", JSON.stringify(payload, null, 2), "application/json;charset=utf-8");
    toast.success("JSON report downloaded.");
    setOpen(false);
  };

  const exportCsvReport = () => {
    downloadFile("aura-analytics-report.csv", csvReport, "text/csv;charset=utf-8");
    toast.success("CSV report downloaded.");
    setOpen(false);
  };

  const exportPngReport = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 1600;
    canvas.height = 980;
    const context = canvas.getContext("2d");

    if (!context) {
      toast.error("PNG export is not supported in this browser.");
      return;
    }

    context.fillStyle = "#f5f7fb";
    context.fillRect(0, 0, canvas.width, canvas.height);

    const gradient = context.createLinearGradient(120, 0, 1480, 980);
    gradient.addColorStop(0, "#111827");
    gradient.addColorStop(0.55, "#3730a3");
    gradient.addColorStop(1, "#06b6d4");
    context.fillStyle = gradient;
    context.fillRect(70, 70, 1460, 320);

    context.fillStyle = "rgba(255,255,255,0.12)";
    context.fillRect(940, 118, 510, 220);

    context.fillStyle = "#ffffff";
    context.font = "700 24px Arial";
    context.fillText("AURA ANALYTICS SNAPSHOT", 110, 128);
    context.font = "900 64px Arial";
    context.fillText(title, 110, 210);
    context.font = "500 28px Arial";
    wrapText(context, summary, 760)
      .slice(0, 3)
      .forEach((line, index) => {
        context.fillText(line, 110, 270 + index * 38);
      });

    const stats = [
      ["Range", payload.rangeLabel],
      ["Average", `${payload.averageCompletion}%`],
      ["Strongest", payload.strongestHabit],
      ["Streak", `${payload.streakDays} days`],
    ];

    stats.forEach(([label, value], index) => {
      const x = 110 + (index % 2) * 400;
      const y = 440 + Math.floor(index / 2) * 170;
      context.fillStyle = "#ffffff";
      context.fillRect(x, y, 340, 130);
      context.strokeStyle = "#e5e7eb";
      context.lineWidth = 2;
      context.strokeRect(x, y, 340, 130);
      context.fillStyle = "#6b7280";
      context.font = "700 18px Arial";
      context.fillText(label.toUpperCase(), x + 24, y + 34);
      context.fillStyle = "#111827";
      context.font = "900 34px Arial";
      context.fillText(value, x + 24, y + 86);
    });

    context.fillStyle = "#ffffff";
    context.fillRect(900, 440, 550, 420);
    context.strokeStyle = "#e5e7eb";
    context.strokeRect(900, 440, 550, 420);
    context.fillStyle = "#111827";
    context.font = "900 30px Arial";
    context.fillText("Top Habits", 936, 488);

    payload.topHabits.slice(0, 4).forEach((habit, index) => {
      const y = 536 + index * 78;
      context.fillStyle = index === 0 ? "#eef2ff" : "#f8fafc";
      context.fillRect(936, y, 478, 58);
      context.fillStyle = "#6b7280";
      context.font = "700 16px Arial";
      context.fillText(`#${index + 1}`, 956, y + 24);
      context.fillStyle = "#111827";
      context.font = "700 24px Arial";
      context.fillText(habit.title, 1012, y + 25);
      context.fillStyle = "#4338ca";
      context.font = "900 22px Arial";
      context.fillText(`${habit.rate}%`, 1310, y + 25);
      context.fillStyle = "#6b7280";
      context.font = "600 16px Arial";
      context.fillText(`${habit.completions} completions`, 1012, y + 48);
    });

    context.fillStyle = "#111827";
    context.font = "900 30px Arial";
    context.fillText("Achievements", 110, 790);
    payload.achievements.slice(0, 4).forEach((achievement, index) => {
      const x = 110 + (index % 2) * 370;
      const y = 826 + Math.floor(index / 2) * 68;
      context.fillStyle = achievement.unlocked ? "#ecfdf5" : "#f4f4f5";
      context.fillRect(x, y, 330, 48);
      context.fillStyle = achievement.unlocked ? "#047857" : "#52525b";
      context.font = "700 18px Arial";
      context.fillText(achievement.title, x + 18, y + 30);
    });

    canvas.toBlob((blob) => {
      if (!blob) {
        toast.error("Could not generate PNG export.");
        return;
      }

      downloadFile("aura-analytics-report.png", blob, "image/png");
      toast.success("PNG snapshot downloaded.");
      setOpen(false);
    }, "image/png");
  };

  const printReport = () => {
    const printWindow = window.open("", "_blank", "width=1000,height=760");
    if (!printWindow) {
      toast.error("Popup blocked. Allow popups to print the report.");
      return;
    }

    const topHabitsMarkup = payload.topHabits
      .map(
        (habit, index) =>
          `<div style="padding:14px 16px;border:1px solid #e5e7eb;border-radius:18px;margin-bottom:12px;">
            <div style="font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:.18em;font-weight:700;">#${index + 1}</div>
            <div style="display:flex;justify-content:space-between;gap:16px;margin-top:8px;">
              <div style="font-weight:700;">${habit.title}</div>
              <div style="font-weight:800;color:#4338ca;">${habit.rate}%</div>
            </div>
            <div style="margin-top:4px;color:#6b7280;font-size:13px;">${habit.completions} completions</div>
          </div>`,
      )
      .join("");

    const achievementsMarkup = payload.achievements
      .map(
        (achievement) =>
          `<div style="padding:14px 16px;border:1px solid #e5e7eb;border-radius:18px;margin-bottom:12px;">
            <div style="font-weight:700;">${achievement.title}</div>
            <div style="margin-top:6px;color:${achievement.unlocked ? "#059669" : "#6b7280"};font-size:13px;font-weight:700;">
              ${achievement.unlocked ? "Unlocked" : "In Progress"}
            </div>
          </div>`,
      )
      .join("");

    printWindow.document.write(`
      <html>
        <head>
          <title>${title}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 36px; color: #111827; background: #f8fafc; }
            .hero { background: linear-gradient(135deg,#111827,#312e81); color: white; padding: 28px; border-radius: 28px; margin-bottom: 24px; }
            .grid { display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap: 14px; margin-bottom: 24px; }
            .card { background: white; border: 1px solid #e5e7eb; border-radius: 22px; padding: 18px; }
            .section { background: white; border: 1px solid #e5e7eb; border-radius: 24px; padding: 22px; margin-bottom: 20px; }
            .muted { color: #6b7280; font-size: 13px; }
            h1,h2,h3,p { margin: 0; }
            @media print { body { background: white; padding: 18px; } }
          </style>
        </head>
        <body>
          <div class="hero">
            <div style="font-size:12px;letter-spacing:.22em;text-transform:uppercase;opacity:.7;font-weight:700;">Aura Analytics Export</div>
            <h1 style="font-size:34px;margin-top:10px;">${title}</h1>
            <p style="margin-top:12px;line-height:1.6;color:rgba(255,255,255,.82);">${summary}</p>
          </div>

          <div class="grid">
            <div class="card"><div class="muted">Range</div><div style="font-weight:800;margin-top:8px;">${payload.rangeLabel}</div></div>
            <div class="card"><div class="muted">Average</div><div style="font-weight:800;margin-top:8px;">${payload.averageCompletion}%</div></div>
            <div class="card"><div class="muted">Strongest</div><div style="font-weight:800;margin-top:8px;">${payload.strongestHabit}</div></div>
            <div class="card"><div class="muted">Streak</div><div style="font-weight:800;margin-top:8px;">${payload.streakDays} days</div></div>
          </div>

          <div class="section">
            <h2 style="font-size:22px;margin-bottom:14px;">Top Habits</h2>
            ${topHabitsMarkup}
          </div>

          <div class="section">
            <h2 style="font-size:22px;margin-bottom:14px;">Achievements</h2>
            ${achievementsMarkup}
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    setOpen(false);
  };

  const exportCards = [
    {
      title: "Text Report",
      desc: "Clean summary for mentors, clients, or personal archives.",
      icon: FileText,
      action: exportTextReport,
      accent: "from-indigo-500 to-cyan-400",
    },
    {
      title: "CSV Sheet",
      desc: "Spreadsheet-ready export for sorting, formulas, and review logs.",
      icon: FileSpreadsheet,
      action: exportCsvReport,
      accent: "from-emerald-500 to-teal-400",
    },
    {
      title: "PNG Snapshot",
      desc: "Branded shareable image with your current analytics snapshot.",
      icon: FileImage,
      action: exportPngReport,
      accent: "from-fuchsia-500 to-indigo-500",
    },
    {
      title: "Raw JSON",
      desc: "Structured export for engineering, backup, or integrations.",
      icon: FileJson,
      action: exportJsonReport,
      accent: "from-zinc-900 to-zinc-700",
    },
    {
      title: "Print Layout",
      desc: "Polished printable review with cards and strong hierarchy.",
      icon: Printer,
      action: printReport,
      accent: "from-amber-500 to-orange-400",
    },
  ];

  return (
    <>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleShare}
          className="rounded-2xl border border-zinc-200 dark:border-zinc-800 px-4 py-3 text-xs font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-indigo-600 dark:hover:text-cyan-400"
        >
          <span className="flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            Share
          </span>
        </button>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-2xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 px-4 py-3 text-xs font-black uppercase tracking-[0.2em] shadow-lg shadow-zinc-900/10"
        >
          <span className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Studio
          </span>
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-zinc-950/55 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-6xl rounded-[2rem] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-2xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="p-6 md:p-8 border-b lg:border-b-0 lg:border-r border-zinc-200 dark:border-zinc-800">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 text-indigo-600 dark:bg-cyan-500/10 dark:text-cyan-300 px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em]">
                      <Sparkles className="h-3.5 w-3.5" />
                      Export Studio
                    </div>
                    <h3 className="mt-4 text-3xl font-black tracking-tight text-zinc-950 dark:text-zinc-50">
                      Export your analytics beautifully
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-zinc-500 max-w-xl">
                      Choose the format based on where the report is going: quick sharing, printable review, spreadsheet work, or a clean visual snapshot.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-3 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {exportCards.map((card) => (
                    <button
                      key={card.title}
                      type="button"
                      onClick={card.action}
                      className="group rounded-[1.75rem] border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 p-4 text-left transition hover:-translate-y-1 hover:shadow-xl"
                    >
                      <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${card.accent} text-white flex items-center justify-center shadow-lg`}>
                        <card.icon className="h-5 w-5" />
                      </div>
                      <h4 className="mt-4 text-base font-black tracking-tight text-zinc-900 dark:text-zinc-100">
                        {card.title}
                      </h4>
                      <p className="mt-2 text-sm leading-relaxed text-zinc-500">{card.desc}</p>
                      <p className="mt-4 text-[10px] font-black uppercase tracking-[0.22em] text-indigo-600 dark:text-cyan-400">
                        Export now
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6 md:p-8 bg-zinc-50/80 dark:bg-zinc-900/40">
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-zinc-400">Preview</p>
                <div className="mt-4 rounded-[1.75rem] bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-5 shadow-sm">
                  <h4 className="text-xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">{title}</h4>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-500">{summary}</p>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    {[
                      ["Range", payload.rangeLabel],
                      ["Average", `${payload.averageCompletion}%`],
                      ["Strongest", payload.strongestHabit],
                      ["Streak", `${payload.streakDays} days`],
                    ].map(([label, value]) => (
                      <div key={label} className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-3">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">{label}</p>
                        <p className="mt-2 text-sm font-black text-zinc-900 dark:text-zinc-100">{value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-3">Top Habits Snapshot</p>
                    <div className="space-y-3">
                      {payload.topHabits.slice(0, 3).map((habit, index) => (
                        <div key={habit.title} className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-3">
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">#{index + 1}</p>
                              <p className="mt-1 text-sm font-bold text-zinc-900 dark:text-zinc-100">{habit.title}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-black text-indigo-600 dark:text-cyan-400">{habit.rate}%</p>
                              <p className="text-[11px] text-zinc-500">{habit.completions} completions</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
