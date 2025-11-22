<script setup lang="ts">
import { Location, Money, Timer, Warning, Check, Close, ShoppingCart } from "@element-plus/icons-vue";

const policyGroups = [
    {
        title: "Phí & bán kính giao hàng",
        items: [
            { icon: Location, text: "Dịch vụ giao hàng áp dụng trong phạm vi bán kính 10km từ cửa hàng." },
            { icon: Money, text: "Phí giao hàng cơ bản: 5.000đ/đơn. Chi phí ứng với mỗi km giao hàng là 2.000đ/km." },
        ],
    },
    {
        title: "Thanh toán",
        items: [
            { icon: Timer, text: "Đối với đơn chuyển khoản Stripe, quý khách vui lòng hoàn tất thanh toán trong vòng 30 phút kể từ khi đặt đơn." },
            { icon: Close, text: "Nếu thanh toán chưa hoàn tất, đơn hàng có thể được hủy để đảm bảo chất lượng phục vụ." },
            { icon: Check, text: "Đơn hàng đã thanh toán thành công không thể hủy để đảm bảo quyền lợi cho cả khách hàng và cửa hàng." },
        ],
    },
    {
        title: "Hủy đơn & hoàn tiền",
        items: [
            { icon: Warning, text: "Trong trường hợp đơn hàng không thể giao trong vòng 30 phút sau khi nhân viên giao, đơn sẽ được hủy và cửa hàng sẽ thông báo đến quý khách." },
            { icon: Close, text: "Đơn đã thanh toán sẽ không hoàn tiền, trừ khi sản phẩm gặp sự cố." },
            { icon: Check, text: "Nếu sản phẩm bị lỗi, cửa hàng sẽ thực hiện giao lại sản phẩm mới để đảm bảo sự hài lòng của quý khách." },
        ],
    },
    {
        title: "Đơn & số lượng",
        items: [
            { icon: Money, text: "Đơn hàng từ 500.000đ yêu cầu thanh toán trước; đơn tối đa 2.000.000đ." },
            { icon: ShoppingCart, text: "Mỗi đơn tối đa 10 loại sản phẩm; mỗi sản phẩm tối đa 50 cái." },
        ],
    },
    {
        title: "Thời gian giao & đánh giá",
        items: [
            { icon: Timer, text: "Thời gian giao hàng tối thiểu là 15 phút." },
            { icon: Check, text: "Đơn đã nhận có thể được đánh giá trong vòng 2 ngày để chia sẻ trải nghiệm với cộng đồng." },
            { icon: Warning, text: "Các đánh giá sẽ hiển thị công khai. Cửa hàng có quyền ẩn những đánh giá không phù hợp với tiêu chuẩn cộng đồng." },
        ],
    },
];
</script>

<template>
    <div class="min-h-screen bg-orange-50 p-4 md:p-8 lg:p-16">
        <h1 class="text-3xl md:text-4xl font-bold text-orange-600 text-center mb-8">
            Chính sách giao hàng - Aurelion Shop
        </h1>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <div v-for="group in policyGroups" :key="group.title"
                class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                <h2 class="text-xl font-semibold text-orange-500 mb-4 border-b border-orange-200 pb-2">
                    {{ group.title }}
                </h2>
                <ul class="space-y-3">
                    <li v-for="item in group.items" :key="item.text" class="flex items-center gap-3">
                        <component :is="item.icon" class="flex-shrink-0 w-5 h-5 md:w-6 md:h-6 text-orange-400" />
                        <p class="text-gray-700 text-sm md:text-base leading-relaxed">
                            {{ item.text }}
                        </p>
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
