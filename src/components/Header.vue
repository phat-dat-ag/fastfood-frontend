<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { STAFF, USER } from '../constants/user-role.constant';
import { ElBadge, ElDropdown, ElTooltip } from 'element-plus';
import { useUserStore } from '../store/useUserStore';
import { Box, ShoppingCartFull } from "@element-plus/icons-vue"
import { notifyError } from '../utils/notification.utils';

interface HeaderProps {
    role: string;
}
const router = useRouter();

const props = defineProps<HeaderProps>();

const defaultAvatarUrl: string = 'https://res.cloudinary.com/dfsdlsfbv/image/upload/v1747122687/books/mzkfsohlqelvamwm0wzk.jpg';

const userStore = useUserStore();

const menuItems = [
    { id: 'menu-1', label: 'Đặt hàng' },
    { id: 'menu-2', label: 'Khuyến mãi' },
    { id: 'menu-3', label: 'Thử thách' },
    { id: 'menu-4', label: 'Về chúng tôi' }
];

const selectedDiv = ref<string>("");
const onClickMenuItem = (id: string) => {
    selectedDiv.value = id;
}

// GUEST
const onClickSignUpButton = () => {
    router.push({ name: "SignUp" });
}

const onClickSignInButton = () => {
    router.push({ name: "SignIn" });
}

function signOut() {
    localStorage.removeItem("token");
    userStore.clearUser();
    router.push({ name: "GuestPage" });
}

// USER AND STAFF

function goToAccountPage() {
    switch (userStore.user?.role) {
        case USER:
            router.push({ name: "UserAccount" });
            break;
        case STAFF:
            router.push({ name: "StaffAccount" });
            break;
        default:
            notifyError("Lỗi", "Tài khoản của bạn không đủ quyền để thực hiện");
    }
}
</script>
<template>
    <header class="w-[80%] mx-auto flex gap-4 border-b border-red-300">
        <!-- Logo -->
        <div class="w-[10%] flex items-center justify-center">
            <div class="w-[80%]">
                <img src="../assets/img/Aurelion_Shop_Logo.png" alt="Logo cửa hàng">
            </div>
        </div>
        <!-- Menu -->
        <div class="h-[100px] w-[70%] flex gap-4 items-center text-xl">
            <div v-for="item in menuItems" :key="item.id" :id="item.id"
                :class="['cursor-pointer', selectedDiv === item.id ? 'border-b-4 border-orange-500 text-orange-500' : 'text-gray-700']"
                @click="onClickMenuItem(item.id)">
                {{ item.label }}
            </div>
        </div>
        <!-- Avatar or Sign up, Sign in -->
        <div v-if="props.role === USER" class="w-[20%] flex items-center justify-end gap-8">
            <ElBadge :value="30" :max="10">
                <ElTooltip class="box-item" effect="dark" content="Giỏ hàng của tôi" placement="left-start">
                    <el-icon :size="32">
                        <ShoppingCartFull />
                    </el-icon>
                </ElTooltip>
            </ElBadge>
            <ElDropdown>
                <el-avatar :size="80" :src="userStore.user?.avatarUrl || defaultAvatarUrl" />
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item @click="goToAccountPage">Thông tin cá nhân</el-dropdown-item>
                        <el-dropdown-item>Lịch sử mua hàng</el-dropdown-item>
                        <el-dropdown-item>Lịch sử thách thức</el-dropdown-item>
                        <el-dropdown-item @click="signOut">Đăng xuất</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </ElDropdown>
        </div>
        <div v-else-if="props.role === STAFF" class="w-[20%] flex items-center justify-end gap-8">
            <ElBadge :value="400" :max="50">
                <ElTooltip class="box-item" effect="dark" content="Đơn hàng cần duyệt" placement="left-start">
                    <el-icon :size="32">
                        <Box />
                    </el-icon>
                </ElTooltip>
            </ElBadge>
            <ElDropdown>
                <el-avatar :src="userStore.user?.avatarUrl || defaultAvatarUrl" />
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item @click="goToAccountPage">Thông tin cá nhân</el-dropdown-item>
                        <el-dropdown-item>Lịch sử mua hàng</el-dropdown-item>
                        <el-dropdown-item>Lịch sử thách thức</el-dropdown-item>
                        <el-dropdown-item @click="signOut">Đăng xuất</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </ElDropdown>
        </div>
        <div v-else class="w-[20%] flex justify-end gap-4">
            <button class="hover:underline hover:text-orange-500" @click="onClickSignUpButton">Đăng ký ngay</button>
            <button class="hover:underline hover:text-orange-500" @click="onClickSignInButton">Đăng nhập</button>
        </div>
    </header>
</template>