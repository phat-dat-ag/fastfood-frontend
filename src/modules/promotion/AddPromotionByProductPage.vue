<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useApiHandler } from '../../composables/useApiHandler';
import { PRODUCT_MESSAGES, PROMOTION_PRODUCT_MESSAGE } from '../../constants/messages';
import type { Product } from '../../types/product.types';
import { getAllDisplayableProducts } from '../../service/product.service';
import { toVietnamTimezoneISOString } from '../../utils/time.utils';
import type { PromotionProductCreateRequest } from '../../types/promotion.types';
import { createPromotionProduct } from '../../service/promotion.service';
import router from '../../router';
import PromotionFormBase from './components/PromotionFormBase.vue';

const products = ref<Product[]>([]);

async function loadProducts() {
    await useApiHandler<Product[]>(
        getAllDisplayableProducts,
        {
            loading: PRODUCT_MESSAGES.get,
            error: PRODUCT_MESSAGES.getError,
        },
        (data: Product[]) => products.value = data,
    )
}

onMounted(loadProducts);

async function handleSubmitPromotionProduct(formValues: any) {
    const startAt = toVietnamTimezoneISOString(new Date(formValues.startAt), false);
    const endAt = toVietnamTimezoneISOString(new Date(formValues.endAt), true);

    const data: PromotionProductCreateRequest = {
        productId: formValues.id,
        type: formValues.type,
        value: formValues.value,
        startAt: startAt,
        endAt: endAt,
        quantity: formValues.quantity,
        maxDiscountAmount: formValues.maxDiscountAmount,
        minSpendAmount: 0,
        isGlobal: false,
        isActivated: formValues.isActivated,
        code: formValues.code,
    }

    await useApiHandler(
        () => createPromotionProduct(data),
        {
            loading: PROMOTION_PRODUCT_MESSAGE.create,
            success: PROMOTION_PRODUCT_MESSAGE.createSuccess,
            error: PROMOTION_PRODUCT_MESSAGE.createError,
        },
        () => { router.back() },
    )
}

</script>
<template>
    <div class="p-6 bg-orange-50 min-h-screen text-gray-800">
        <h2 class="text-2xl font-semibold text-orange-500">
            Thêm mã khuyến mãi cho sản phẩm
        </h2>
        <PromotionFormBase :showTargetSelect="true" selectLabel="Sản phẩm áp dụnghhhh" placeholderOption="Chọn sản phẩm"
            :options="products" :onSubmit="handleSubmitPromotionProduct" />
    </div>
</template>