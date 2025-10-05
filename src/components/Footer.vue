<script setup lang="ts">
const FOOTER_LINKS = {
    INFORMATION: {
        title: "Thông tin",
        items: [
            "Tin tức",
            "Khuyến mãi",
            "Tuyển dụng",
            "Nhượng quyền",
            "Đăng ký chào hàng",
        ],
    },
    SUPPORT: {
        title: "Hỗ trợ khách hàng",
        items: [
            "Điều khoản sử dụng",
            "Chính sách bảo mật",
            "Chính sách giao hàng",
            "Chăm sóc khách hàng",
            "Chính sách thành viên",
        ],
    },
    CHANNELS: {
        title: "Kênh liên hệ",
        items: ["Facebook", "Instagram", "Zalo",],
    },
} as const;

</script>
<template>
    <footer>
        <div class="bg-orange-200">
            <div class="w-[80%] mx-auto py-4 grid grid-cols-4">
                <div class="flex items-center justify-center">
                    <div class="w-[60%]">
                        <img src="../assets/img/Aurelion_Shop_Logo.png" alt="">
                    </div>
                </div>

                <div v-for="section in FOOTER_LINKS" :key="section.title" class="mt-4">
                    <h1 class="text-xl font-bold">{{ section.title }}</h1>
                    <p v-for="item in section.items" :key="item">{{ item }}</p>
                </div>
            </div>
        </div>

        <div class="bg-orange-300">
            <div class="w-[80%] mx-auto py-4 text-center">
                2025 Aurelion Shop All Rights Reserved Site by Nguyen Phat Dat
            </div>
        </div>
    </footer>
</template>