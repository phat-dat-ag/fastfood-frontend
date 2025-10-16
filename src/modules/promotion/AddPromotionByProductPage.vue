<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useApiHandler } from '../../composables/useApiHandler';
import { PRODUCT_MESSAGES } from '../../constants/messages';
import PromotionForm from './components/PromotionForm.vue';
import type { Product } from '../../types/product.types';
import { getProducts } from '../../service/product.service';

const products = ref<Product[]>([]);

async function loadProducts() {
    await useApiHandler<Product[]>(
        getProducts,
        {
            loading: PRODUCT_MESSAGES.get,
            error: PRODUCT_MESSAGES.getError,
        },
        (data: Product[]) => products.value = data,
    )
}

onMounted(loadProducts);

</script>
<template>
    <div class="p-6 bg-orange-50 min-h-screen text-gray-800">
        <h2 class="text-2xl font-semibold text-orange-500">
            Thêm mã khuyến mãi cho sản phẩm
        </h2>
        <PromotionForm :isPromotionCategory=false selectLabel="Áp dụng cho sản phẩm" placeholderOption="Chọn sản phẩm"
            :options="products" />
    </div>
</template>