<script setup lang="ts">
import TextButton from '../../../components/buttons/TextButton.vue';
import type { User } from '../../../types/user.types';
import { formatDateString } from '../../../utils/time.utils';

const props = defineProps<{
    user: User;
    goToEditProfilePage: () => void;
    goToChangePasswordPage: () => void;
}>();
</script>
<template>
    <div
        class="bg-white/90 shadow-lg rounded-2xl overflow-hidden border border-orange-100 hover:shadow-2xl transition-all duration-300">
        <div class="bg-gradient-to-r from-orange-500 to-amber-400 px-5 py-3">
            <h2 class="text-white text-lg font-semibold tracking-wide">Thông tin cá nhân</h2>
        </div>

        <div class="flex flex-col md:flex-row justify-between p-6 gap-6">
            <div class="space-y-2 text-gray-700 leading-relaxed">
                <p><span class="font-semibold">Tên:</span> {{ user.name }}</p>
                <p><span class="font-semibold">SĐT:</span> {{ user.phone }}</p>
                <p><span class="font-semibold">Email:</span> {{ user.email }}</p>
                <p><span class="font-semibold">Ngày sinh:</span> {{ formatDateString(user.birthday) }}</p>
            </div>

            <div class="flex flex-col gap-3 items-start">
                <TextButton :onClick="props.goToEditProfilePage" label="✏️ Chỉnh sửa thông tin" />
                <TextButton :onClick="props.goToChangePasswordPage" label="🔒 Đổi mật khẩu" />
            </div>
        </div>
    </div>
</template>