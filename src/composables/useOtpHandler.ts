import { onUnmounted, ref } from "vue";
import { closeLoading, openLoading } from "../utils/loading.utils";
import type { AxiosError } from "axios";
import { notifyError, notifySuccess } from "../utils/notification.utils";
import type { OTPResponseType } from "../types/auth.types";

export function useOtpHandler(
  sendOtpApi: () => Promise<OTPResponseType>,
  verifyOtpApi: (otp: string) => Promise<void>,
  onSucess: () => void
) {
  const remainingTime = ref(0);
  const isOTPModalVisible = ref(false);
  let timer: number | null = null;

  function clearTimer() {
    if (timer) clearInterval(timer);
  }

  function startCountDown(seconds: number) {
    clearTimer();
    remainingTime.value = seconds;
    timer = setInterval(() => {
      if (remainingTime.value > 0) remainingTime.value--;
      else clearTimer();
    }, 1000);
  }

  onUnmounted(clearTimer);

  async function sendOTP() {
    const loading = openLoading("Đang gửi OTP...");
    try {
      const dataResponse = await sendOtpApi();
      const expiredAt: Date = new Date(dataResponse.expiredAt);
      const now = new Date();
      startCountDown(Math.floor((expiredAt.getTime() - now.getTime()) / 1000));
      isOTPModalVisible.value = true;
    } catch (e) {
      const err = e as AxiosError<any>;
      notifyError(
        err.response?.data.message || "Không gửi được OTP, hãy thử lại"
      );
    } finally {
      closeLoading(loading);
    }
  }

  async function verifyOTP(otp: string): Promise<string> {
    const loading = openLoading("Đang xác thực");
    try {
      await verifyOtpApi(otp);
      notifySuccess("Xác thực thành công");
      onSucess();
      return "";
    } catch (e) {
      const err = e as AxiosError<any>;
      return err.response?.data.message || "OTP không hợp lệ";
    } finally {
      closeLoading(loading);
    }
  }
  return { remainingTime, isOTPModalVisible, sendOTP, verifyOTP };
}
