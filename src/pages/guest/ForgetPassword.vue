<script setup lang="ts">
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import type { ForgetPasswordRequest, OTPResponseType } from '../../types/auth.types';
import OTPModal from '../../components/OTPModal.vue';
import { onUnmounted, ref } from 'vue';
import { useAuthStore } from '../../store/useAuthStore';
import { forgetPassword, verifyForgetPassword } from '../../service/auth.service';
import { notifyError, notifySuccess } from '../../utils/notification.utils';
import { useRouter } from 'vue-router';
import type { AxiosError } from 'axios';
import type { ApiResponse } from '../../types/api.types';
import { closeLoading, openLoading } from '../../utils/loading.utils';

const schema = yup.object({
    phone: yup
        .string()
        .required("Vui lòng nhập số điện thoại")
        .matches(/^0\d{9,10}$/, "Số điện thoại không hợp lệ"),
    newPassword: yup
        .string()
        .required("Vui lòng nhập mật khẩu")
        .min(8, "Mật khẩu ít nhất 8 ký tự")
        .max(20, "Mật khẩu không vượt quá 20 ký tự")
        .matches(/^[A-Za-z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+$/, "Mật khẩu không chứa tiếng Việt và khoảng cách"),
    confirmPassword: yup
        .string()
        .required("Vui lòng xác nhận mật khẩu")
        .test("test-confirm-password", "Mật khẩu không khớp", function (con_passwd) {
            const { newPassword } = this.parent;
            if (newPassword) {
                return newPassword == con_passwd;
            }
            return true;
        })
})

const router = useRouter();

const authStore = useAuthStore();

let remainingTime = ref<number>(0);

let toggleOTPModal = ref(false);

let timer: number | null = null;

function countDown() {
    if (timer) clearInterval(timer);

    timer = setInterval(() => {
        if (remainingTime.value > 0) {
            remainingTime.value = remainingTime.value - 1;
        } else {
            clearInterval(timer!);
            timer = null;
        }
    }, 1000);
}

onUnmounted(() => {
    if (timer) clearInterval(timer);
})

async function forgetPasswordHandle() {
    const forgetPasswordData: ForgetPasswordRequest | null = authStore.forgetPasswordData;
    if (!forgetPasswordData) {
        notifyError("Lỗi", "Không có dữ liệu để yêu cầu quên mật khẩu");
        return;
    }
    const loading: any = openLoading("Đang xử lý...");
    try {
        const res = await forgetPassword(forgetPasswordData);
        const dataRes: ApiResponse<OTPResponseType> = res.data;
        if (!dataRes.data) {
            notifyError("Lỗi", "Không tìm thấy dữ liệu trả về");
            return;
        }
        const now = new Date();
        const expiredAt: Date = new Date(dataRes.data.expiredAt);
        remainingTime.value = Math.floor((expiredAt.getTime() - now.getTime()) / 1000);

        countDown();
        toggleOTPModal.value = true;
        authStore.setForgetPasswordData(forgetPasswordData);
    } catch (e) {
        const err = e as AxiosError<any>
        // console.log("Status:", err.response?.status);
        // console.log("Data:", err.response?.data);
        notifyError("Lỗi khi xử lý quên mật khẩu", err.response?.data.message || "Lỗi đã xảy ra");
    } finally {
        closeLoading(loading);
    }
}

const onSubmit = async (values: any) => {
    authStore.setForgetPasswordData({
        phone: values.phone,
        newPassword: values.newPassword,
    });
    await forgetPasswordHandle();
}

const checkOTP = async (otp: string): Promise<string> => {
    if (!authStore.forgetPasswordData) {
        notifyError("Lỗi", "Không có dữ liệu để xác thực");
        return "Lỗi không có dữ liệu xác thực quên mật khẩu";
    }
    const loading: any = openLoading("Đang xác thực");
    try {
        await verifyForgetPassword({
            phone: authStore.forgetPasswordData.phone,
            otp,
            newPassword: authStore.forgetPasswordData.newPassword
        });
        toggleOTPModal.value = false;
        notifySuccess("Lấy lại mật khẩu thành công", "Hãy đăng nhập lại");
        router.push({ name: "SignIn" });
        return "";
    } catch (e) {
        const err = e as AxiosError<any>;
        // console.log("Status:", err.response?.status);
        // console.log("Data:", err.response?.data);
        return err.response?.data.message || "OTP sai bét nha cưng";
    } finally {
        closeLoading(loading);
    }
}

</script>
<template>
    <div class="flex justify-center items-center">
        <div class="w-full max-w-md p-6 rounded-lg shadow-md">
            <h2 class="text-2xl font-semibold text-center mb-6">Tạo mật khẩu mới</h2>
            <!-- Form -->
            <Form :validation-schema="schema" @submit="onSubmit" class="space-y-4">
                <!-- phone -->
                <div>
                    <label for="phone" class="block text-gray-700 font-medium mb-1">Số điện thoại</label>
                    <Field id="phone" name="phone" type="text"
                        class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Nhập số điện thoại" />
                    <ErrorMessage name="phone" class="text-red-500 text-sm mt-1 block" />
                </div>

                <!-- newPassword -->
                <div>
                    <label for="newPassword" class="block text-gray-700 font-medium mb-1">Mật khẩu mới</label>
                    <Field id="newPassword" name="newPassword" type="password"
                        class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Nhập mật khẩu" />
                    <ErrorMessage name="newPassword" class="text-red-500 text-sm mt-1 block" />
                </div>

                <!-- confirm newPassword -->
                <div>
                    <label for="confirmPassword" class="block text-gray-700 font-medium mb-1">Xác nhận mật khẩu</label>
                    <Field id="confirmPassword" name="confirmPassword" type="password"
                        class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Nhập mật khẩu để xác nhận" />
                    <ErrorMessage name="confirmPassword" class="text-red-500 text-sm mt-1 block" />
                </div>

                <div class="flex gap-4">
                    <button type="button"
                        class="w-full bg-gray-500 text-white py-2 rounded hover:bg-gray-600 transition duration-200 font-semibold"
                        @click="() => router.back()">
                        Quay lại
                    </button>
                    <button
                        class="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200 font-semibold">
                        Xác nhận
                    </button>
                </div>
            </Form>

            <!-- Modal -->
            <OTPModal v-model:toggleOTPModal="toggleOTPModal" :remainingTime="remainingTime" :checkOTP="checkOTP"
                :resendOTP="forgetPasswordHandle" />
        </div>
    </div>
</template>