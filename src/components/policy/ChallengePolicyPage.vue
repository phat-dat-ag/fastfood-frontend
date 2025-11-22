<script setup lang="ts">
import { Timer, Check, Close, Warning, Star, Ticket } from "@element-plus/icons-vue";

const challengePolicyGroups = [
    {
        title: "Số lần tham gia",
        items: [
            { icon: Timer, text: "Mỗi khách hàng có thể tham gia tối đa 3 lần mỗi ngày." },
        ],
    },
    {
        title: "Điều kiện & thời gian thử thách",
        items: [
            { icon: Star, text: "Mỗi thử thách có thời gian giới hạn và số điểm tối thiểu để nhận thưởng khác nhau." },
            { icon: Warning, text: "Khi còn 10 giây làm bài, hệ thống sẽ cảnh báo sắp hết giờ." },
            { icon: Close, text: "Khi hết giờ, hệ thống sẽ tự động nộp bài." },
            { icon: Check, text: "Các câu đã chọn không thể xóa đáp án, nhưng có thể đổi lựa chọn trước khi nộp." },
            { icon: Close, text: "Khách hàng có quyền không chọn đáp án nếu muốn." },
        ],
    },
    {
        title: "Mã khuyến mãi",
        items: [
            { icon: Ticket, text: "Mỗi mã khuyến mãi nhận được là ngẫu nhiên." },
            { icon: Check, text: "Khách hàng có thể nhập mã để sử dụng cho đơn hàng trong vòng 1 tháng kể từ khi nhận." },
            { icon: Close, text: "Mỗi bài làm chỉ cho phép nhận 1 mã duy nhất." },
            { icon: Warning, text: "Mã có thể được sử dụng bởi khách hàng khác nếu họ biết mã đó." },
        ],
    },
    {
        title: "Xem lại bài làm & góp ý",
        items: [
            { icon: Check, text: "Sau khi hoàn thành, khách hàng có thể xem lại bài làm." },
            { icon: Timer, text: "Trong vòng 1 ngày, khách có thể xem đáp án đúng/sai và gửi góp ý cho trò chơi." },
            { icon: Close, text: "Hết 1 ngày, khách chỉ được xem lại các câu đã chọn mà không biết đúng/sai, và không thể gửi góp ý nữa." },
        ],
    },
];
</script>

<template>
    <div class="min-h-screen bg-orange-50 p-4 md:p-8 lg:p-16">
        <h1 class="text-3xl md:text-4xl font-bold text-orange-600 text-center mb-8">
            Chính sách Tham Gia Thử Thách – Aurelion Shop
        </h1>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <div v-for="group in challengePolicyGroups" :key="group.title"
                class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                <h2 class="text-xl font-semibold text-orange-500 mb-4 border-b border-orange-200 pb-2">
                    {{ group.title }}
                </h2>
                <ul class="space-y-3">
                    <li v-for="item in group.items" :key="item.text" class="flex items-center gap-3">
                        <component :is="item.icon" class="text-orange-400 flex-shrink-0 w-5 h-5 md:w-6 md:h-6" />
                        <p class="text-gray-700 text-sm md:text-base leading-relaxed">{{ item.text }}</p>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<style scoped>
@media (max-width: 640px) {
    h1 {
        font-size: 2xl;
    }

    p {
        font-size: 14px;
    }
}
</style>
