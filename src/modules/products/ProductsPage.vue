<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { Category } from '../../types/category.types';
import { useApiHandler } from '../../composables/useApiHandler';
import { getCategories } from '../../service/category.service';
import { CATEGORY_MESSAGES } from '../../constants/messages';
import ProductSegment from './components/ProductSegment.vue';
import type { Product } from '../../types/product.types';
import ProductList from './components/ProductList.vue';

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

function handleAddToCart(product: Product) {
  console.log("Đã thêm vào giỏ hàng:", product.name);
}
</script>
<template>
  <div class="flex flex-col gap-4">
    <ProductSegment :categories="categories" @select="handleSelect" />
    <ProductList v-if="selectedCategory" :products="selectedCategory.products" @add-to-cart="handleAddToCart" />
  </div>
</template>
