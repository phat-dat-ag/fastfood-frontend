<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
import { useApiHandler } from '../../composables/useApiHandler';
import { getOrderById } from '../../service/order.service';
import { ORDER_MESSAGE } from '../../constants/messages';
import { notifyError } from '../../utils/notification.utils';
import type { Order } from '../../types/order.types';
import type { ReviewCreateRequest } from '../../types/review.types';
import ProductReviewFormItem from './components/ProductReviewFormItem.vue';

const route = useRoute();
const router = useRouter();
const order = ref<Order | null>(null);
const reviews = ref<Record<number, ReviewCreateRequest>>({});

async function loadOrder(orderId: number) {
    await useApiHandler<Order>(
        () => getOrderById(orderId),
        { loading: ORDER_MESSAGE.get, error: ORDER_MESSAGE.getError },
        (data: Order) => {
            order.value = data;
            data.orderDetails.forEach((detail) => {
                reviews.value[detail.product.id] = {
                    productId: detail.product.id,
                    rating: 0,
                    comment: '',
                    images: [],
                };
            });
        }
    );
}

onMounted(() => {
    const orderIdParam = route.params.orderId;
    const orderId = Number(orderIdParam);
    if (!orderIdParam || Number.isNaN(orderId) || orderId <= 0) {
        notifyError('Không thể đánh giá: mã đơn hàng không hợp lệ');
        router.back();
        return;
    }
    loadOrder(orderId);
});

function handleUpdateReview(productId: number, newData: ReviewCreateRequest) {
    reviews.value[productId] = newData;
}

function handleSubmitReviews() {
    if (!order.value) return;
    const allReviewed = order.value.orderDetails.every(
        (detail) =>
            reviews.value[detail.product.id].rating > 0 &&
            reviews.value[detail.product.id].comment.trim() !== ''
    );
    if (!allReviewed) {
        notifyError('Vui lòng đánh giá tất cả sản phẩm trước khi gửi!');
        return;
    }

    const result: Array<ReviewCreateRequest> = Object.values(reviews.value);
    console.log('📦 Tất cả đánh giá:', result);
}
</script>

<template>
    <div class="mx-auto py-10 px-6">
        <div
            class="rounded-2xl p-6 mb-10 text-white bg-gradient-to-r from-orange-400 via-orange-500 to-amber-400 shadow-lg">
            <h1 class="text-3xl font-bold drop-shadow-md text-center">Đánh giá đơn hàng của bạn</h1>
            <p class="text-white/90 text-center mt-2">
                Cảm ơn bạn đã mua hàng! Hãy chia sẻ cảm nhận của bạn để chúng tôi phục vụ tốt hơn
            </p>
        </div>

        <div v-if="order" class="space-y-6">
            <ProductReviewFormItem v-for="detail in order.orderDetails" :key="detail.product.id" :detail="detail"
                :review-data="reviews[detail.product.id]"
                @update:reviewData="(data) => handleUpdateReview(detail.product.id, data)" />

            <div class="text-center mt-8">
                <el-button type="warning" size="large" round
                    class="!bg-gradient-to-r from-orange-400 via-orange-500 to-amber-400 !border-0 text-white font-semibold shadow-md hover:shadow-lg transition"
                    @click="handleSubmitReviews">
                    Gửi đánh giá
                </el-button>
            </div>
        </div>
    </div>
</template>
