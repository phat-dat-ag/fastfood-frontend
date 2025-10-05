<script setup lang="ts">
import { ErrorMessage, Field, Form } from 'vee-validate';
import * as yup from 'yup';
import { nomarlizeSpaces } from '../../../utils/string.utils';
import type { OTPResponseType, SignUpRequest } from '../../../types/auth.types';
import { onUnmounted, ref } from 'vue';
import OTPModal from '../components/OTPModal.vue';
import { signUp, verifySignUp } from '../../../service/auth.service';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../../store/useAuthStore';
import { notifyError, notifySuccess } from '../../../utils/notification.utils';
import type { AxiosError } from 'axios';
import type { ApiResponse } from '../../../types/api.types';
import { closeLoading, openLoading } from '../../../utils/loading.utils';
import { ROUTE_NAMES } from '../../../constants/route-names';

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

let toggleOTPModal = ref(false);

const remainingTime = ref<number>(0);

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

async function signUpHandle() {
    const signUpData: SignUpRequest | null = authStore.signUpData;
    if (!signUpData) {
        notifyError("Lỗi", "Không có dữ liệu để đăng ký");
        return;
    }
    const loading: any = openLoading("Đang xử lý...");
    try {
        const res = await signUp(signUpData);
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
    } catch (e) {
        const err = e as AxiosError<any>;
        // console.log("Status:", err.response?.status);
        // console.log("Data:", err.response?.data);
        notifyError("Đăng ký thất bại!", err.response?.data.message || "Hãy thử lại");
    } finally {
        closeLoading(loading);
    }
}


const onSubmit = async (values: any) => {
    authStore.setSignUpData({
        phone: values.phone,
        name: values.name,
        email: values.email,
        birthdayString: values.birthdayString,
        password: values.password
    });
    await signUpHandle();
}

const checkOTP = async (otp: string): Promise<string> => {
    const signUpData: SignUpRequest | null = authStore.signUpData;
    if (!signUpData) {
        notifyError("Lỗi", "Không có dữ liệu để đăng ký");
        return "Không có dữ liệu để đăng ký";
    }
    const loading: any = openLoading("Đang xác thực...");
    try {
        await verifySignUp({ phone: signUpData.phone, otp });
        toggleOTPModal.value = false;
        notifySuccess("Đã tạo tài khoản", "Hãy đăng nhập");
        router.push({ name: ROUTE_NAMES.AUTH.SIGN_IN });
        return ""
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
            <h2 class="text-2xl font-semibold text-center mb-6">Đăng ký</h2>
            <!-- Form -->
            <Form :validation-schema="schema" @submit="onSubmit" class="space-y-4">
                <!-- name -->
                <div>
                    <label for="name" class="block text-gray-700 font-medium mb-1">Họ và tên</label>
                    <Field id="name" name="name" type="text"
                        class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Họ và tên của bạn" />
                    <ErrorMessage name="name" class="text-red-500 text-sm mt-1 block" />
                </div>
                <!-- phone -->
                <div>
                    <label for="phone" class="block text-gray-700 font-medium mb-1">Số điện thoại</label>
                    <Field id="phone" name="phone" type="text"
                        class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Nhập số điện thoại" />
                    <ErrorMessage name="phone" class="text-red-500 text-sm mt-1 block" />
                </div>
                <!-- email -->
                <div>
                    <label for="email" class="block text-gray-700 font-medium mb-1">Địa chỉ email</label>
                    <Field id="email" name="email" type="email"
                        class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Nhập đia chỉ email" />
                    <ErrorMessage name="email" class="text-red-500 text-sm mt-1 block" />
                </div>
                <!-- birthday -->
                <div>
                    <label for="birthdayString" class="block text-gray-700 font-medium mb-1">Sinh nhật</label>
                    <Field id="birthdayString" name="birthdayString" type="date"
                        class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
                    <ErrorMessage name="birthdayString" class="text-red-500 text-sm mt-1 block" />
                </div>
                <!-- password -->
                <div>
                    <label for="password" class="block text-gray-700 font-medium mb-1">Mật khẩu</label>
                    <Field id="password" name="password" type="password"
                        class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Nhập mật khẩu" />
                    <ErrorMessage name="password" class="text-red-500 text-sm mt-1 block" />
                </div>
                <!-- confirm password -->
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
                        Đăng ký
                    </button>
                </div>

                <div>
                    <p class="text-center">
                        Bạn đã có tài khoản?
                        <button type="button" class="hover:underline hover:text-blue-500"
                            @click="router.push({ name: ROUTE_NAMES.AUTH.SIGN_IN })">
                            Đăng nhập tại đây
                        </button>
                    </p>
                </div>
            </Form>
            <!-- Modal -->
            <OTPModal v-model:toggleOTPModal="toggleOTPModal" :remainingTime="remainingTime" :checkOTP="checkOTP"
                :resendOTP="signUpHandle" />
        </div>
    </div>
</template>