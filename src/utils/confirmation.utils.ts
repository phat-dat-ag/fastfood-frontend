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
