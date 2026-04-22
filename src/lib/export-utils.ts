import * as XLSX from "xlsx";

export type DateFilter = "today" | "this-month" | "custom";

export function filterByDate<T extends { date?: string; joined?: string }>(
  data: T[],
  filter: DateFilter,
  customDate?: string
): T[] {
  const now = new Date();
  const todayStr = now.toISOString().split("T")[0];
  const yearMonth = todayStr.substring(0, 7);

  return data.filter((item) => {
    const d = item.date || item.joined || "";
    if (filter === "today") return d === todayStr;
    if (filter === "this-month") return d.startsWith(yearMonth);
    if (filter === "custom" && customDate) {
      if (customDate.length === 7) return d.startsWith(customDate);
      return d === customDate;
    }
    return true;
  });
}

export function exportToExcel(data: Record<string, unknown>[], filename: string) {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Data");
  XLSX.writeFile(wb, `${filename}.xlsx`);
}