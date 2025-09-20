import { ElLoading } from "element-plus";

export const openLoading = (text: string = "Loading...") => {
  return ElLoading.service({
    lock: true,
    text,
    background: "rgba(0, 0, 0, 0.7)",
  });
};

export const closeLoading = (loadingInstance: any) => {
  if (loadingInstance) loadingInstance.close();
};
