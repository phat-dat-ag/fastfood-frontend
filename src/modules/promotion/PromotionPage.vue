<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useApiHandler } from '../../composables/useApiHandler'
import { PROMOTION_PAGE_IMAGE_MESSAGE } from '../../constants/messages'
import { getItemPromotionImages } from '../../service/image.service'
import type { ItemPromotionImageResponse } from '../../types/image.types'
import PromotionImageSection from './components/PromotionImageSection.vue'
import EmptyPage from '../../components/EmptyPage.vue'

const itemPromotionImageResponse = ref<ItemPromotionImageResponse | null>(null);

async function loadItemPromotionImages() {
    await useApiHandler<ItemPromotionImageResponse>(
        getItemPromotionImages,
        {
            loading: PROMOTION_PAGE_IMAGE_MESSAGE.get,
            error: PROMOTION_PAGE_IMAGE_MESSAGE.getError,
        },
        (data: ItemPromotionImageResponse) => itemPromotionImageResponse.value = data,
    )
}

onMounted(loadItemPromotionImages);
</script>

<template>
    <div v-if="itemPromotionImageResponse" class="text-gray-800 space-y-8">
        <section class="text-center py-10 md:py-14 lg:py-10">
            <h1 class="text-2xl md:text-3xl font-bold text-amber-600 mb-3 md:mb-4">
                🎉 ƯU ĐÃI KHỦNG – NHẬN NGAY HÔM NAY!
            </h1>
            <p class="text-base md:text-lg text-gray-600 max-w-3xl mx-auto px-4">
                Aurelion Shop luôn mang đến cho bạn những chương trình khuyến mãi hấp dẫn nhất —
                từ món ăn, danh mục đến hóa đơn! Hãy tận dụng cơ hội để thưởng thức hương vị tuyệt vời với giá siêu ưu
                đãi ✨
            </p>
        </section>

        <PromotionImageSection title="Aurelion khao bạn sản phẩm trong các danh mục"
            :promotions="itemPromotionImageResponse.categoryPromotions" />
        <PromotionImageSection title="Mời bạn trải nghiệm các sản phẩm"
            :promotions="itemPromotionImageResponse.productPromotions" />
    </div>
    <EmptyPage v-else />
</template>
