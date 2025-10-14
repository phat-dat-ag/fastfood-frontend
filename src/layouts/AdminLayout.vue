<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useUserStore } from '../store/useUserStore.store';
import { ROUTE_NAMES } from '../constants/route-names';

const router = useRouter();
const userStore = useUserStore();

function signOut() {
    userStore.clearUser();
    localStorage.removeItem("token");
    router.push({ name: ROUTE_NAMES.GUEST.HOME });
}
</script>
<template>
    <div class="flex">
        <div>
            <el-menu default-active="0">
                <el-menu-item index="0">Xem thống kê</el-menu-item>
                <el-sub-menu index="1">
                    <template #title>Quản lý tài khoản</template>
                    <el-menu-item index="1-1" @click="router.push({ name: ROUTE_NAMES.ADMIN.CUSTOMER_MANAGEMENT })">
                        Khách hàng
                    </el-menu-item>
                    <el-menu-item index="1-2" @click="router.push({ name: ROUTE_NAMES.ADMIN.CUSTOMER_MANAGEMENT })">
                        Nhân viên
                    </el-menu-item>
                </el-sub-menu>
                <el-menu-item index="2" @click="router.push({ name: ROUTE_NAMES.ADMIN.CATEGORY_MANAGEMENT })">
                    Quản lý danh mục sản phẩm
                </el-menu-item>
                <el-menu-item index="3" @click="router.push({ name: ROUTE_NAMES.ADMIN.PRODUCT_MANAGEMENT })">
                    Quản lý sản phẩm
                </el-menu-item>
                <el-sub-menu index="4">
                    <template #title>Quản lý mã khuyến mãi</template>
                    <el-menu-item index="4-1"
                        @click="router.push({ name: ROUTE_NAMES.ADMIN.PROMOTION_CATEGORY_MANAGEMENT })">
                        Theo danh mục
                    </el-menu-item>
                    <el-menu-item index="4-2"
                        @click="router.push({ name: ROUTE_NAMES.ADMIN.PROMOTION_PRODUCT_MANAGEMENT })">
                        Theo sản phẩm
                    </el-menu-item>
                </el-sub-menu>
                <el-menu-item index="5">Quản lý trò chơi</el-menu-item>
                <el-menu-item index="6">Quản lý đơn hàng</el-menu-item>
                <el-menu-item index="7">Xem phản ánh khách hàng</el-menu-item>
            </el-menu>
            <div>
                <button
                    class="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200 font-semibold"
                    @click="signOut">
                    Đăng xuất
                </button>
            </div>
        </div>
        <div class="grow">
            <main class="w-[96%] my-4 mx-auto">
                <router-view></router-view>
            </main>
        </div>
    </div>
</template>