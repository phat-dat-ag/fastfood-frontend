<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { ElTooltip } from "element-plus";
import { useUserStore } from "../store/useUserStore.store";
import { Box, ShoppingCartFull, Van } from "@element-plus/icons-vue";
import { notifyError } from "../utils/notification.utils";
import { ROUTE_NAMES } from "../constants/route-names";
import { USER_ROLES } from "../constants/user-roles";
import AvatarDropdown from "./AvatarDropdown.vue";

interface HeaderProps {
    role: string;
}
const props = defineProps<HeaderProps>();
const router = useRouter();
const userStore = useUserStore();

const defaultAvatarUrl =
    "https://res.cloudinary.com/dfsdlsfbv/image/upload/v1747122687/books/mzkfsohlqelvamwm0wzk.jpg";

const menuItems = [
    { id: "menu-1", key: "order", label: "Đặt hàng" },
    { id: "menu-2", key: "promo", label: "Khuyến mãi" },
    { id: "menu-3", key: "challenge", label: "Thử thách" },
    { id: "menu-4", key: "about", label: "Về chúng tôi" },
];

const selectedMenu = ref(menuItems[0].id);

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


function navigateMenu(id: string, key: string) {
    selectedMenu.value = id;
    const role = userStore.user?.role || "GUEST";
    const targetRoute = routeMap[key]?.[role];
    if (targetRoute) {
        router.push({ name: targetRoute });
    } else {
        notifyError("Không tìm thấy trang phù hợp!");
    }
}

function signOut() {
    localStorage.removeItem("token");
    userStore.clearUser();
    router.push({ name: ROUTE_NAMES.GUEST.HOME });
}

function goToProfilePage() {
    const role = userStore.user?.role;
    if (role === USER_ROLES.USER)
        router.push({ name: ROUTE_NAMES.USER.PROFILE });
    else if (role === USER_ROLES.STAFF)
        router.push({ name: ROUTE_NAMES.STAFF.PROFILE });
    else notifyError("Tài khoản của bạn không đủ quyền để thực hiện");
}

function goToOrderHistoryPage() {
    const role = userStore.user?.role;
    if (role === USER_ROLES.USER)
        router.push({ name: ROUTE_NAMES.USER.ORDER_HISTORY });
    else if (role === USER_ROLES.STAFF)
        router.push({ name: ROUTE_NAMES.STAFF.ORDER_HISTORY });
    else notifyError("Tài khoản của bạn không đủ quyền để thực hiện");
}

const goTo = (routeName: string) => router.push({ name: routeName });

interface UserIcon {
    icon: any;
    tooltip: string;
    route: string;
}

const userIcons = computed<UserIcon[]>(() => {
    const role = props.role;

    const icons: UserIcon[] = [
        {
            icon: ShoppingCartFull,
            tooltip: "Giỏ hàng của tôi",
            route:
                role === USER_ROLES.STAFF
                    ? ROUTE_NAMES.STAFF.CART
                    : ROUTE_NAMES.USER.CART,
        },
        {
            icon: Van,
            tooltip: "Đơn hàng đang giao",
            route:
                role === USER_ROLES.STAFF
                    ? ROUTE_NAMES.STAFF.ORDER_TRACKING
                    : ROUTE_NAMES.USER.ORDER_TRACKING,
        },
    ];

    if (role === USER_ROLES.STAFF) {
        icons.push({
            icon: Box,
            tooltip: "Đơn hàng cần duyệt",
            route: ROUTE_NAMES.STAFF.ORDER_MANAGEMENT,
        });
    }

    return icons;
});

</script>

<template>
    <header class="sticky top-0 z-50 w-full mx-auto flex items-center justify-between py-3 px-6
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
            <div v-for="item in menuItems" :key="item.id" :id="item.id" @click="navigateMenu(item.id, item.key)" :class="[
                'cursor-pointer relative transition-all duration-300 px-2 py-1.5 rounded-lg text-white/90 hover:text-white hover:bg-white/10',
                selectedMenu === item.id ? 'text-white font-bold bg-white/15 shadow-md' : ''
            ]">
                {{ item.label }}
                <span v-if="selectedMenu === item.id"
                    class="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-[40%] h-[2px] bg-white rounded-full"></span>
            </div>
        </nav>

        <div class="flex items-center justify-end gap-6 w-[20%]">
            <template v-if="props.role === USER_ROLES.USER || props.role === USER_ROLES.STAFF">
                <template v-for="(item) in userIcons" :key="index">
                    <ElTooltip :content="item.tooltip" placement="bottom">
                        <el-icon :size="26" class="cursor-pointer text-white/90 hover:text-white transition-colors"
                            @click="() => goTo(item.route)">
                            <component :is="item.icon" />
                        </el-icon>
                    </ElTooltip>
                </template>

                <AvatarDropdown :avatarUrl="userStore.user?.avatarUrl || defaultAvatarUrl"
                    @go-to-profile-page="goToProfilePage" @go-to-order-history-page="goToOrderHistoryPage"
                    @signOut="signOut"
                    class="w-9 h-9 rounded-full ring-2 ring-white/70 hover:ring-white transition-all duration-300 shadow-md" />
            </template>

            <template v-else>
                <button class="px-4 py-1.5 border border-white/70 text-white font-semibold rounded-lg
               hover:bg-white hover:text-orange-600 transition-all duration-300 shadow-sm hover:shadow-md"
                    @click="() => goTo(ROUTE_NAMES.AUTH.SIGN_UP)">
                    Đăng ký
                </button>
                <button class="px-4 py-1.5 bg-white text-orange-600 font-semibold rounded-lg
               hover:bg-orange-100 transition-all duration-300 shadow-sm hover:shadow-md"
                    @click="() => goTo(ROUTE_NAMES.AUTH.SIGN_IN)">
                    Đăng nhập
                </button>
            </template>
        </div>
    </header>
</template>
