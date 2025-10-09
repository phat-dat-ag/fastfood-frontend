<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import CategoryModal from './components/CategoryModal.vue'
import { createCategory, deleteCategory, getCategories, updateCategory } from '../../service/category.service'
import type { Category, CategoryCreateRequest, CategoryUpdateRequest } from '../../types/category.types'
import { closeLoading, openLoading } from '../../utils/loading.utils'
import type { ApiResponse } from '../../types/api.types'
import { notifyError, notifySuccess } from '../../utils/notification.utils'
import { useCategoryStore } from '../../store/useCategoryStore.store'
import { openConfirmDeleteMessage } from '../../utils/confirmation.utils'
import CategoryTable from './components/CategoryTable.vue'
import type { AxiosError } from 'axios'
import AdminFilterHeader from '../../components/AdminFilterHeader.vue'
import type { Filter } from '../../types/filter.types'


const isCategoryModalVisible = ref(false);
const isCreatingCategory = ref(true);

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
  const loading = openLoading("Đang thêm danh mục...");
  try {
    await createCategory(newCategory);
    await loadCategories();
    notifySuccess("Đã thêm danh mục");
  } catch (e) {
    const err = e as AxiosError<any>;
    notifyError(err.response?.data.message || "Có lỗi khi thêm danh mục, hãy thử lại");
  } finally {
    closeLoading(loading);
  }
}

const categoryStore = useCategoryStore();

const openUpdateCategoryModal = (category: Category) => {
  isCreatingCategory.value = false;
  isCategoryModalVisible.value = true;
  categoryStore.setCategory(category);
}

const handleUpdateCategory = async (categoryInformation: CategoryUpdateRequest) => {
  const loading = openLoading("Đang cập nhật danh mục...");
  try {
    await updateCategory(categoryInformation);
    await loadCategories();
    notifySuccess("Đã cập nhật danh mục");
  } catch (e) {
    const err = e as AxiosError<any>;
    notifyError(err.response?.data.message || "Có lỗi khi cập nhật danh mục, hãy thử lại");
  } finally {
    closeLoading(loading);
  }
}

const handleDeleteCategory = async (id: number) => {
  const loading = openLoading("Đang xóa danh mục");
  try {
    const confirmed: boolean = await openConfirmDeleteMessage("Bạn thực sự muốn xóa danh mục này?");
    if (!confirmed) return;
    await deleteCategory(id);
    notifySuccess(`Đã xóa danh mục #${id}`);
    await loadCategories();
  } catch (e) {
    const err = e as AxiosError<any>;
    notifyError(err.response?.data.message || "Có lỗi khi xóa danh mục, hãy thử lại");
  } finally {
    closeLoading(loading);
  }
}
</script>

<template>
  <div class="p-6 bg-orange-50 min-h-screen text-gray-800">
    <h2 class="text-2xl font-semibold text-orange-500">
      Quản lý danh mục sản phẩm
    </h2>

    <AdminFilterHeader :filterOptions="filterOptions" @update:search="handleSearchChange"
      @update:filter="handleFilterChange" />

    <CategoryTable :categories="categories" :openCreateCategoryModal="openCreateCategoryModal"
      :openUpdateCategoryModal="openUpdateCategoryModal" :handleDeleteCategory="handleDeleteCategory" />

    <CategoryModal v-if="isCategoryModalVisible" :isCreatingCategory="isCreatingCategory"
      @close="isCategoryModalVisible = false" @create-category="handleCreateCategory"
      @update-category="handleUpdateCategory" />

  </div>
</template>
