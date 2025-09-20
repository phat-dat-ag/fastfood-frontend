<script setup lang="ts">
const informations = [
    "Tin tức",
    "Khuyến mãi",
    "Tuyển dụng",
    "Nhượng quyền",
    "Đăng ký chào hàng",
]

const supports = [
    "Điều khoản sử dụng",
    "Chính sách bảo mật",
    "Chính sách giao hàng",
    "Chăm sóc khách hàng",
    "Chính sách thành viên",
]

const channels = [
    "Facebook",
    "Instagram",
    "Zalo",
]
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
                <div class="mt-4">
                    <h1 class="text-xl font-bold">Thông tin</h1>
                    <p v-for="(infor, indx) of informations" :key="indx">{{ infor }}</p>
                </div>
                <div class="mt-4">
                    <h1 class="text-xl font-bold">Hỗ trợ</h1>
                    <p v-for="(support, indx) of supports" :key="indx">{{ support }}</p>
                </div>
                <div class="mt-4">
                    <h1 class="text-xl font-bold">Liên hệ chúng tôi</h1>
                    <p v-for="(channel, indx) in channels" :key="indx">{{ channel }}</p>
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