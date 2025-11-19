<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../store/useUserStore.store";
import { ROUTE_NAMES } from "../constants/route-names";

import {
    Menu,
    Fold,
    Expand,
    User,
    Goods,
    Tickets,
    List,
    Document,
    DataAnalysis,
    SwitchButton,
    PictureFilled,
} from "@element-plus/icons-vue";

const router = useRouter();
const userStore = useUserStore();

const isCollapsed = ref(false);

function toggleCollapse() {
    isCollapsed.value = !isCollapsed.value;
}

function signOut() {
    userStore.clearUser();
    localStorage.removeItem("token");
    router.push({ name: ROUTE_NAMES.GUEST.HOME });
}
</script>
<template>
    <div class="flex h-screen bg-gray-100 overflow-hidden">
        <aside :class="[
            'bg-white h-full flex flex-col transition-all duration-300 border-r',
            isCollapsed ? 'w-20' : 'w-64'
        ]">
            <div class="flex items-center justify-between px-4 h-16 border-b shrink-0">
                <div class="flex items-center gap-2">
                    <el-icon>
                        <Menu />
                    </el-icon>
                    <span v-if="!isCollapsed" class="text-lg font-bold text-blue-600">Quản trị viên</span>
                </div>
                <button class="p-2 rounded hover:bg-gray-100 transition" @click="toggleCollapse"
                    :title="isCollapsed ? 'Mở rộng menu' : 'Thu gọn menu'">
                    <el-icon>
                        <component :is="isCollapsed ? Expand : Fold" />
                    </el-icon>
                </button>
            </div>

            <div class="flex-1 overflow-y-auto">
                <el-menu default-active="0" :collapse="isCollapsed" class="border-none" :collapse-transition="false">
                    <el-menu-item index="0" @click="router.push({ name: ROUTE_NAMES.ADMIN.DASHBOARD })">
                        <el-icon>
                            <DataAnalysis />
                        </el-icon>
                        <template #title>Xem thống kê</template>
                    </el-menu-item>

                    <el-sub-menu index="1">
                        <template #title>
                            <el-icon>
                                <User />
                            </el-icon>
                            <span>Quản lý tài khoản</span>
                        </template>
                        <el-menu-item index="1-1" @click="router.push({ name: ROUTE_NAMES.ADMIN.CUSTOMER_MANAGEMENT })">
                            Khách hàng
                        </el-menu-item>
                        <el-menu-item index="1-2" @click="router.push({ name: ROUTE_NAMES.ADMIN.STAFF_MANAGEMENT })">
                            Nhân viên
                        </el-menu-item>
                    </el-sub-menu>

                    <el-menu-item index="2" @click="router.push({ name: ROUTE_NAMES.ADMIN.CATEGORY_MANAGEMENT })">
                        <el-icon>
                            <Goods />
                        </el-icon>
                        <template #title>Danh mục sản phẩm</template>
                    </el-menu-item>

                    <el-sub-menu index="4">
                        <template #title>
                            <el-icon>
                                <Tickets />
                            </el-icon>
                            <span>Mã khuyến mãi</span>
                        </template>
                        <el-menu-item index="4-1"
                            @click="router.push({ name: ROUTE_NAMES.ADMIN.PROMOTION_CATEGORY_MANAGEMENT })">
                            Theo danh mục
                        </el-menu-item>
                        <el-menu-item index="4-2"
                            @click="router.push({ name: ROUTE_NAMES.ADMIN.PROMOTION_PRODUCT_MANAGEMENT })">
                            Theo sản phẩm
                        </el-menu-item>
                        <el-menu-item index="4-3"
                            @click="router.push({ name: ROUTE_NAMES.ADMIN.PROMOTION_ORDER_MANAGEMENT })">
                            Cho đơn hàng
                        </el-menu-item>
                    </el-sub-menu>

                    <el-menu-item index="5" @click="router.push({ name: ROUTE_NAMES.ADMIN.TOPIC_MANAGEMENT })">
                        <el-icon>
                            <Document />
                        </el-icon>
                        <template #title>Chủ đề trò chơi</template>
                    </el-menu-item>

                    <el-menu-item index="6" @click="router.push({ name: ROUTE_NAMES.ADMIN.ORDER_MANAGEMENT })">
                        <el-icon>
                            <List />
                        </el-icon>
                        <template #title>Đơn hàng</template>
                    </el-menu-item>

                    <el-menu-item index="7" @click="router.push({ name: ROUTE_NAMES.ADMIN.REVIEW_MANAGEMENT })">
                        <el-icon>
                            <Document />
                        </el-icon>
                        <template #title>Đánh giá</template>
                    </el-menu-item>

                    <el-menu-item index="8" @click="router.push({ name: ROUTE_NAMES.ADMIN.QUIZ_FEEDBACK_MANAGEMENT })">
                        <el-icon>
                            <Document />
                        </el-icon>
                        <template #title>Góp ý trò chơi</template>
                    </el-menu-item>

                    <el-sub-menu index="9">
                        <template #title>
                            <el-icon>
                                <PictureFilled />
                            </el-icon>
                            <span>Ảnh trên hệ thống</span>
                        </template>
                        <el-menu-item index="9-1"
                            @click="router.push({ name: ROUTE_NAMES.ADMIN.ABOUT_US_IMAGE_MANAGEMENT })">
                            Trang Về chúng tôi
                        </el-menu-item>
                        <el-menu-item index="9-2"
                            @click="router.push({ name: ROUTE_NAMES.ADMIN.CHALLENGE_INTRODUCTION_IMAGE_MANAGEMENT })">
                            Trang Thử thách
                        </el-menu-item>
                    </el-sub-menu>
                </el-menu>
            </div>

            <div class="p-4 border-t shrink-0">
                <button
                    class="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200 font-semibold flex items-center justify-center gap-2"
                    @click="signOut">
                    <el-icon>
                        <SwitchButton />
                    </el-icon>
                    <span v-if="!isCollapsed">Đăng xuất</span>
                </button>
            </div>
        </aside>

        <div class="flex-1 flex flex-col overflow-hidden">
            <header class="h-16 bg-white border-b px-6 z-10 flex justify-between items-center">
                <h1 class="text-xl font-semibold text-gray-800">Bảng điều khiển quản trị</h1>
                <p class="text-sm text-gray-500">Xin chào, {{ userStore.user?.name || "Quản trị viên" }}</p>
            </header>

            <main class="flex-1 overflow-y-auto bg-orange-50">
                <router-view></router-view>
            </main>
        </div>
    </div>
</template>
<style scoped>
.el-menu {
    border-right: none;
}

.el-menu-item,
.el-sub-menu__title {
    display: flex;
    align-items: center;
}
</style>