<script setup lang="ts">
import { onMounted, ref } from 'vue';
import AdminFilterHeader from '../../components/AdminFilterHeader.vue';
import type { Filter } from '../../types/filter.types';
import ProductTable from './components/ProductTable.vue';
import ProductModal from './components/ProductModal.vue';
import type { Product, ProductCreateRequest } from '../../types/product.types';
import type { Category } from '../../types/category.types';
import { getCategories } from '../../service/category.service';
import { createProduct, getProducts } from '../../service/product.service';
import { useApiHandler } from '../../composables/useApiHandler';
import { CATEGORY_MESSAGES, PRODUCT_MESSAGES } from '../../constants/messages';

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

onMounted(loadCategories);
onMounted(loadProducts);

const filterOptions: Filter[] = [
  { label: 'Doanh thu cao', value: 'revenue_high' },
  { label: 'Sản phẩm nhiều', value: 'product_rich' },
  { label: 'Mới ra mắt', value: 'newest' },
  { label: 'Cũ nhất', value: 'oldest' },
];

const activeFilters = ref<any[]>([]);

function handleFilterChange(filters: any[]) {
  activeFilters.value = filters;
  console.log(activeFilters.value);
}

const search = ref<string>("");

function handleSearchChange(searchText: string) {
  search.value = searchText;
  console.log(search.value);
}

const isProductModalVisible = ref<boolean>(false);
const isCreatingProduct = ref<boolean>(true);

const openCreateProductModal = () => {
  isProductModalVisible.value = true;
  isCreatingProduct.value = true;
}

const handleCreateProduct = async (newProduct: ProductCreateRequest) => {
  await useApiHandler(
    () => createProduct(newProduct),
    {
      loading: PRODUCT_MESSAGES.create,
      success: PRODUCT_MESSAGES.createSuccess,
      error: PRODUCT_MESSAGES.createError,
    },
    () => { },
    loadProducts,
  )
}
</script>

<template>
  <div class="p-6 bg-orange-50 min-h-screen text-gray-800">
    <h2 class="text-2xl font-semibold text-orange-500">
      Quản lý sản phẩm
    </h2>
    <AdminFilterHeader :filterOptions="filterOptions" @update:search="handleSearchChange"
      @update:filter="handleFilterChange" />

    <ProductTable :products="products" :openCreateProductModal="openCreateProductModal" />

    <ProductModal v-if="isProductModalVisible" :isCreatingProduct="isCreatingProduct" :categories="categories"
      @close="isProductModalVisible = false" @create-product="handleCreateProduct" />
  </div>
</template>