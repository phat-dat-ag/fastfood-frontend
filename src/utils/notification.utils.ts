import { ElNotification } from "element-plus";

export const notifyError = (title: string = "Thất bại", message: string) => {
  ElNotification({
    type: "error",
    title,
    message,
    duration: 3000,
  });
};

export const notifySuccess = (
  title: string = "Thành công",
  message: string
) => {
  ElNotification({
    type: "success",
    title,
    message,
    duration: 3000,
  });
};
