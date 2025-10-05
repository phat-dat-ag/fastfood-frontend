<script setup lang="ts">
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import type { SignInResponse, SignInRequest } from '../../../types/auth.types';
import { useRouter } from 'vue-router';
import { signIn } from '../../../service/auth.service';
import { useUserStore } from '../../../store/useUserStore';
import { notifyError } from '../../../utils/notification.utils';
import type { AxiosError } from 'axios';
import { closeLoading, openLoading } from '../../../utils/loading.utils';
import type { ApiResponse } from '../../../types/api.types';
import { ref } from 'vue';
import { USER_ROLES } from '../../../constants/user-roles';
import { ROUTE_NAMES } from '../../../constants/route-names';

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
        const res = await signIn(signInData);
        const dataRes: ApiResponse<SignInResponse> = res.data;
        if (!dataRes.data) {
            notifyError("Lỗi", "Không thấy dữ liệu trả về sau khi đăng nhập");
            return;
        }
        userStore.setUser(dataRes.data.user);
        localStorage.setItem("token", dataRes.data.token);
        switch (userStore.user?.role) {
            case USER_ROLES.ADMIN:
                router.push({ name: ROUTE_NAMES.ADMIN.HOME });
                break;
            case USER_ROLES.STAFF:
                router.push({ name: ROUTE_NAMES.STAFF.HOME });
                break;
            default:
                router.push({ name: ROUTE_NAMES.USER.HOME });
        }
    } catch (e) {
        const err = e as AxiosError<any>;
        console.log("Status: ", err.response?.status);
        console.log("Data: ", err.response?.data);
        signInError.value = err.response?.data.message || "Số điện thoại hoặc mật khẩu sai";
    } finally {
        closeLoading(loading);
    }
}
</script>
<template>
    <div class="flex justify-center items-center">
        <div class="w-full max-w-md p-6 rounded-lg shadow-md">
            <h2 class="text-2xl font-semibold text-center mb-6">Đăng nhập</h2>
            <Form :validation-schema="schema" @submit="onSubmit" class="space-y-4">
                <!-- phone -->
                <div>
                    <label for="phone" class="block text-gray-700 font-medium mb-1">Số điện thoại</label>
                    <Field id="phone" name="phone" type="text"
                        class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Nhập số điện thoại" />
                    <ErrorMessage name="phone" class="text-red-500 text-sm mt-1 block" />
                </div>
                <!-- password -->
                <div>
                    <label for="password" class="block text-gray-700 font-medium mb-1">Mật khẩu</label>
                    <Field id="password" name="password" type="password"
                        class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Nhập mật khẩu" />
                    <ErrorMessage name="password" class="text-red-500 text-sm mt-1 block" />
                </div>

                <p class="text-center text-red-500 text-sm mt-1 block">{{ signInError }}</p>

                <button type="button" class="hover:underline hover:text-blue-500"
                    @click="router.push('/forget-password')">
                    Quên mật khẩu?
                </button>

                <div class="flex gap-4">
                    <button type="button"
                        class="w-full bg-gray-500 text-white py-2 rounded hover:bg-gray-600 transition duration-200 font-semibold"
                        @click="() => router.back()">
                        Quay lại
                    </button>
                    <button
                        class="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200 font-semibold">
                        Đăng nhập
                    </button>
                </div>

                <div>
                    <p class="text-center">
                        Bạn chưa có tài khoản?
                        <button type="button" class="hover:underline hover:text-blue-500"
                            @click="router.push({ name: ROUTE_NAMES.AUTH.SIGN_UP })">Đăng ký tại đây
                        </button>
                    </p>
                </div>
            </Form>
        </div>
    </div>
</template>