<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useApiHandler } from '../../composables/useApiHandler';
import type { Product } from '../../types/product.types';
import { getProductsByCategory } from '../../service/product.service';
import { CART_MESSAGE, PRODUCT_MESSAGES } from '../../constants/messages';
import { useUserStore } from '../../store/useUserStore.store';
import { notifyError } from '../../utils/notification.utils';
import { addProductToCart } from '../../service/cart.service';
import ProductList from './components/ProductList.vue';

const route = useRoute();
const slug = computed(() => String(route.params.slug || ""));

const products = ref<Product[]>([]);

async function loadProducts() {
    await useApiHandler<Product[]>(
        () => getProductsByCategory(slug.value),
        {
            loading: PRODUCT_MESSAGES.get,
            error: PRODUCT_MESSAGES.getError,
        },
        (data: Product[]) => products.value = data,
    )
}

onMounted(() => {
    loadProducts();
});

watch(() => route.params.slug, () => {
    loadProducts();
});

const userStore = useUserStore();

async function handleAddToCart(data: { product: Product; quantity: number }) {
    if (!userStore.isSignedIn()) {
        notifyError("Hãy đăng nhập trước khi thêm sản phẩm vào giỏ hàng");
        return;
    }
    if (data.quantity < 1) return;
    await useApiHandler(
        () => addProductToCart({ productId: data.product.id, quantity: data.quantity }),
        {
            loading: CART_MESSAGE.create,
            success: CART_MESSAGE.createSuccess,
            error: CART_MESSAGE.createError,
        },
        () => { },
    )
}
</script>

<template>
    <ProductList v-if="products.length > 0" :products="products" @add-to-cart="handleAddToCart" />
</template>
