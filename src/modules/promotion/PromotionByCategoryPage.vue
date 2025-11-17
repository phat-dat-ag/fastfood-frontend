<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { Filter } from '../../types/filter.types';
import AdminFilterHeader from '../../components/AdminFilterHeader.vue';
import PromotionByCategoryTable from './components/tables/PromotionByCategoryTable.vue';
import { useApiHandler } from '../../composables/useApiHandler';
import { activatePromotion, deactivatePromotion, deletePromotion, getPromotionCategory } from '../../service/promotion.service';
import type { PromotionResponse } from '../../types/promotion.types';
import { PROMOTION_CATEGORY_MESSAGE } from '../../constants/messages';
import { openConfirmDeleteMessage } from '../../utils/confirmation.utils';
import type { PageRequest } from '../../types/pagination.types';
import { PAGE_SIZE } from '../../constants/pagination';
import Pagination from '../../components/Pagination.vue';

const filterOptions: Filter[] = [
  { label: 'Thêm gần đây', value: 'recently-added' },
  { label: 'Cập nhật gần đây', value: 'recently-updated' },
  { label: 'Đang khuyến mãi', value: 'with-promotion' },
  { label: 'Đang không được khuyến mãi', value: 'no-promotion' },
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

const promotionResponse = ref<PromotionResponse | null>(null);

async function loadPromotions(page: number = 0) {
  const request: PageRequest = {
    page,
    size: PAGE_SIZE.PROMOTION.BY_CATEGORY,
  }
  await useApiHandler<PromotionResponse>(
    () => getPromotionCategory(request),
    {
      loading: PROMOTION_CATEGORY_MESSAGE.get,
      error: PROMOTION_CATEGORY_MESSAGE.getError,
    },
    (data: PromotionResponse) => promotionResponse.value = data,
  )
}
onMounted(loadPromotions);

async function handleDeletePromotionCategory(promotionId: number) {
  const confirmed: boolean = await openConfirmDeleteMessage("Bạn thực sự muốn xóa khuyến mãi cho danh mục này?");
  if (!confirmed) return;
  await useApiHandler(
    () => deletePromotion(promotionId),
    {
      loading: PROMOTION_CATEGORY_MESSAGE.delete,
      success: PROMOTION_CATEGORY_MESSAGE.deleteSuccess,
      error: PROMOTION_CATEGORY_MESSAGE.deleteError,
    },
    () => { },
    loadPromotions,
  )
}

async function handlePageChange(page: number) {
  await loadPromotions(page);
}

async function handleActivatePromotion(promotionId: number) {
  const page: number = promotionResponse.value?.currentPage || 0;
  await useApiHandler(
    () => activatePromotion(promotionId),
    {
      loading: "Đang kích hoạt mã khuyến mãi cho danh mục",
      error: "Lỗi kích hoạt mã khuyến mãi cho danh mục",
      success: "Đã kích hoạt mã khuyến mãi cho danh mục",
    },
    () => { },
    () => loadPromotions(page),
  )
}

async function handleDeactivatePromotion(promotionId: number) {
  const page: number = promotionResponse.value?.currentPage || 0;
  await useApiHandler(
    () => deactivatePromotion(promotionId),
    {
      loading: "Đang hủy kích hoạt mã khuyến mãi cho danh mục",
      error: "Lỗi hủy kích hoạt mã khuyến mãi cho danh mục",
      success: "Đã hủy kích hoạt mã khuyến mãi cho danh mục",
    },
    () => { },
    () => loadPromotions(page),
  )
}
</script>
<template>
  <div class="p-6">
    <h2 class="text-2xl font-semibold text-orange-500">
      Quản lý mã khuyến mãi theo danh mục
    </h2>
    <AdminFilterHeader :filterOptions="filterOptions" @update:search="handleSearchChange"
      @update:filter="handleFilterChange" />

    <div v-if="promotionResponse">
      <PromotionByCategoryTable :promotions="promotionResponse.promotions"
        :handleDeletePromotionCategory="handleDeletePromotionCategory" @activate-promotion="handleActivatePromotion"
        @deactivate-promotion="handleDeactivatePromotion" />
      <Pagination :totalItem="promotionResponse.totalItems" :pageSize="promotionResponse.pageSize"
        :currentPage="promotionResponse.currentPage" @change-page="handlePageChange" />
    </div>
  </div>
</template>