// "    Nguyễn       Đạt" => "Nguyễn Đạt"
export function nomarlizeSpaces(str: string): string {
  return str.trim().replace(/\s+/g, " ");
}
