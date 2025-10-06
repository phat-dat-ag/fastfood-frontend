import { ElNotification } from "element-plus";

const NOTIFICATION_DURATION = 3000;

export const notifyError = (message: string, title: string = "Thất bại") => {
  ElNotification({
    type: "error",
    title,
    message,
    duration: NOTIFICATION_DURATION,
  });
};

export const notifySuccess = (
  message: string,
  title: string = "Thành công"
) => {
  ElNotification({
    type: "success",
    title,
    message,
    duration: NOTIFICATION_DURATION,
  });
};
