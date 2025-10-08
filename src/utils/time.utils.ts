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
