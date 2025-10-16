export function formatDateString(dateString?: string): string {
  if (dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN").toString();
  }
  return "Không xác định";
}

export function formatDateTimeString(dateTimeString: string): string {
  if (!dateTimeString) return "Không xác định";
  const date = new Date(dateTimeString);
  return date
    .toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
    .replace(",", "");
}

export function toVietnamTimezoneISOString(date: Date, isEndOfDay = false) {
  const result = new Date(date);
  if (isEndOfDay) {
    result.setHours(23, 59, 59, 999);
  } else {
    result.setHours(0, 0, 0, 0);
  }

  const offsetMs = result.getTimezoneOffset() * 60000;
  return new Date(result.getTime() - offsetMs).toISOString();
}
