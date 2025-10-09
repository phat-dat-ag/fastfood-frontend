export const formatCurrencyVND = (value: string) => {
  const number = Number(value);
  if (isNaN(number)) return "0 đ";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  }).format(number);
};
