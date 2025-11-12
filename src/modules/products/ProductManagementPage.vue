<script setup lang="ts">
import { onMounted, ref } from 'vue';
import AdminFilterHeader from '../../components/AdminFilterHeader.vue';
import type { Filter } from '../../types/filter.types';
import ProductTable from './components/ProductTable.vue';
import ProductModal from './components/ProductModal.vue';
import type { Product, ProductCreateRequest, ProductResponse, ProductUpdateRequest } from '../../types/product.types';
import type { Category } from '../../types/category.types';
import { getDisplayableCategories } from '../../service/category.service';
import { createProduct, deleteProduct, getProducts, updateProduct } from '../../service/product.service';
import { useApiHandler } from '../../composables/useApiHandler';
import { CATEGORY_MESSAGES, PRODUCT_MESSAGES } from '../../constants/messages';
import { openConfirmDeleteMessage } from '../../utils/confirmation.utils';
import { useProductStore } from '../../store/useProductStore.store';
import { notifyError } from '../../utils/notification.utils';
import { useRoute } from 'vue-router';
import type { PageRequest } from '../../types/pagination.types';
import { PAGE_SIZE } from '../../constants/pagination';
import Pagination from '../../components/Pagination.vue';

const categories = ref<Category[]>([]);

async function loadCategories() {
  await useApiHandler<Category[]>(
    getDisplayableCategories,
    {
      loading: CATEGORY_MESSAGES.get,
      error: CATEGORY_MESSAGES.getError,
    },
    (data: Category[]) => categories.value = data,
  )
}

const route = useRoute();

const productResponse = ref<ProductResponse | null>(null);

async function loadProducts(page: number = 0) {
  const request: PageRequest = {
    page,
    size: PAGE_SIZE.PRODUCT,
  }
  const categorySlug = String(route.params.categorySlug || "");
  await useApiHandler<ProductResponse>(
    () => getProducts(request, categorySlug),
    {
      loading: PRODUCT_MESSAGES.get,
      error: PRODUCT_MESSAGES.getError,
    },
    (data: ProductResponse) => productResponse.value = data,
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
  if (categories.value.length === 0) {
    notifyError("Hãy bổ sung danh mục trước khi thêm sản phẩm");
    return;
  }
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

const productStore = useProductStore();

const openUpdateProductModal = (product: Product) => {
  isProductModalVisible.value = true;
  isCreatingProduct.value = false;
  productStore.setProduct(product);
}

const handleUpdateProduct = async (productInformation: ProductUpdateRequest) => {
  await useApiHandler(
    () => updateProduct(productInformation),
    {
      loading: PRODUCT_MESSAGES.update,
      success: PRODUCT_MESSAGES.updateSuccess,
      error: PRODUCT_MESSAGES.updateError,
    },
    () => { },
    loadProducts,
  )
}

const handleDeleteProduct = async (id: number) => {
  const confirmed: boolean = await openConfirmDeleteMessage("Bạn thực sự muốn xóa sản phẩm này?");
  if (!confirmed) return;
  await useApiHandler(
    () => deleteProduct(id),
    {
      loading: PRODUCT_MESSAGES.delete,
      success: PRODUCT_MESSAGES.deleteSuccess,
      error: PRODUCT_MESSAGES.deleteError,
    },
    () => { },
    loadProducts,
  )
}

async function handlePageChange(page: number) {
  await loadProducts(page);
}
</script>

<template>
  <div class="p-6 bg-orange-50 min-h-screen text-gray-800">
    <h2 class="text-2xl font-semibold text-orange-500">
      Quản lý sản phẩm
    </h2>
    <AdminFilterHeader :filterOptions="filterOptions" @update:search="handleSearchChange"
      @update:filter="handleFilterChange" />

    <div v-if="productResponse">

      <ProductTable :products="productResponse.products" :openCreateProductModal="openCreateProductModal"
        :openUpdateProductModal="openUpdateProductModal" :handleDeleteProduct="handleDeleteProduct" />

      <Pagination :totalItem="productResponse.totalItems" :pageSize="productResponse.pageSize"
        :currentPage="productResponse.currentPage" @change-page="handlePageChange" />

      <ProductModal v-if="isProductModalVisible" :isCreatingProduct="isCreatingProduct" :categories="categories"
        @close="isProductModalVisible = false" @create-product="handleCreateProduct"
        @update-product="handleUpdateProduct" />
    </div>
  </div>
</template>