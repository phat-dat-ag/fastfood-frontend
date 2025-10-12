import type { AxiosError } from "axios";
import type { ApiResponse } from "../types/api.types";
import { closeLoading, openLoading } from "../utils/loading.utils";
import { notifyError, notifySuccess } from "../utils/notification.utils";

interface ApiMessage {
  loading: string;
  success?: string;
  error?: string;
}

export async function useApiHandler<T>(
  apiCall: () => Promise<{ data: ApiResponse<T> }>,
  messages: ApiMessage,
  onSuccess: (data: T) => void,
  reLoadFunction?: () => Promise<void>
) {
  const loading = openLoading(messages.loading);
  try {
    const response = await apiCall();
    const dataResponse = response.data;
    if (dataResponse.data) onSuccess(dataResponse.data);
    if (messages.success) notifySuccess(messages.success);
    if (reLoadFunction) await reLoadFunction();
  } catch (e) {
    const error = e as AxiosError<any>;
    notifyError(
      error.response?.data.message ||
        messages.error ||
        "Có lỗi xảy ra, hãy thử lại!"
    );
  } finally {
    closeLoading(loading);
  }
}
