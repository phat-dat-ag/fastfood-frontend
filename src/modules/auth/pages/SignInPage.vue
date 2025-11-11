<script setup lang="ts">
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import type { SignInResponse, SignInRequest } from '../../../types/auth.types';
import { useRouter } from 'vue-router';
import { signIn } from '../../../service/auth.service';
import { useUserStore } from '../../../store/useUserStore.store';
import { notifyError } from '../../../utils/notification.utils';
import type { AxiosError } from 'axios';
import { closeLoading, openLoading } from '../../../utils/loading.utils';
import type { ApiResponse } from '../../../types/api.types';
import { ref } from 'vue';
import { USER_ROLES } from '../../../constants/user-roles';
import { ROUTE_NAMES } from '../../../constants/route-names';
import SecondaryButton from '../../../components/buttons/SecondaryButton.vue';
import PrimaryButton from '../../../components/buttons/PrimaryButton.vue';
import TextButton from '../../../components/buttons/TextButton.vue';

const router = useRouter();

const userStore = useUserStore();

const schema = yup.object({
    phone: yup
        .string()
        .required("Vui lòng nhập số điện thoại")
        .matches(/^0\d{9,10}$/, "Số điện thoại không hợp lệ"),
    password: yup
        .string()
        .required("Vui lòng nhập mật khẩu")
        .min(8, "Mật khẩu ít nhất 8 ký tự")
        .max(20, "Mật khẩu không vượt quá 20 ký tự")
        .matches(/^[A-Za-z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+$/, "Mật khẩu không chứa tiếng Việt và khoảng cách"),
});

let signInError = ref<string>("");

const onSubmit = async (value: any) => {
    const signInData: SignInRequest = value;
    const loading: any = openLoading("Đang đăng nhập");
    try {
        const response = await signIn(signInData);
        const dataResponse: ApiResponse<SignInResponse> = response.data;
        if (!dataResponse.data) {
            notifyError("Không thấy dữ liệu trả về sau khi đăng nhập");
            return;
        }
        userStore.setUser(dataResponse.data.user);
        localStorage.setItem("token", dataResponse.data.token);
        switch (userStore.user?.role) {
            case USER_ROLES.ADMIN:
                router.push({ name: ROUTE_NAMES.ADMIN.DASHBOARD });
                break;
            case USER_ROLES.STAFF:
                router.push({ name: ROUTE_NAMES.STAFF.HOME });
                break;
            default:
                router.push({ name: ROUTE_NAMES.USER.HOME });
        }
    } catch (e) {
        const err = e as AxiosError<any>;
        signInError.value = err.response?.data.message || "Xảy ra lỗi đăng nhập, hãy thử lại";
    } finally {
        closeLoading(loading);
    }
}
</script>
<template>
    <div class="flex justify-center items-center">
        <div class="w-full max-w-md bg-white p-10 rounded-2xl shadow-xl border border-orange-200">
            <h2 class="text-3xl font-bold text-center mb-8 text-orange-600">Đăng nhập</h2>

            <Form :validation-schema="schema" @submit="onSubmit" class="space-y-6">
                <div>
                    <label for="phone" class="block text-gray-700 font-semibold mb-1">Số điện thoại</label>
                    <Field id="phone" name="phone" type="text"
                        class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
                        placeholder="Nhập số điện thoại" />
                    <ErrorMessage name="phone" class="text-red-500 text-sm mt-1 block" />
                </div>

                <div>
                    <label for="password" class="block text-gray-700 font-semibold mb-1">Mật khẩu</label>
                    <Field id="password" name="password" type="password"
                        class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
                        placeholder="Nhập mật khẩu" />
                    <ErrorMessage name="password" class="text-red-500 text-sm mt-1 block" />
                </div>

                <p v-if="signInError" class="text-center text-red-500 text-sm mt-1">{{ signInError }}</p>

                <div class="flex justify-end">
                    <TextButton :onClick="() => router.push({ name: ROUTE_NAMES.AUTH.FORGET_PASSWORD })"
                        label="Quên mật khẩu?" />
                </div>

                <div class="flex justify-center gap-4 pt-4">
                    <SecondaryButton :onClick="() => router.back()" label="Quay lại" />
                    <PrimaryButton label="Đăng nhập" />
                </div>

                <p class="text-center text-gray-600 text-sm mt-4">
                    Bạn chưa có tài khoản?
                    <TextButton :onClick="() => router.push({ name: ROUTE_NAMES.AUTH.SIGN_UP })"
                        label="Đăng ký tại đây" />
                </p>
            </Form>
        </div>
    </div>
</template>