<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from '../../../store/useUserStore.store';
import { formatDateString } from '../../../utils/time.utils';
import { ElAvatar } from 'element-plus';
import { updateAvatar } from '../../../service/user.service';
import type { AxiosError } from 'axios';
import { notifyError, notifySuccess } from '../../../utils/notification.utils';
import { closeLoading, openLoading } from '../../../utils/loading.utils';
import type { ApiResponse } from '../../../types/api.types';
import type { User } from '../../../types/user.types';
import { useRouter } from 'vue-router';
import { ROUTE_NAMES } from '../../../constants/route-names';
import { USER_ROLES } from '../../../constants/user-roles';

const router = useRouter();

const userStore = useUserStore();

const defaultAvatarUrl: string = 'https://res.cloudinary.com/dfsdlsfbv/image/upload/v1747122687/books/mzkfsohlqelvamwm0wzk.jpg';

let fileInputRef = ref<HTMLInputElement | null>(null);

let avatarImage = ref<string>(userStore.user?.avatarUrl ?? defaultAvatarUrl);
let avatarFile: File | null = null;

function onImageChange(e: Event) {
    const target = e.target as HTMLInputElement;
    if (target && target.files) {
        avatarImage.value = URL.createObjectURL(target.files[0]);
        avatarFile = target.files[0];
    }
}

async function handleUpdateAvatar() {
    let loading = openLoading("Đang cập nhật ảnh đại diện");
    try {
        if (avatarFile) {
            const response = await updateAvatar(avatarFile);
            const dataResponse: ApiResponse<User> = response.data;
            if (!dataResponse.data) {
                notifyError("Không có dữ liệu trả về khi đổi ảnh đại diện");
                return;
            }
            userStore.setUser(dataResponse.data);
            avatarFile = null;
            if (fileInputRef.value)
                fileInputRef.value.value = '';
            notifySuccess("Cập nhật ảnh đại diện thành công");
        }
    } catch (e) {
        const err = e as AxiosError<any>;
        notifyError(err.response?.data.message || "Xảy ra lỗi khi cập nhật ảnh đại diện");
    } finally {
        closeLoading(loading);

    }
}

function goToEditProfilePage() {
    switch (userStore.user?.role) {
        case USER_ROLES.USER:
            router.push({ name: ROUTE_NAMES.USER.EDIT_PROFILE });
            break;
        case USER_ROLES.STAFF:
            router.push({ name: ROUTE_NAMES.STAFF.EDIT_PROFILE });
            break;
        default:
            notifyError("Tài khoản của bạn không đủ quyền để thực hiện");
    }
}

function goToChangePasswordPage() {
    switch (userStore.user?.role) {
        case USER_ROLES.USER:
            router.push({ name: ROUTE_NAMES.USER.CHANGE_PASSWORD });
            break;
        case USER_ROLES.STAFF:
            router.push({ name: ROUTE_NAMES.STAFF.CHANGE_PASSWORD });
            break;
        default:
            notifyError("Tài khoản của bạn không đủ quyền để thực hiện");
    }
}

</script>
<template>
    <div class="w-[80%] flex flex-col gap-4 mx-auto">
        <h1 class="text-xl pt-4">Xin chào {{ userStore.user?.name || "Không xác định" }},
            tại đây bạn có thể quản lý thông tin cá nhân của mình!
        </h1>
        <div class="border rounded-lg">
            <h1 class="rounded-t-lg bg-orange-300 p-2 text-xl font-bold">Ảnh đại diện</h1>
            <div class="flex p-4">
                <div class="grow">
                    <ElAvatar :size="200" :src="avatarImage" alt="Ảnh đại diện"></ElAvatar>
                </div>
                <div class="grow flex flex-col gap-2 content-start">
                    <h1>Cập nhật ảnh đại diện</h1>
                    <input ref="fileInputRef" type="file" accept="image/*" @change="onImageChange">
                    <button v-if="avatarFile"
                        class="w-fit bg-blue-500 text-white p-1 rounded hover:bg-blue-600 transition duration-200 font-semibold"
                        @click="handleUpdateAvatar">Cập nhật</button>
                </div>
            </div>
        </div>

        <div class="border rounded-lg">
            <h1 class="rounded-t-lg bg-orange-300 p-2 text-xl font-bold">Thông tin cá nhân</h1>
            <div class="flex p-4">
                <div class="grow">
                    <h2>{{ userStore.user?.name || "Không xác định" }}</h2>
                    <h2>{{ userStore.user?.phone || "Không xác định" }}</h2>
                    <h2>{{ userStore.user?.email || "Không xác định" }}</h2>
                    <h2>{{ formatDateString(userStore.user?.birthday) || "Không xác định" }}</h2>
                </div>
                <div class="grow flex flex-col items-start">
                    <button class="underline text-blue-500" @click="goToEditProfilePage">Chỉnh sửa thông tin</button>
                    <button class="underline text-blue-500" @click="goToChangePasswordPage">Đổi mật khẩu</button>
                </div>
            </div>
        </div>

        <div class="border rounded-lg">
            <h1 class="rounded-t-lg bg-orange-300 p-2 text-xl font-bold">Địa chỉ giao hàng</h1>
            <div class="flex p-4">

                <div class="grow">
                    <h1>Đại học Cần Thơ, đường 3/2, Xuân Khánh, Ninh Kiều, Cần Thơ</h1>
                </div>
                <div class="grow">
                    <button class="underline text-blue-500">
                        Thêm địa chỉ mới
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
