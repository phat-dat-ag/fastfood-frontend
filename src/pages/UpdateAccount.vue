<script setup lang="ts">
import * as yup from "yup";
import { useUserStore } from '../store/useUserStore';
import { Form, Field, ErrorMessage } from "vee-validate";
import type { UpdateUserRequest, User } from "../types/user.types";
import { closeLoading, openLoading } from "../utils/loading.utils";
import { updateUserInformation } from "../service/user.service";
import type { ApiResponse } from "../types/api.types";
import { notifyError, notifySuccess } from "../utils/notification.utils";
import type { AxiosError } from "axios";
import router from "../router";

const userStore = useUserStore();

const schema = yup.object({
    phone: yup.string().required("Vui lòng nhập số điện thoại").matches(/^0\d{9,10}$/, "Số điện thoại không hợp lệ"),
    name: yup.string().required("Vui lòng nhập tên").min(2, "Tên phải từ 2 ký tự").max(80, "Tên không được vượt quá 80 ký tự"),
    email: yup.string().email("Email không hợp lệ").required("Vui lòng nhập email"),
    birthdayString: yup.date().required("Vui lòng chon sinh nhật").max(new Date(), "Sinh nhật không hợp lệ"),
});

async function onSubmit(values: any) {
    const infor: UpdateUserRequest = {
        name: values.name,
        email: values.email,
        birthdayString: values.birthdayString,
    };
    const loading = openLoading("Đang cập nhật thông tin của bạn...");
    try {
        const res = await updateUserInformation(infor);
        const dataRes: ApiResponse<User> = res.data;
        if (!dataRes.data) {
            notifyError("Lỗi", "Không thấy dữ liệu trả về sau khi cập nhật");
            return;
        }
        userStore.setUser(dataRes.data);
        notifySuccess("Thành công", "Thông tin của bạn đã được cập nhật");
        router.back();
    } catch (e) {
        const err = e as AxiosError<any>;
        console.log("Status :", err.response?.status);
        console.log("Data :", err.response?.data);
        notifyError("Lỗi xảy ra", err.response?.data.message || "Hãy thử lại sau");
    } finally {
        closeLoading(loading);
    }
}

</script>
<template>
    <div class="flex justify-center items-center">
        <div class="w-full max-w-md p-6 rounded-lg shadow-md">
            <h2 class="text-2xl font-semibold text-center mb-6">Cập nhật thông tin</h2>
            <Form :validation-schema="schema" @submit="onSubmit" :initial-values="{
                phone: userStore.user?.phone ?? 'Không thấy số điện thoại của tài khoản',
                name: userStore.user?.name || 'Không thấy tên của tài khoản',
                email: userStore.user?.email || 'Không thấy email của tài khoản',
                birthdayString: userStore.user?.birthday || 'Không thấy sinh nhật của tài khoản',
            }" class="space-y-4">
                <div>
                    <label for="phone" class="block text-gray-700 font-medium mb-1">Số điện thoại</label>
                    <Field id="phone" name="phone" type="text" disabled
                        class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Nhập số điện thoại"></Field>
                    <ErrorMessage name="phone" class="text-red-500 text-sm mt-1 block"></ErrorMessage>
                </div>

                <div>
                    <label for="name" class="block text-gray-700 font-medium mb-1">Họ và tên</label>
                    <Field id="name" name="name" type="text"
                        class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Họ và tên của bạn" />
                    <ErrorMessage name="name" class="text-red-500 text-sm mt-1 block" />
                </div>

                <div>
                    <label for="email" class="block text-gray-700 font-medium mb-1">Địa chỉ email</label>
                    <Field id="email" name="email" type="email"
                        class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Nhập đia chỉ email" />
                    <ErrorMessage name="email" class="text-red-500 text-sm mt-1 block" />
                </div>

                <div>
                    <label for="birthdayString" class="block text-gray-700 font-medium mb-1">Sinh nhật</label>
                    <Field id="birthdayString" name="birthdayString" type="date"
                        class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
                    <ErrorMessage name="birthdayString" class="text-red-500 text-sm mt-1 block" />
                </div>

                <div class="flex gap-4">
                    <button type="button"
                        class="w-full bg-gray-500 text-white py-2 rounded hover:bg-gray-600 transition duration-200 font-semibold"
                        @click="() => router.back()">
                        Quay lại
                    </button>
                    <button
                        class="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200 font-semibold">
                        Cập nhật
                    </button>
                </div>
            </Form>
        </div>
    </div>
</template>
