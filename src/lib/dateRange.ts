export type Preset = "7d" | "30d" | "90d" | "all";

export function getDateRange(preset: Preset, now = new Date()) {
  const end = new Date(now);
  end.setHours(23, 59, 59, 999);

  if (preset === "all") {
    return { from: "1970-01-01T00:00:00.000Z", to: end.toISOString() };
  }

  const days = preset === "7d" ? 7 : preset === "30d" ? 30 : 90;
  const start = new Date(end);
  start.setDate(end.getDate() - (days - 1));
  start.setHours(0, 0, 0, 0);

  return { from: start.toISOString(), to: end.toISOString() };
}
