<script setup lang="ts">
import { onMounted, ref } from 'vue';
import AdminFilterHeader from '../../components/AdminFilterHeader.vue';
import type { Filter } from '../../types/filter.types';
import ProductTable from './components/ProductTable.vue';
import ProductModal from './components/ProductModal.vue';
import type { Product, ProductCreateRequest } from '../../types/product.types';
import type { Category } from '../../types/category.types';
import { closeLoading, openLoading } from '../../utils/loading.utils';
import { getCategories } from '../../service/category.service';
import type { ApiResponse } from '../../types/api.types';
import type { AxiosError } from 'axios';
import { notifyError, notifySuccess } from '../../utils/notification.utils';
import { createProduct, getProducts } from '../../service/product.service';

const categories = ref<Category[]>([]);

async function loadCategories() {
  const loading = openLoading("Đang lấy dữ liệu danh mục...");
  try {
    const response = await getCategories();
    const dataResponse: ApiResponse<Category[]> = response.data;
    if (dataResponse.data)
      categories.value = dataResponse.data;
  } catch (e) {
    const err = e as AxiosError<any>;
    notifyError(err.response?.data.message || "Lỗi khi lấy dữ liệu danh mục, hãy thử lại");
  } finally {
    closeLoading(loading);
  }
}

const products = ref<Product[]>([]);

async function loadProducts() {
  const loading = openLoading("Đang lấy dữ liệu sản phẩm...");
  try {
    const response = await getProducts();
    const dataResponse: ApiResponse<Product[]> = response.data;
    if (dataResponse.data)
      products.value = dataResponse.data;
  } catch (e) {
    const err = e as AxiosError<any>;
    notifyError(err.response?.data.message || "Lỗi khi lấy dữ liệu sản phẩm, hãy thử lại");
  } finally {
    closeLoading(loading);
  }
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
  const loading = openLoading("Đang thêm sản phẩm...");
  try {
    await createProduct(newProduct);
    await loadProducts();
    notifySuccess("Đã thêm sản phẩm");
  } catch (e) {
    const err = e as AxiosError<any>;
    notifyError(err.response?.data.message || "Có lỗi khi thêm sản phẩm, hãy thử lại");
  } finally {
    closeLoading(loading);
  }
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