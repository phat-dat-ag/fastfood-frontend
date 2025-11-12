<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import CategoryModal from './components/CategoryModal.vue'
import { createCategory, deleteCategory, getCategories, updateCategory } from '../../service/category.service'
import type { Category, CategoryCreateRequest, CategoryResponse, CategoryUpdateRequest } from '../../types/category.types'
import { useCategoryStore } from '../../store/useCategoryStore.store'
import { openConfirmDeleteMessage } from '../../utils/confirmation.utils'
import CategoryTable from './components/CategoryTable.vue'
import AdminFilterHeader from '../../components/AdminFilterHeader.vue'
import type { Filter } from '../../types/filter.types'
import { useApiHandler } from '../../composables/useApiHandler'
import { CATEGORY_MESSAGES } from '../../constants/messages'
import type { PageRequest } from '../../types/pagination.types'
import { PAGE_SIZE } from '../../constants/pagination'
import Pagination from '../../components/Pagination.vue'
import { useRouter } from 'vue-router'
import { ROUTE_NAMES } from '../../constants/route-names'


const isCategoryModalVisible = ref(false);
const isCreatingCategory = ref(true);

const categoryResponse = ref<CategoryResponse | null>(null);

async function loadCategories(page: number = 0) {
  const request: PageRequest = {
    page,
    size: PAGE_SIZE.CATEGORY,
  }
  await useApiHandler<CategoryResponse>(
    () => getCategories(request),
    {
      loading: CATEGORY_MESSAGES.get,
      error: CATEGORY_MESSAGES.getError,
    },
    (data: CategoryResponse) => categoryResponse.value = data,
  )
}

onMounted(loadCategories);

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

const openCreateCategoryModal = () => {
  isCategoryModalVisible.value = true;
  isCreatingCategory.value = true;
}

const handleCreateCategory = async (newCategory: CategoryCreateRequest) => {
  await useApiHandler(
    () => createCategory(newCategory),
    {
      loading: CATEGORY_MESSAGES.create,
      success: CATEGORY_MESSAGES.createSuccess,
      error: CATEGORY_MESSAGES.createError,
    },
    () => { },
    loadCategories,
  )
}

const categoryStore = useCategoryStore();

const openUpdateCategoryModal = (category: Category) => {
  isCreatingCategory.value = false;
  isCategoryModalVisible.value = true;
  categoryStore.setCategory(category);
}

const handleUpdateCategory = async (categoryInformation: CategoryUpdateRequest) => {
  await useApiHandler(
    () => updateCategory(categoryInformation),
    {
      loading: CATEGORY_MESSAGES.update,
      success: CATEGORY_MESSAGES.updateSuccess,
      error: CATEGORY_MESSAGES.updateError,
    },
    () => { },
    loadCategories,
  )
}

const handleDeleteCategory = async (id: number) => {
  const confirmed: boolean = await openConfirmDeleteMessage("Bạn thực sự muốn xóa danh mục này?");
  if (!confirmed) return;
  await useApiHandler(
    () => deleteCategory(id),
    {
      loading: CATEGORY_MESSAGES.delete,
      success: CATEGORY_MESSAGES.deleteSuccess,
      error: CATEGORY_MESSAGES.deleteError,
    },
    () => { },
    loadCategories
  )
}

const router = useRouter();

const goToProductsManagementPage = (categorySlug: string) => {
  router.push({ name: ROUTE_NAMES.ADMIN.PRODUCT_MANAGEMENT, params: { categorySlug } });
}

async function handlePageChange(page: number) {
  await loadCategories(page);
}
</script>

<template>
  <div class="p-6 bg-orange-50 min-h-screen text-gray-800">
    <h2 class="text-2xl font-semibold text-orange-500">
      Quản lý danh mục sản phẩm
    </h2>

    <AdminFilterHeader :filterOptions="filterOptions" @update:search="handleSearchChange"
      @update:filter="handleFilterChange" />

    <div v-if="categoryResponse">

      <CategoryTable :categories="categoryResponse.categories" :openCreateCategoryModal="openCreateCategoryModal"
        :openUpdateCategoryModal="openUpdateCategoryModal" :handleDeleteCategory="handleDeleteCategory"
        :goToProductsManagementPage="goToProductsManagementPage" />

      <Pagination :totalItem="categoryResponse.totalItems" :pageSize="categoryResponse.pageSize"
        :currentPage="categoryResponse.currentPage" @change-page="handlePageChange" />

      <CategoryModal v-if="isCategoryModalVisible" :isCreatingCategory="isCreatingCategory"
        @close="isCategoryModalVisible = false" @create-category="handleCreateCategory"
        @update-category="handleUpdateCategory" />
    </div>

  </div>
</template>
