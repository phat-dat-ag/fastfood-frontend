<script setup lang="ts">
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import type { OTPResponseType } from '../../../types/auth.types';
import OTPModal from '../components/OTPModal.vue';
import { useAuthStore } from '../../../store/useAuthStore.store';
import { forgetPassword, verifyForgetPassword } from '../../../service/auth.service';
import { useRouter } from 'vue-router';
import type { ApiResponse } from '../../../types/api.types';
import { ROUTE_NAMES } from '../../../constants/route-names';
import { useOtpHandler } from '../../../composables/useOtpHandler';
import PrimaryButton from '../../../components/buttons/PrimaryButton.vue';
import SecondaryButton from '../../../components/buttons/SecondaryButton.vue';

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

const { remainingTime, isOTPModalVisible, sendOTP, verifyOTP } = useOtpHandler(
    async (): Promise<OTPResponseType> => {
        const forgetPasswordData = authStore.forgetPasswordData;
        if (!forgetPasswordData) throw new Error("Thiếu dữ liệu quên mật khẩu");
        const response = await forgetPassword(forgetPasswordData);
        const dataRespone: ApiResponse<OTPResponseType> = response.data;
        if (!dataRespone.data) throw new Error("Không có dữ liệu đăng ký trả về");
        return dataRespone.data;
    },
    async (otp: string) => {
        const forgetPasswordData = authStore.forgetPasswordData;
        if (!forgetPasswordData) throw new Error("Thiếu dữ liệu quên mật khẩu");
        await verifyForgetPassword({ ...forgetPasswordData, otp });
    },
    () => router.push({ name: ROUTE_NAMES.AUTH.SIGN_IN })
);

const onSubmit = async (values: any) => {
    authStore.setForgetPasswordData({
        phone: values.phone,
        newPassword: values.newPassword,
    });
    await sendOTP();
}

</script>
<template>
    <div class="flex justify-center items-center">
        <div class="w-full max-w-md bg-white p-10 rounded-2xl shadow-xl border border-orange-200">
            <h2 class="text-3xl font-bold text-center mb-8 text-orange-600">
                Tạo mật khẩu mới
            </h2>

            <Form :validation-schema="schema" @submit="onSubmit" class="space-y-6">
                <div>
                    <label for="phone" class="block text-gray-700 font-semibold mb-1">Số điện thoại</label>
                    <Field id="phone" name="phone" type="text"
                        class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
                        placeholder="Nhập số điện thoại" />
                    <ErrorMessage name="phone" class="text-red-500 text-sm mt-1 block" />
                </div>

                <div>
                    <label for="newPassword" class="block text-gray-700 font-semibold mb-1">Mật khẩu mới</label>
                    <Field id="newPassword" name="newPassword" type="password"
                        class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
                        placeholder="Nhập mật khẩu mới" />
                    <ErrorMessage name="newPassword" class="text-red-500 text-sm mt-1 block" />
                </div>

                <div>
                    <label for="confirmPassword" class="block text-gray-700 font-semibold mb-1">Xác nhận mật
                        khẩu</label>
                    <Field id="confirmPassword" name="confirmPassword" type="password"
                        class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
                        placeholder="Nhập lại mật khẩu để xác nhận" />
                    <ErrorMessage name="confirmPassword" class="text-red-500 text-sm mt-1 block" />
                </div>

                <div class="flex justify-center gap-4 pt-4">
                    <SecondaryButton :onClick="() => router.back()" label="Quay lại" />
                    <PrimaryButton label="Xác nhận" />
                </div>
            </Form>

            <OTPModal v-model:toggleOTPModal="isOTPModalVisible" :remainingTime="remainingTime" :checkOTP="verifyOTP"
                :resendOTP="sendOTP" />
        </div>
    </div>
</template>