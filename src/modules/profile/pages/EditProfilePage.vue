<script setup lang="ts">
import * as yup from "yup";
import { useUserStore } from '../../../store/useUserStore.store';
import { Form, Field, ErrorMessage } from "vee-validate";
import type { EidtUserRequest, User } from "../../../types/user.types";
import { closeLoading, openLoading } from "../../../utils/loading.utils";
import { updateUserInformation } from "../../../service/user.service";
import type { ApiResponse } from "../../../types/api.types";
import { notifyError, notifySuccess } from "../../../utils/notification.utils";
import type { AxiosError } from "axios";
import router from "../../../router";
import SecondaryButton from "../../../components/buttons/SecondaryButton.vue";
import PrimaryButton from "../../../components/buttons/PrimaryButton.vue";

const userStore = useUserStore();

const schema = yup.object({
    phone: yup.string().required("Vui lòng nhập số điện thoại").matches(/^0\d{9,10}$/, "Số điện thoại không hợp lệ"),
    name: yup.string().required("Vui lòng nhập tên").min(2, "Tên phải từ 2 ký tự").max(80, "Tên không được vượt quá 80 ký tự"),
    email: yup.string().email("Email không hợp lệ").required("Vui lòng nhập email"),
    birthdayString: yup.date().required("Vui lòng chon sinh nhật").max(new Date(), "Sinh nhật không hợp lệ"),
});

async function onSubmit(values: any) {
    const editProfileData: EidtUserRequest = {
        name: values.name,
        email: values.email,
        birthdayString: values.birthdayString,
    };
    const loading = openLoading("Đang cập nhật thông tin của bạn...");
    try {
        const response = await updateUserInformation(editProfileData);
        const dataResponse: ApiResponse<User> = response.data;
        if (!dataResponse.data) {
            notifyError("Không thấy dữ liệu trả về sau khi cập nhật");
            return;
        }
        userStore.setUser(dataResponse.data);
        notifySuccess("Thông tin của bạn đã được cập nhật");
        router.back();
    } catch (e) {
        const err = e as AxiosError<any>;
        notifyError(err.response?.data.message || "Lỗi khi cập nhật thông tin hãy thử lại sau");
    } finally {
        closeLoading(loading);
    }
}

</script>
<template>
    <div class="flex justify-center items-center">
        <div class="w-full max-w-md bg-white p-10 rounded-2xl shadow-xl border border-orange-200">
            <h2 class="text-3xl font-bold text-center mb-8 text-orange-600">Cập nhật thông tin</h2>

            <Form :validation-schema="schema" @submit="onSubmit" :initial-values="{
                phone: userStore.user?.phone ?? 'Không thấy số điện thoại',
                name: userStore.user?.name || 'Không thấy tên',
                email: userStore.user?.email || 'Không thấy email',
                birthdayString: userStore.user?.birthday || 'Không thấy sinh nhật',
            }" class="space-y-6">
                <div>
                    <label for="phone" class="block text-gray-700 font-semibold mb-1">Số điện thoại</label>
                    <Field id="phone" name="phone" type="text" disabled
                        class="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
                        placeholder="Nhập số điện thoại" />
                    <ErrorMessage name="phone" class="text-red-500 text-sm mt-1 block" />
                </div>

                <div>
                    <label for="name" class="block text-gray-700 font-semibold mb-1">Họ và tên</label>
                    <Field id="name" name="name" type="text"
                        class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
                        placeholder="Họ và tên của bạn" />
                    <ErrorMessage name="name" class="text-red-500 text-sm mt-1 block" />
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

                <div class="flex justify-center gap-4 pt-4">
                    <SecondaryButton :onClick="() => router.back()" label="Quay lại" />
                    <PrimaryButton label="Cập nhật" />
                </div>
            </Form>
        </div>
    </div>
</template>
