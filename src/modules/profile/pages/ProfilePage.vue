<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useUserStore } from '../../../store/useUserStore.store';
import { updateAvatar } from '../../../service/user.service';
import type { AxiosError } from 'axios';
import { notifyError, notifySuccess } from '../../../utils/notification.utils';
import { closeLoading, openLoading } from '../../../utils/loading.utils';
import type { ApiResponse } from '../../../types/api.types';
import type { User } from '../../../types/user.types';
import { useRouter } from 'vue-router';
import { ROUTE_NAMES } from '../../../constants/route-names';
import { USER_ROLES } from '../../../constants/user-roles';
import type { Address, AddressCreateRequest, AddressResponse } from '../../../types/geocode.types';
import { useApiHandler } from '../../../composables/useApiHandler';
import { createAddress, deleteAddress, getAddresses } from '../../../service/address.service';
import { ADDRESS_MESSAGE } from '../../../constants/messages';
import { openConfirmDeleteMessage } from '../../../utils/confirmation.utils';
import AvatarSection from '../components/AvatarSection.vue';
import UserInforSection from '../components/UserInforSection.vue';
import AddressSection from '../components/AddressSection.vue';

const router = useRouter();

const userStore = useUserStore();

const addresses = ref<Address[]>([]);

async function loadAddresses() {
    await useApiHandler<AddressResponse>(
        getAddresses,
        {
            loading: ADDRESS_MESSAGE.get,
            error: ADDRESS_MESSAGE.getError,
        },
        (data: AddressResponse) => addresses.value = data.addresses,
    )
}

onMounted(loadAddresses);

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

async function handleAddAddress(address: AddressCreateRequest) {
    await useApiHandler(
        () => createAddress(address),
        {
            loading: ADDRESS_MESSAGE.create,
            error: ADDRESS_MESSAGE.createError,
            success: ADDRESS_MESSAGE.createSuccess,
        },
        () => { },
        loadAddresses,
    )
}

async function handleDeleteAddress(id: number) {
    const confirmed: boolean = await openConfirmDeleteMessage("Xóa địa chỉ giao hàng này?");
    if (!confirmed) return;
    await useApiHandler(
        () => deleteAddress(id),
        {
            loading: ADDRESS_MESSAGE.delete,
            success: ADDRESS_MESSAGE.deleteSuccess,
            error: ADDRESS_MESSAGE.deleteError,
        },
        () => { },
        loadAddresses,
    )
}

</script>
<template>
    <div class="w-[80%] mx-auto space-y-4">
        <div class="rounded-2xl p-6 text-white bg-gradient-to-r from-orange-400 via-orange-500 to-amber-400 shadow-lg">
            <h1 class="text-3xl font-bold drop-shadow-md">
                Xin chào
                <span class="text-yellow-200">{{ userStore.user?.name || "Không xác định" }}</span> 👋
            </h1>
            <p class="text-white/90 mt-2">Tại đây bạn có thể quản lý thông tin cá nhân của mình!</p>
        </div>

        <AvatarSection :avatarImage="avatarImage" :avatarFile="avatarFile" :onImageChange="onImageChange"
            @update-avatar="handleUpdateAvatar" />

        <UserInforSection v-if="userStore.user !== null" :user="userStore.user"
            :goToEditProfilePage="goToEditProfilePage" :goToChangePasswordPage="goToChangePasswordPage" />
        <p v-else>Người dùng không xác định</p>

        <AddressSection :addresses="addresses" :handleAddAddress="handleAddAddress"
            :handleDeleteAddress="handleDeleteAddress" />
    </div>
</template>
