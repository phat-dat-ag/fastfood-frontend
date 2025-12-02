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
        isMobileMenuOpen.value = false;
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

function goToChallengeHistoryPage() {
    const role = userStore.user?.role;
    if (role === USER_ROLES.USER)
        router.push({ name: ROUTE_NAMES.USER.CHALLENGE_HISTORY });
    else if (role === USER_ROLES.STAFF)
        router.push({ name: ROUTE_NAMES.STAFF.CHALLENGE_HISTORY });
    else notifyError("Tài khoản của bạn không đủ quyền để thực hiện");
}

const goTo = (routeName: string) => {
    router.push({ name: routeName });
    isMobileMenuOpen.value = false;
};

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

const isMobileMenuOpen = ref(false);
const toggleMobileMenu = () => { isMobileMenuOpen.value = !isMobileMenuOpen.value };
</script>

<template>
    <div v-if="isMobileMenuOpen" class="fixed inset-0 bg-black/20 sm:hidden z-30" @click="isMobileMenuOpen = false">
    </div>
    <header class="sticky top-0 z-50 w-full flex items-center justify-between py-3 px-6
         bg-gradient-to-r from-orange-500 via-red-400 to-orange-600
         shadow-lg shadow-orange-300/40 backdrop-blur-sm">

        <div class="flex items-center gap-3">
            <button @click="toggleMobileMenu" class="p-2 text-white hover:text-gray-200 sm:hidden">
                <svg v-if="!isMobileMenuOpen" xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>

                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            <img src="../assets/img/Aurelion_Shop_Logo.png" alt="Logo"
                class="w-9 h-9 rounded-full ring-2 ring-white/70 shadow-md" />
        </div>

        <nav class="hidden sm:flex flex-1 justify-center gap-10 text-base font-semibold">
            <div v-for="item in menuItems" :key="item.id" @click="navigateMenu(item.id, item.key)" class="cursor-pointer px-2 py-1.5 rounded-lg text-white/90 hover:text-white hover:bg-white/10
                    transition-all duration-300"
                :class="[selectedMenu === item.id ? 'text-white font-bold bg-white/15 shadow-md' : '']">
                {{ item.label }}
            </div>
        </nav>

        <div class="flex items-center gap-5">
            <template v-if="props.role === USER_ROLES.USER || props.role === USER_ROLES.STAFF">
                <div class="hidden sm:flex items-center gap-5">
                    <template v-for="item in userIcons" :key="item.route">
                        <ElTooltip :content="item.tooltip" placement="bottom">
                            <el-icon :size="26" class="cursor-pointer text-white/90 hover:text-white"
                                @click="() => goTo(item.route)">
                                <component :is="item.icon" />
                            </el-icon>
                        </ElTooltip>
                    </template>
                </div>

                <AvatarDropdown :avatarUrl="userStore.user?.avatarUrl || defaultAvatarUrl"
                    @go-to-profile-page="goToProfilePage" @go-to-order-history-page="goToOrderHistoryPage"
                    @go-to-challenge-history-page="goToChallengeHistoryPage" @signOut="signOut"
                    class="w-9 h-9 rounded-full ring-2 ring-white/70 shadow-md cursor-pointer" />
            </template>

            <template v-else>
                <div class="hidden sm:flex flex-col lg:flex-row gap-2">
                    <button @click="() => goTo(ROUTE_NAMES.AUTH.SIGN_UP)"
                        class="hidden sm:block px-4 py-1.5 border border-white/70 text-white rounded-lg hover:bg-white hover:text-orange-600">
                        Đăng ký
                    </button>
                    <button @click="() => goTo(ROUTE_NAMES.AUTH.SIGN_IN)"
                        class="hidden sm:block px-4 py-1.5 bg-white text-orange-600 rounded-lg hover:bg-orange-100">
                        Đăng nhập
                    </button>
                </div>
            </template>
        </div>
    </header>

    <div v-if="isMobileMenuOpen"
        class="fixed top-[68px] left-0 sm:hidden z-50 w-full bg-orange-600/95 shadow-lg flex flex-col gap-2 px-4 py-3">
        <div v-for="item in menuItems" :key="item.id" @click="navigateMenu(item.id, item.key)"
            class="text-white font-semibold py-2 px-3 rounded hover:bg-white/10">
            {{ item.label }}
        </div>

        <template v-if="props.role === USER_ROLES.USER || props.role === USER_ROLES.STAFF">
            <div class="flex items-center gap-4 mt-3">
                <component v-for="item in userIcons" :is="item.icon" :key="item.route" class="text-white h-7 w-7"
                    @click="() => goTo(item.route)" />
            </div>
        </template>

        <template v-else>
            <button @click="() => goTo(ROUTE_NAMES.AUTH.SIGN_UP)"
                class="w-full bg-white text-orange-600 py-2 rounded-lg font-bold mt-2">
                Đăng ký
            </button>
            <button @click="() => goTo(ROUTE_NAMES.AUTH.SIGN_IN)"
                class="w-full bg-orange-100 text-orange-700 py-2 rounded-lg font-bold">
                Đăng nhập
            </button>
        </template>
    </div>
</template>
