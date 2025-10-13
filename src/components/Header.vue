<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElBadge, ElTooltip } from 'element-plus';
import { useUserStore } from '../store/useUserStore.store';
import { Box, ShoppingCartFull } from "@element-plus/icons-vue"
import { notifyError } from '../utils/notification.utils';
import { ROUTE_NAMES } from '../constants/route-names';
import { USER_ROLES } from '../constants/user-roles';
import AvatarDropdown from './AvatarDropdown.vue';

interface HeaderProps {
    role: string;
}
const router = useRouter();

const props = defineProps<HeaderProps>();

const defaultAvatarUrl: string = 'https://res.cloudinary.com/dfsdlsfbv/image/upload/v1747122687/books/mzkfsohlqelvamwm0wzk.jpg';

const userStore = useUserStore();

const menuItems = [
    { id: 'menu-1', key: 'order', label: 'Đặt hàng' },
    { id: 'menu-2', key: 'promo', label: 'Khuyến mãi' },
    { id: 'menu-3', key: 'challenge', label: 'Thử thách' },
    { id: 'menu-4', key: 'about', label: 'Về chúng tôi' },
];

const selectedDiv = ref<string>(menuItems[0].id);
const handleMenuNavigation = (key: string) => {
    const role = userStore.user?.role || "GUEST";

    const routeMap: Record<string, Record<string, string>> = {
        order: {
            GUEST: ROUTE_NAMES.GUEST.HOME,
            USER: ROUTE_NAMES.USER.HOME,
            STAFF: ROUTE_NAMES.STAFF.HOME,
        },
        promo: {
            GUEST: ROUTE_NAMES.GUEST.PROMOTION,
            USER: ROUTE_NAMES.USER.PROMOTION,
            STAFF: ROUTE_NAMES.STAFF.PROMOTION,
        },
        challenge: {
            GUEST: ROUTE_NAMES.GUEST.CHALLENGE,
            USER: ROUTE_NAMES.USER.CHALLENGE,
            STAFF: ROUTE_NAMES.STAFF.CHALLENGE,
        },
        about: {
            GUEST: ROUTE_NAMES.GUEST.ABOUT,
            USER: ROUTE_NAMES.USER.ABOUT,
            STAFF: ROUTE_NAMES.STAFF.ABOUT,
        },
    };

    const targetRoute = routeMap[key]?.[role as keyof typeof USER_ROLES] || null;
    if (targetRoute) {
        router.push({ name: targetRoute });
    } else {
        notifyError("Không tìm thấy trang phù hợp!");
    }
};

const onClickMenuItem = (id: string, key: string) => {
    selectedDiv.value = id;
    handleMenuNavigation(key);
}

const onClickSignUpButton = () => {
    router.push({ name: ROUTE_NAMES.AUTH.SIGN_UP });
}

const onClickSignInButton = () => {
    router.push({ name: ROUTE_NAMES.AUTH.SIGN_IN });
}

function signOut() {
    localStorage.removeItem("token");
    userStore.clearUser();
    router.push({ name: ROUTE_NAMES.GUEST.HOME });
}

function goToProfilePage() {
    switch (userStore.user?.role) {
        case USER_ROLES.USER:
            router.push({ name: ROUTE_NAMES.USER.PROFILE });
            break;
        case USER_ROLES.STAFF:
            router.push({ name: ROUTE_NAMES.STAFF.PROFILE });
            break;
        default:
            notifyError("Tài khoản của bạn không đủ quyền để thực hiện");
    }
}
</script>
<template>
    <header class="w-[80%] mx-auto flex gap-4 border-b border-red-300">

        <div class="w-[10%] flex items-center justify-center">
            <div class="w-[80%]">
                <img src="../assets/img/Aurelion_Shop_Logo.png" alt="Logo cửa hàng">
            </div>
        </div>

        <div class="h-[100px] w-[70%] flex gap-4 items-center text-xl">
            <div v-for="item in menuItems" :key="item.id" :id="item.id"
                :class="['cursor-pointer', selectedDiv === item.id ? 'border-b-4 border-orange-500 text-orange-500' : 'text-gray-700']"
                @click="onClickMenuItem(item.id, item.key)">
                {{ item.label }}
            </div>
        </div>

        <div v-if="props.role === USER_ROLES.USER" class="w-[20%] flex items-center justify-end gap-8">
            <ElBadge :value="30" :max="10">
                <ElTooltip class="box-item" effect="dark" content="Giỏ hàng của tôi" placement="left-start">
                    <el-icon :size="32" @click="() => router.push({ name: ROUTE_NAMES.USER.CART })">
                        <ShoppingCartFull />
                    </el-icon>
                </ElTooltip>
            </ElBadge>
            <AvatarDropdown :avatarUrl="userStore.user?.avatarUrl || defaultAvatarUrl"
                @goToProfilePage="goToProfilePage" @signOut="signOut"></AvatarDropdown>
        </div>
        <div v-else-if="props.role === USER_ROLES.STAFF" class="w-[20%] flex items-center justify-end gap-8">
            <ElBadge :value="30" :max="10">
                <ElTooltip class="box-item" effect="dark" content="Giỏ hàng của tôi" placement="left-start">
                    <el-icon :size="32" @click="() => router.push({ name: ROUTE_NAMES.STAFF.CART })">
                        <ShoppingCartFull />
                    </el-icon>
                </ElTooltip>
            </ElBadge>
            <ElBadge :value="400" :max="50">
                <ElTooltip class="box-item" effect="dark" content="Đơn hàng cần duyệt" placement="left-start">
                    <el-icon :size="32" @click="() => router.push({ name: ROUTE_NAMES.STAFF.ORDER_MANAGEMENT })">
                        <Box />
                    </el-icon>
                </ElTooltip>
            </ElBadge>
            <AvatarDropdown :avatarUrl="userStore.user?.avatarUrl || defaultAvatarUrl"
                @goToProfilePage="goToProfilePage" @signOut="signOut"></AvatarDropdown>
        </div>
        <div v-else class="w-[20%] flex justify-end gap-4">
            <button class="hover:underline hover:text-orange-500" @click="onClickSignUpButton">Đăng ký ngay</button>
            <button class="hover:underline hover:text-orange-500" @click="onClickSignInButton">Đăng nhập</button>
        </div>
    </header>
</template>