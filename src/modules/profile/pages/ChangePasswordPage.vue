<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useUserStore } from '../../../store/useUserStore';
import * as yup from "yup";
import { ErrorMessage, Field, Form } from 'vee-validate';
import type { ChangePasswordRequest, User } from '../../../types/user.types';
import { closeLoading, openLoading } from '../../../utils/loading.utils';
import { changePassword } from '../../../service/user.service';
import type { ApiResponse } from '../../../types/api.types';
import { notifyError, notifySuccess } from '../../../utils/notification.utils';
import type { AxiosError } from 'axios';
import { ref } from 'vue';

const router = useRouter();

const userStore = useUserStore();

const changePasswordError = ref<string | null>(null);

const schema = yup.object({
    password: yup
        .string()
        .required("Vui lòng nhập mật khẩu hiện tại")
        .min(8, "Mật khẩu hiện tại có ít nhất 8 ký tự")
        .max(20, "Mật khẩu hiện tại không vượt quá 20 ký tự")
        .matches(/^[A-Za-z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+$/, "Mật khẩu hiện tại không chứa tiếng Việt và khoảng cách"),
    newPassword: yup
        .string()
        .required("Vui lòng nhập mật khẩu mới")
        .min(8, "Mật khẩu mới có ít nhất 8 ký tự")
        .max(20, "Mật khẩu mới không vượt quá 20 ký tự")
        .matches(/^[A-Za-z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+$/, "Mật khẩu mới không chứa tiếng Việt và khoảng cách"),
    confirmNewPassword: yup
        .string()
        .required("Vui lòng nhập lại mật khẩu mới")
        .min(8, "Mật khẩu mới có ít nhất 8 ký tự")
        .max(20, "Mật khẩu mới không vượt quá 20 ký tự")
        .matches(/^[A-Za-z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+$/, "Mật khẩu mới không chứa tiếng Việt và khoảng cách")
        .test("check-new-password", "Xác thực không khớp với mật khẩu mới", function (confirmNewPassword) {
            const { newPassword } = this.parent;
            if (!newPassword) return true;
            return newPassword === confirmNewPassword;
        }),
});

async function onSubmit(values: any) {
    const data: ChangePasswordRequest = {
        password: values.password,
        newPassword: values.newPassword,
    }
    const loading = openLoading("Đang xử lý đổi mật khẩu mới...");
    try {
        const res = await changePassword(data);
        const dataRes: ApiResponse<User> = res.data;
        if (!dataRes.data) {
            notifyError("Lỗi", "Không thấy dữ liệu trả về sau khi đổi mật khẩu");
            return;
        }
        userStore.setUser(dataRes.data);
        notifySuccess("Thành công", "Bạn đã đổi mật khẩu");
        router.back();
    } catch (e) {
        const err = e as AxiosError<any>;
        console.log("Status :", err.response?.status);
        console.log("Data: ", err.response?.data);
        changePasswordError.value = err.response?.data.message || "Lỗi xảy ra khi đổi mật khẩu";
    } finally {
        closeLoading(loading);
    }
} 
</script>
<template>
    <div class="flex justify-center items-center">
        <div class="w-full max-w-md p-6 rounded-lg shadow-md">
            <h2 class="text-2xl font-semibold text-center mb-6">Đổi mật khẩu</h2>
            <Form :validation-schema="schema" @submit="onSubmit" class="space-y-4">
                <div>
                    <label for="password" class="block text-gray-700 font-medium mb-1">Mật khẩu hiện tại</label>
                    <Field id="password" name="password" type="password"
                        class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Nhập mật khẩu hiện tại" />
                    <ErrorMessage name="password" class="text-red-500 text-sm mt-1 block" />
                </div>

                <div>
                    <label for="newPassword" class="block text-gray-700 font-medium mb-1">Mật khẩu mới</label>
                    <Field id="newPassword" name="newPassword" type="password"
                        class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Nhập mật khẩu mới" />
                    <ErrorMessage name="newPassword" class="text-red-500 text-sm mt-1 block" />
                </div>

                <div>
                    <label for="confirmNewPassword" class="block text-gray-700 font-medium mb-1">Xác nhận mật khẩu
                        mới</label>
                    <Field id="confirmNewPassword" name="confirmNewPassword" type="password"
                        class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Nhập lại mật khẩu mới" />
                    <ErrorMessage name="confirmNewPassword" class="text-red-500 text-sm mt-1 block" />
                </div>

                <p v-if="changePasswordError" class="text-center text-red-500 text-sm mt-1 block">{{ changePasswordError
                    }}</p>

                <div class="flex gap-4">
                    <button type="button"
                        class="w-full bg-gray-500 text-white py-2 rounded hover:bg-gray-600 transition duration-200 font-semibold"
                        @click="() => router.back()">
                        Quay lại
                    </button>
                    <button
                        class="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200 font-semibold">
                        Đổi mật khẩu ngay
                    </button>
                </div>
            </Form>
        </div>
    </div>
</template>