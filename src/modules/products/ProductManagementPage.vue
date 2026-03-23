<script setup lang="ts">
import { onMounted, ref } from 'vue';
import AdminFilterHeader from '../../components/AdminFilterHeader.vue';
import type { Filter } from '../../types/filter.types';
import ProductTable from './components/ProductTable.vue';
import ProductModal from './components/ProductModal.vue';
import type { Product, ProductCreateRequest, ProductPageResponse, ProductUpdateRequest } from '../../types/product.types';
import type { CategorySelection, CategorySelectionResponse } from '../../types/category.types';
import { getCategorySelections } from '../../service/admin-category.service';
import { useApiHandler } from '../../composables/useApiHandler';
import { CATEGORY_MESSAGES, PRODUCT_MESSAGES } from '../../constants/messages';
import { openConfirmDeleteMessage } from '../../utils/confirmation.utils';
import { useProductStore } from '../../store/useProductStore.store';
import { notifyError } from '../../utils/notification.utils';
import { useRoute } from 'vue-router';
import type { PageRequest } from '../../types/pagination.types';
import { PAGE_SIZE } from '../../constants/pagination';
import Pagination from '../../components/Pagination.vue';
import EmptyPage from '../../components/EmptyPage.vue';
import { createProduct, deleteProduct, getProductPage, updateProduct, updateProductActivation } from '../../service/admin-product.service';

const categories = ref<CategorySelection[]>([]);

async function loadCategories() {
  await useApiHandler<CategorySelectionResponse>(
    getCategorySelections,
    {
      loading: CATEGORY_MESSAGES.get,
      error: CATEGORY_MESSAGES.getError,
    },
    (data: CategorySelectionResponse) => categories.value = data.selectiveCategories,
  )
}

const route = useRoute();

const productResponse = ref<ProductPageResponse | null>(null);

async function loadProducts(page: number = 0) {
  const request: PageRequest = {
    page,
    size: PAGE_SIZE.PRODUCT,
  }
  const categorySlug = String(route.params.categorySlug || "");
  await useApiHandler<ProductPageResponse>(
    () => getProductPage(request, categorySlug),
    {
      loading: PRODUCT_MESSAGES.get,
      error: PRODUCT_MESSAGES.getError,
    },
    (data: ProductPageResponse) => productResponse.value = data,
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

async function handleActivateProduct(productId: number) {
  const page: number = productResponse.value?.currentPage || 0;
  await useApiHandler(
    () => updateProductActivation(productId, true),
    {
      loading: "Đang kích hoạt sản phẩm",
      error: "Lỗi kích hoạt sản phẩm",
    },
    () => { },
    () => loadProducts(page),
  )
}

async function handleDeactivateProduct(productId: number) {
  const page: number = productResponse.value?.currentPage || 0;
  await useApiHandler(
    () => updateProductActivation(productId, false),
    {
      loading: "Đang vô hiệu hóa sản phẩm",
      error: "Lỗi vô hiệu hóa sản phẩm",
    },
    () => { },
    () => loadProducts(page),
  )
}

async function handlePageChange(page: number) {
  await loadProducts(page);
}
</script>

<template>
  <div class="p-6">
    <h2 class="text-2xl font-semibold text-orange-500">
      Quản lý sản phẩm
    </h2>

    <div v-if="productResponse">
      <AdminFilterHeader :filterOptions="filterOptions" @update:search="handleSearchChange"
        @update:filter="handleFilterChange" />

      <ProductTable :products="productResponse.products" :openCreateProductModal="openCreateProductModal"
        :openUpdateProductModal="openUpdateProductModal" :handleDeleteProduct="handleDeleteProduct"
        @activate-product="handleActivateProduct" @deactivate-product="handleDeactivateProduct" />

      <Pagination :totalItem="productResponse.totalItems" :pageSize="productResponse.pageSize"
        :currentPage="productResponse.currentPage" @change-page="handlePageChange" />

    </div>
    <EmptyPage v-else />
    <ProductModal v-if="isProductModalVisible" :isCreatingProduct="isCreatingProduct" :categories="categories"
      @close="isProductModalVisible = false" @create-product="handleCreateProduct"
      @update-product="handleUpdateProduct" />
  </div>
</template>