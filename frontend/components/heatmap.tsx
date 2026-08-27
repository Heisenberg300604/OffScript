import type { ActivityDay } from "@/lib/queries/challenges";

const WEEKDAY_LABELS = ["Mon", "", "Wed", "", "Fri", "", ""];

function toISO(date: Date) {
  return date.toISOString().slice(0, 10);
}

function intensity(count: number): 0 | 1 | 2 | 3 | 4 {
  if (count <= 0) return 0;
  if (count === 1) return 1;
  if (count === 2) return 2;
  if (count === 3) return 3;
  return 4;
}

/**
 * GitHub-style contribution grid built from real completed challenges.
 *
 * Columns are weeks, rows are weekdays (Mon first). `endDate` is the user's
 * local today, so the final column is the current week.
 */
export function Heatmap({
  activity,
  endDate,
  weeks = 26,
}: {
  activity: ActivityDay[];
  endDate: string;
  weeks?: number;
}) {
  const counts = new Map(activity.map((day) => [day.date, day.count]));

  const [y, m, d] = endDate.split("-").map(Number);
  const end = new Date(Date.UTC(y, m - 1, d));

  // Walk back to the Monday of the final week so columns line up.
  const dayOfWeek = (end.getUTCDay() + 6) % 7; // Mon=0 … Sun=6
  const lastMonday = new Date(end);
  lastMonday.setUTCDate(lastMonday.getUTCDate() - dayOfWeek);

  const start = new Date(lastMonday);
  start.setUTCDate(start.getUTCDate() - (weeks - 1) * 7);

  const columns: { date: string; count: number; future: boolean }[][] = [];
  const cursor = new Date(start);

  for (let week = 0; week < weeks; week += 1) {
    const column: { date: string; count: number; future: boolean }[] = [];
    for (let day = 0; day < 7; day += 1) {
      const iso = toISO(cursor);
      column.push({
        date: iso,
        count: counts.get(iso) ?? 0,
        future: iso > endDate,
      });
      cursor.setUTCDate(cursor.getUTCDate() + 1);
    }
    columns.push(column);
  }

  const monthLabels = columns.map((column, index) => {
    const first = new Date(`${column[0].date}T00:00:00Z`);
    const previous =
      index > 0 ? new Date(`${columns[index - 1][0].date}T00:00:00Z`) : null;
    const changed = !previous || first.getUTCMonth() !== previous.getUTCMonth();
    return changed
      ? first.toLocaleDateString("en-US", { month: "short", timeZone: "UTC" })
      : "";
  });

  return (
    <div className="overflow-x-auto">
      <div className="inline-flex min-w-full gap-2">
        <div className="flex shrink-0 flex-col gap-[3px] pt-[18px]">
          {WEEKDAY_LABELS.map((label, index) => (
            <span
              key={index}
              className="h-[13px] text-[10px] leading-[13px] text-muted-foreground"
            >
              {label}
            </span>
          ))}
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex gap-[3px]">
            {monthLabels.map((label, index) => (
              <span
                key={index}
                className="w-[13px] text-[10px] text-muted-foreground"
              >
                {label}
              </span>
            ))}
          </div>

          <div className="flex gap-[3px]">
            {columns.map((column, columnIndex) => (
              <div key={columnIndex} className="flex flex-col gap-[3px]">
                {column.map((cell) => (
                  <span
                    key={cell.date}
                    data-level={cell.future ? undefined : intensity(cell.count)}
                    title={
                      cell.future
                        ? ""
                        : `${cell.count} ${cell.count === 1 ? "session" : "sessions"} on ${cell.date}`
                    }
                    className={`heatmap-cell${cell.future ? " opacity-0" : ""}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-1.5 text-[11px] text-muted-foreground">
        <span>Less</span>
        <span className="heatmap-cell" data-level={0} />
        <span className="heatmap-cell" data-level={1} />
        <span className="heatmap-cell" data-level={2} />
        <span className="heatmap-cell" data-level={3} />
        <span className="heatmap-cell" data-level={4} />
        <span>More</span>
      </div>
    </div>
  );
}
