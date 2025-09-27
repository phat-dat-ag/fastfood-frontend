export function formatDateString(dateString?: string): string {
  if (dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN").toString();
  }
  return "Không xác định";
}
