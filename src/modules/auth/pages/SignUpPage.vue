<script setup lang="ts">
import { ErrorMessage, Field, Form } from 'vee-validate';
import * as yup from 'yup';
import { nomarlizeSpaces } from '../../../utils/string.utils';
import type { OTPResponseType } from '../../../types/auth.types';
import OTPModal from '../components/OTPModal.vue';
import { signUp, verifySignUp } from '../../../service/auth.service';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../../store/useAuthStore.store';
import type { ApiResponse } from '../../../types/api.types';
import { ROUTE_NAMES } from '../../../constants/route-names';
import { useOtpHandler } from '../../../composables/useOtpHandler';
import PrimaryButton from '../../../components/buttons/PrimaryButton.vue';
import SecondaryButton from '../../../components/buttons/SecondaryButton.vue';
import TextButton from '../../../components/buttons/TextButton.vue';

const schema = yup.object({
    name: yup
        .string()
        .required("Vui lòng nhập tên")
        .min(2, "Tên có ít nhất 2 ký tự")
        .max(80, "Tên không vượt quá 80 ký tự")
        .matches(/^[A-Za-zÀ-ỹà-ỹ\s]+$/, "Tên không chứa số hoặc ký tự đặc biệt")
        .test("test-name", "Tên không hợp lệ", function (value: string) {
            const name_value: string = nomarlizeSpaces(value);
            if (name_value.length < 2) return false;
            return true;
        }),
    phone: yup
        .string()
        .required("Vui lòng nhập số điện thoại")
        .matches(/^0\d{9,10}$/, "Số điện thoại không hợp lệ"),
    email: yup.string().email("Email không hợp lệ").required("Vui lòng nhập email"),
    birthdayString: yup.date().required("Vui lòng chon sinh nhật").max(new Date(), "Sinh nhật không hợp lệ"),
    password: yup
        .string()
        .required("Vui lòng nhập mật khẩu")
        .min(8, "Mật khẩu ít nhất 8 ký tự")
        .max(20, "Mật khẩu không vượt quá 20 ký tự")
        .matches(/^[A-Za-z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+$/, "Mật khẩu không chứa tiếng Việt và khoảng cách"),
    confirmPassword: yup
        .string()
        .required("Vui lòng xác nhận mật khẩu")
        .test("test-confirm-password", "Mật khẩu không khớp", function (con_passwd) {
            const { password } = this.parent;
            if (password) {
                return password == con_passwd;
            }
            return true;
        })
})

const router = useRouter();

const authStore = useAuthStore();

const { remainingTime, isOTPModalVisible, sendOTP, verifyOTP } = useOtpHandler(
    async () => {
        const signUpData = authStore.signUpData;
        if (!signUpData) throw new Error("Thiếu dữ liệu đăng ký");
        const response = await signUp(signUpData);
        const dataRespone: ApiResponse<OTPResponseType> = response.data;
        if (!dataRespone.data) throw new Error("Không có dữ liệu đăng ký trả về");
        return dataRespone.data;
    },
    async (otp: string) => {
        const signUpData = authStore.signUpData;
        if (!signUpData) throw new Error("Thiếu dữ liệu đăng ký");
        await verifySignUp({ phone: signUpData.phone, otp })
    },

    () => router.push({ name: ROUTE_NAMES.AUTH.SIGN_IN })
)


const onSubmit = async (values: any) => {
    authStore.setSignUpData({
        phone: values.phone,
        name: values.name,
        email: values.email,
        birthdayString: values.birthdayString,
        password: values.password
    });
    await sendOTP();
}
</script>
<template>
    <div class="flex justify-center items-center">
        <div class="w-full max-w-4xl bg-white p-10 rounded-2xl shadow-xl border border-orange-200">
            <h2 class="text-3xl font-bold text-center mb-8 text-orange-600">Đăng ký tài khoản</h2>

            <Form :validation-schema="schema" @submit="onSubmit" class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label for="name" class="block text-gray-700 font-semibold mb-1">Họ và tên</label>
                    <Field id="name" name="name" type="text"
                        class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
                        placeholder="Nhập họ và tên của bạn" />
                    <ErrorMessage name="name" class="text-red-500 text-sm mt-1 block" />
                </div>

                <div>
                    <label for="phone" class="block text-gray-700 font-semibold mb-1">Số điện thoại</label>
                    <Field id="phone" name="phone" type="text"
                        class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
                        placeholder="Nhập số điện thoại" />
                    <ErrorMessage name="phone" class="text-red-500 text-sm mt-1 block" />
                </div>

                <div>
                    <label for="email" class="block text-gray-700 font-semibold mb-1">Địa chỉ email</label>
                    <Field id="email" name="email" type="email"
                        class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
                        placeholder="Nhập địa chỉ email" />
                    <ErrorMessage name="email" class="text-red-500 text-sm mt-1 block" />
                </div>

                <div>
                    <label for="birthdayString" class="block text-gray-700 font-semibold mb-1">Ngày sinh</label>
                    <Field id="birthdayString" name="birthdayString" type="date"
                        class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 transition" />
                    <ErrorMessage name="birthdayString" class="text-red-500 text-sm mt-1 block" />
                </div>

                <div>
                    <label for="password" class="block text-gray-700 font-semibold mb-1">Mật khẩu</label>
                    <Field id="password" name="password" type="password"
                        class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
                        placeholder="Nhập mật khẩu" />
                    <ErrorMessage name="password" class="text-red-500 text-sm mt-1 block" />
                </div>

                <div>
                    <label for="confirmPassword" class="block text-gray-700 font-semibold mb-1">Xác nhận mật
                        khẩu</label>
                    <Field id="confirmPassword" name="confirmPassword" type="password"
                        class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
                        placeholder="Nhập lại mật khẩu" />
                    <ErrorMessage name="confirmPassword" class="text-red-500 text-sm mt-1 block" />
                </div>

                <div class="md:col-span-2 flex justify-center gap-4 pt-4">
                    <SecondaryButton :onClick="() => router.back()" label="Quay lại" />
                    <PrimaryButton label="Đăng ký" />
                </div>

                <p class="md:col-span-2 text-center text-gray-600 text-sm mt-2">
                    Bạn đã có tài khoản?
                    <TextButton :onClick="() => router.push({ name: ROUTE_NAMES.AUTH.SIGN_IN })"
                        label="Đăng nhập tại đây" />
                </p>
            </Form>

            <OTPModal v-model:toggleOTPModal="isOTPModalVisible" :remainingTime="remainingTime" :checkOTP="verifyOTP"
                :resendOTP="sendOTP" />
        </div>
    </div>
</template>