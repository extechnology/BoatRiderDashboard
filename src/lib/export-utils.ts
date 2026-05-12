import * as XLSX from "xlsx";

export type DateFilter = "today" | "this-month" | "custom";

export function filterByDate<T>(
  data: T[],
  filter: DateFilter,
  dateField: string = "date",
  customDate?: string
): T[] {
  const now = new Date();
  const todayStr = now.toLocaleDateString('en-CA'); // YYYY-MM-DD
  const yearMonth = todayStr.substring(0, 7);

  return data.filter((item: any) => {
    // Try provided dateField or common defaults
    const rawValue = item[dateField] || item.date || item.joined || item.created || item.created_at || item.date_joined;
    if (!rawValue) return true;
    
    try {
      const dateObj = new Date(rawValue);
      const d = dateObj.toLocaleDateString('en-CA'); // YYYY-MM-DD in local time
      
      if (filter === "today") return d === todayStr;
      if (filter === "this-month") return d.startsWith(yearMonth);
      if (filter === "custom" && customDate) {
        if (customDate.length === 7) return d.startsWith(customDate);
        return d === customDate;
      }
    } catch (e) {
      return true;
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