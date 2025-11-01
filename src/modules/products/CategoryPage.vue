<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { Category } from '../../types/category.types';
import { useApiHandler } from '../../composables/useApiHandler';
import { getCategories } from '../../service/category.service';
import { CART_MESSAGE, CATEGORY_MESSAGES } from '../../constants/messages';
import ProductSegment from './components/ProductSegment.vue';
import type { Product } from '../../types/product.types';
import ProductList from './components/ProductList.vue';
import { addProductToCart } from '../../service/cart.service';
import { useUserStore } from '../../store/useUserStore.store';
import { notifyError } from '../../utils/notification.utils';

const categories = ref<Category[]>([]);
async function loadCategories() {
  await useApiHandler<Category[]>(
    getCategories,
    {
      loading: CATEGORY_MESSAGES.get,
      error: CATEGORY_MESSAGES.getError,
    },
    (data: Category[]) => categories.value = data,
  )
}
onMounted(loadCategories);

const selectedCategory = ref<Category>();
function handleSelect(category: Category) {
  selectedCategory.value = category;
}

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
  <div class="flex flex-col gap-4">
    <ProductSegment :categories="categories" @select="handleSelect" />
    <ProductList v-if="selectedCategory" :products="selectedCategory.products" @add-to-cart="handleAddToCart" />
  </div>
</template>
