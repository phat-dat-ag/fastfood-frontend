import { ElMessageBox } from "element-plus";

export const openConfirmDeleteMessage = async (
  message: string,
  title: string = "Xác nhận xóa"
): Promise<boolean> => {
  return ElMessageBox.confirm(message, title, {
    confirmButtonText: "Đồng ý",
    cancelButtonText: "Hủy",
    type: "warning",
  })
    .then(() => true)
    .catch(() => false);
};

export const openCancelOrderConfirm = async (): Promise<string | null> => {
  try {
    const reason = await ElMessageBox.prompt(
      "Vui lòng nhập lý do hủy đơn hàng:",
      "Xác nhận hủy đơn hàng",
      {
        confirmButtonText: "Xác nhận",
        cancelButtonText: "Hủy",
        type: "warning",
        inputPlaceholder: "Nhập lý do...",
        inputValidator: (value: string) => {
          if (!value || !value.trim()) {
            return "Vui lòng nhập lý do hủy đơn!";
          }
          if (value.trim().length > 100) {
            return "Lý do không được vượt quá 100 ký tự!";
          }
          return true;
        },
      }
    );
    return reason.value.trim();
  } catch {
    return null;
  }
};
