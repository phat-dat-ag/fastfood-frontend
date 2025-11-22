<script setup lang="ts">
import { useRouter } from 'vue-router';
import { STORE_LOCATION } from '../constants/location-store';
import { useUserStore } from '../store/useUserStore.store';
import { USER_ROLES } from '../constants/user-roles';
import { ROUTE_NAMES } from '../constants/route-names';
import { notifyError } from '../utils/notification.utils';

const FOOTER_LINKS = {
    INFORMATION: {
        title: "Thông tin",
        items: [
            { label: "Tin tức", routeKey: null },
            { label: "Khuyến mãi", routeKey: null },
            { label: "Tuyển dụng", routeKey: null },
            { label: "Nhượng quyền", routeKey: null },
            { label: "Đăng ký chào hàng", routeKey: null },
        ],
    },
    SUPPORT: {
        title: "Hỗ trợ khách hàng",
        items: [
            { label: "Điều khoản sử dụng", routeKey: null },
            { label: "Chính sách bảo mật", routeKey: null },
            { label: "Chính sách giao hàng", routeKey: "DELIVERY_POLILY" },
            { label: "Tham gia thử thách", routeKey: "CHALLENGE_POLICY" },
            { label: "Chính sách thành viên", routeKey: null },
        ],
    },
    CHANNELS: {
        title: "Kênh liên hệ",
        items: [{ label: "Facebook", routeKey: null },
        { label: "Instagram", routeKey: null },
        { label: "Zalo", routeKey: null },],
    },
} as const;

const userStore = useUserStore();

const router = useRouter();

function goToPage(routeKey: string | null) {
    if (!routeKey) return;

    const role = userStore.user?.role;
    let targetRouteName = null;

    if (role === USER_ROLES.USER) {
        targetRouteName = ROUTE_NAMES.USER[routeKey as keyof typeof ROUTE_NAMES.USER];
    } else if (role === USER_ROLES.STAFF) {
        targetRouteName = ROUTE_NAMES.STAFF[routeKey as keyof typeof ROUTE_NAMES.STAFF];
    } else if (role === USER_ROLES.GUEST) {
        targetRouteName = ROUTE_NAMES.GUEST[routeKey as keyof typeof ROUTE_NAMES.GUEST];
    }
    if (!targetRouteName) {
        notifyError("Không tìm thấy trang phù hợp cho vai trò của bạn");
        return;
    }

    router.push({ name: targetRouteName });
}

</script>
<template>
    <footer class="mt-12 bg-gradient-to-r from-orange-500 via-red-400 to-orange-600 text-white">
        <div class="w-[85%] mx-auto py-12 grid grid-cols-1 md:grid-cols-5 gap-10 items-start">
            <div
                class="md:col-span-2 flex flex-col items-center md:items-start gap-4 transition-transform duration-500 hover:scale-[1.02]">
                <div class="flex items-center gap-4">
                    <img src="../assets/img/Aurelion_Shop_Logo.png" alt="Logo"
                        class="w-20 h-20 object-contain rounded-full ring-2 ring-white/60 shadow-md hover:shadow-lg hover:ring-white transition-all duration-500" />
                    <p
                        class="text-lg font-bold text-white/90 leading-relaxed text-center md:text-left hover:text-white transition-colors duration-300">
                        Aurelion Shop – hương vị tuyệt hảo
                    </p>
                </div>

                <div class="text-sm text-white/90 mt-2 text-center md:text-left space-y-1 leading-relaxed">
                    <p>{{ STORE_LOCATION.detail }}</p>
                    <p>
                        {{ STORE_LOCATION.street }}, {{ STORE_LOCATION.ward }},
                        {{ STORE_LOCATION.district }}, {{ STORE_LOCATION.province }}
                    </p>
                </div>
            </div>

            <div v-for="section in FOOTER_LINKS" :key="section.title"
                class="space-y-3 text-center md:text-left transform transition-all duration-500 hover:-translate-y-1">
                <h2
                    class="text-lg font-bold uppercase tracking-wide border-b border-white/30 pb-1 inline-block hover:text-yellow-200 transition-colors duration-300">
                    {{ section.title }}
                </h2>
                <ul class="space-y-1 text-sm text-white/90">
                    <li v-for="item in section.items" :key="item.label" @click="goToPage(item.routeKey)"
                        class="cursor-default hover:text-yellow-100 hover:translate-x-1 transition-all duration-300">
                        {{ item.label }}
                    </li>
                </ul>
            </div>
        </div>

        <div class="border-t border-white/30"></div>

        <div
            class="text-center text-sm py-4 bg-orange-700/20 backdrop-blur-sm hover:bg-orange-700/30 transition-colors duration-500">
            © 2025 <span class="font-semibold">Aurelion Shop</span>. All Rights Reserved.
            <span class="text-white/80">Site by Nguyen Phat Dat</span>
        </div>
    </footer>
</template>