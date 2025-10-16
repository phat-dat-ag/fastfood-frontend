<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { Filter } from '../../types/filter.types';
import AdminFilterHeader from '../../components/AdminFilterHeader.vue';
import PromotionByCategoryTable from './components/PromotionByCategoryTable.vue';
import { useApiHandler } from '../../composables/useApiHandler';
import { deletePromotion, getPromotionCategory } from '../../service/promotion.service';
import type { Promotion, PromotionResponse } from '../../types/promotion.types';
import { PROMOTION_CATEGORY_MESSAGE } from '../../constants/messages';
import { openConfirmDeleteMessage } from '../../utils/confirmation.utils';

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

const promotions = ref<Promotion[]>([]);

async function loadPromotions() {
  await useApiHandler<PromotionResponse>(
    getPromotionCategory,
    {
      loading: PROMOTION_CATEGORY_MESSAGE.get,
      error: PROMOTION_CATEGORY_MESSAGE.getError,
    },
    (data: PromotionResponse) => promotions.value = data.promotions,
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

</script>
<template>
  <div class="p-6 bg-orange-50 min-h-screen text-gray-800">
    <h2 class="text-2xl font-semibold text-orange-500">
      Quản lý mã khuyến mãi theo danh mục
    </h2>
    <AdminFilterHeader :filterOptions="filterOptions" @update:search="handleSearchChange"
      @update:filter="handleFilterChange" />
    <PromotionByCategoryTable :promotions="promotions" :handleDeletePromotionCategory="handleDeletePromotionCategory" />
  </div>
</template>