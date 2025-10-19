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
    <header class="sticky top-0 z-50 w-[100%] mx-auto flex items-center justify-between py-3 px-6
           bg-gradient-to-r from-orange-500 via-red-400 to-orange-600
           shadow-lg shadow-orange-300/40 backdrop-blur-sm
           transition-all duration-300 hover:shadow-orange-400/60">

        <div class="flex items-center gap-2 w-[15%]">
            <img src="../assets/img/Aurelion_Shop_Logo.png" alt="Logo cửa hàng"
                class="w-9 h-9 object-contain rounded-full ring-2 ring-white/70 shadow-md hover:scale-105 transition-transform duration-300" />
            <h1 class="text-lg font-bold text-white tracking-wide uppercase drop-shadow-sm">
                Aurelion
            </h1>
        </div>

        <nav class="flex-1 flex justify-center gap-10 text-base font-semibold tracking-wide">
            <div v-for="item in menuItems" :key="item.id" :id="item.id" :class="[
                'cursor-pointer relative transition-all duration-300 px-2 py-1.5 rounded-lg text-white/90 hover:text-white hover:bg-white/10',
                selectedDiv === item.id ? 'text-white font-bold bg-white/15 shadow-md' : ''
            ]" @click="onClickMenuItem(item.id, item.key)">
                {{ item.label }}
                <span v-if="selectedDiv === item.id"
                    class="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-[40%] h-[2px] bg-white rounded-full"></span>
            </div>
        </nav>

        <div v-if="props.role === USER_ROLES.USER" class="flex items-center justify-end gap-8 w-[20%]">
            <ElBadge :value="30" :max="10">
                <ElTooltip effect="dark" content="Giỏ hàng của tôi" placement="bottom">
                    <el-icon :size="26" class="cursor-pointer text-white/90 hover:text-white transition-colors"
                        @click="() => router.push({ name: ROUTE_NAMES.USER.CART })">
                        <ShoppingCartFull />
                    </el-icon>
                </ElTooltip>
            </ElBadge>

            <AvatarDropdown :avatarUrl="userStore.user?.avatarUrl || defaultAvatarUrl"
                @goToProfilePage="goToProfilePage" @signOut="signOut"
                class="w-9 h-9 rounded-full ring-2 ring-white/70 hover:ring-white transition-all duration-300 shadow-md" />
        </div>

        <div v-else-if="props.role === USER_ROLES.STAFF" class="flex items-center justify-end gap-8 w-[20%]">
            <ElBadge :value="30" :max="10">
                <ElTooltip effect="dark" content="Giỏ hàng của tôi" placement="bottom">
                    <el-icon :size="26" class="cursor-pointer text-white/90 hover:text-white transition-colors"
                        @click="() => router.push({ name: ROUTE_NAMES.STAFF.CART })">
                        <ShoppingCartFull />
                    </el-icon>
                </ElTooltip>
            </ElBadge>

            <ElBadge :value="400" :max="50">
                <ElTooltip effect="dark" content="Đơn hàng cần duyệt" placement="bottom">
                    <el-icon :size="26" class="cursor-pointer text-white/90 hover:text-white transition-colors"
                        @click="() => router.push({ name: ROUTE_NAMES.STAFF.ORDER_MANAGEMENT })">
                        <Box />
                    </el-icon>
                </ElTooltip>
            </ElBadge>

            <AvatarDropdown :avatarUrl="userStore.user?.avatarUrl || defaultAvatarUrl"
                @goToProfilePage="goToProfilePage" @signOut="signOut"
                class="w-9 h-9 rounded-full ring-2 ring-white/70 hover:ring-white transition-all duration-300 shadow-md" />
        </div>

        <div v-else class="flex items-center justify-end gap-4 w-[20%]">
            <button class="px-4 py-1.5 border border-white/70 text-white font-semibold rounded-lg
               hover:bg-white hover:text-orange-600 transition-all duration-300 shadow-sm hover:shadow-md"
                @click="onClickSignUpButton">
                Đăng ký
            </button>

            <button class="px-4 py-1.5 bg-white text-orange-600 font-semibold rounded-lg
               hover:bg-orange-100 transition-all duration-300 shadow-sm hover:shadow-md" @click="onClickSignInButton">
                Đăng nhập
            </button>
        </div>
    </header>
</template>

<style scoped>
@keyframes slideIn {
    from {
        transform: scaleX(0);
        opacity: 0;
    }

    to {
        transform: scaleX(1);
        opacity: 1;
    }
}
</style>
