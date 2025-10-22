<script setup lang="ts">
import { onMounted, ref } from 'vue';
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
import TextButton from '../../../components/buttons/TextButton.vue';
import AddressSelector from '../../../components/AddressSelector.vue';
import type { Address, AddressCreateRequest, AddressResponse } from '../../../types/geocode.types';
import { useApiHandler } from '../../../composables/useApiHandler';
import { createAddress, deleteAddress, getAddresses } from '../../../service/address.service';
import { ADDRESS_MESSAGE } from '../../../constants/messages';
import DeleteButton from '../../../components/buttons/DeleteButton.vue';
import { openConfirmDeleteMessage } from '../../../utils/confirmation.utils';

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
    <div class="w-[80%] mx-auto py-10 space-y-10">
        <div class="rounded-2xl p-6 text-white bg-gradient-to-r from-orange-400 via-orange-500 to-amber-400 shadow-lg">
            <h1 class="text-3xl font-bold drop-shadow-md">
                Xin chào
                <span class="text-yellow-200">{{ userStore.user?.name || "Không xác định" }}</span> 👋
            </h1>
            <p class="text-white/90 mt-2">Tại đây bạn có thể quản lý thông tin cá nhân của mình!</p>
        </div>

        <div
            class="bg-white/90 shadow-lg rounded-2xl overflow-hidden border border-orange-100 hover:shadow-2xl transition-all duration-300">
            <div class="bg-gradient-to-r from-orange-500 to-amber-400 px-5 py-3">
                <h2 class="text-white text-lg font-semibold tracking-wide">Ảnh đại diện</h2>
            </div>

            <div class="flex flex-col md:flex-row items-center gap-8 p-6">
                <div class="flex flex-col items-center gap-3">
                    <ElAvatar :size="120" :src="avatarImage" alt="Ảnh đại diện"
                        class="shadow-md border-2 border-orange-300 hover:scale-105 transition-transform duration-300" />
                </div>

                <div class="flex flex-col gap-3 text-gray-700">
                    <h3 class="font-semibold text-lg">Cập nhật ảnh đại diện</h3>
                    <input ref="fileInputRef" type="file" accept="image/*" @change="onImageChange" class="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold
                     file:bg-orange-100 file:text-orange-600 hover:file:bg-orange-200 transition" />
                    <button v-if="avatarFile"
                        class="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl font-semibold shadow transition-all duration-300"
                        @click="handleUpdateAvatar">
                        Cập nhật
                    </button>
                </div>
            </div>
        </div>

        <div
            class="bg-white/90 shadow-lg rounded-2xl overflow-hidden border border-orange-100 hover:shadow-2xl transition-all duration-300">
            <div class="bg-gradient-to-r from-orange-500 to-amber-400 px-5 py-3">
                <h2 class="text-white text-lg font-semibold tracking-wide">Thông tin cá nhân</h2>
            </div>

            <div class="flex flex-col md:flex-row justify-between p-6 gap-6">
                <div class="space-y-2 text-gray-700 leading-relaxed">
                    <p><span class="font-semibold">Tên:</span> {{ userStore.user?.name || "Không xác định" }}</p>
                    <p><span class="font-semibold">SĐT:</span> {{ userStore.user?.phone || "Không xác định" }}</p>
                    <p><span class="font-semibold">Email:</span> {{ userStore.user?.email || "Không xác định" }}</p>
                    <p><span class="font-semibold">Ngày sinh:</span> {{ formatDateString(userStore.user?.birthday) ||
                        "Không xác định" }}</p>
                </div>

                <div class="flex flex-col gap-3 items-start">
                    <TextButton :onClick="goToEditProfilePage" label="✏️ Chỉnh sửa thông tin" />
                    <TextButton :onClick="goToChangePasswordPage" label="🔒 Đổi mật khẩu" />
                </div>
            </div>
        </div>

        <div
            class="bg-white/90 shadow-lg rounded-2xl overflow-hidden border border-orange-100 hover:shadow-2xl transition-all duration-300">
            <div class="bg-gradient-to-r from-orange-500 to-amber-400 px-5 py-3">
                <h2 class="text-white text-lg font-semibold tracking-wide">Địa chỉ giao hàng</h2>
            </div>

            <div class="p-6 space-y-6">
                <div v-if="addresses.length > 0" class="space-y-3">
                    <div v-for="(address, index) in addresses" :key="index"
                        class="border rounded-xl p-4 flex justify-between items-center hover:shadow-md transition">
                        <div>
                            <p class="font-semibold text-gray-800">
                                {{ address.name }}
                            </p>
                            <p class="text-gray-600 text-sm leading-relaxed">
                                {{ address.detail ? (address.detail + ', ') : '' }}
                                {{ address.street }}, {{ address.ward }}, {{ address.district }},
                                {{ address.province }}
                            </p>
                        </div>
                        <div class="w-[10%]">
                            <DeleteButton label="Xóa" :onClick="() => handleDeleteAddress(address.id)" />
                        </div>
                    </div>
                </div>

                <div v-else class="text-gray-500 italic text-center">
                    Bạn chưa có địa chỉ nào. Hãy thêm địa chỉ mới nhé!
                </div>

                <transition name="fade">
                    <div>
                        <AddressSelector @add-address="handleAddAddress" />
                    </div>
                </transition>
            </div>

        </div>
    </div>
</template>
