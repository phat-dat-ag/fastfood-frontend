<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { Filter } from '../../types/filter.types';
import AdminFilterHeader from '../../components/AdminFilterHeader.vue';
import type { PromotionResponse } from '../../types/promotion.types';
import { PROMOTION_PRODUCT_MESSAGE } from '../../constants/messages';
import { openConfirmDeleteMessage } from '../../utils/confirmation.utils';
import { useApiHandler } from '../../composables/useApiHandler';
import { activatePromotion, deactivatePromotion, deletePromotion, getPromotionProduct } from '../../service/promotion.service';
import PromotionByProductTable from './components/tables/PromotionByProductTable.vue';
import type { PageRequest } from '../../types/pagination.types';
import { PAGE_SIZE } from '../../constants/pagination';
import Pagination from '../../components/Pagination.vue';
import EmptyPage from '../../components/EmptyPage.vue';

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
    size: PAGE_SIZE.PROMOTION.BY_PRODUCT,
  }
  await useApiHandler<PromotionResponse>(
    () => getPromotionProduct(request),
    {
      loading: PROMOTION_PRODUCT_MESSAGE.get,
      error: PROMOTION_PRODUCT_MESSAGE.getError,
    },
    (data: PromotionResponse) => promotionResponse.value = data,
  )
}
onMounted(loadPromotions);

async function handleDeletePromotionProduct(promotionId: number) {
  const confirmed: boolean = await openConfirmDeleteMessage("Bạn thực sự muốn xóa khuyến mãi cho sản phẩm này?");
  if (!confirmed) return;
  await useApiHandler(
    () => deletePromotion(promotionId),
    {
      loading: PROMOTION_PRODUCT_MESSAGE.delete,
      success: PROMOTION_PRODUCT_MESSAGE.deleteSuccess,
      error: PROMOTION_PRODUCT_MESSAGE.deleteError,
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
      loading: "Đang kích hoạt mã khuyến mãi cho sản phẩm",
      error: "Lỗi kích hoạt mã khuyến mãi cho sản phẩm",
      success: "Đã kích hoạt mã khuyến mãi cho sản phẩm",
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
      loading: "Đang hủy kích hoạt mã khuyến mãi cho sản phẩm",
      error: "Lỗi hủy kích hoạt mã khuyến mãi cho sản phẩm",
      success: "Đã hủy kích hoạt mã khuyến mãi cho sản phẩm",
    },
    () => { },
    () => loadPromotions(page),
  )
}

</script>
<template>
  <div class="p-6">
    <h2 class="text-2xl font-semibold text-orange-500">
      Quản lý mã khuyến mãi theo sản phẩm
    </h2>

    <div v-if="promotionResponse">
      <AdminFilterHeader :filterOptions="filterOptions" @update:search="handleSearchChange"
        @update:filter="handleFilterChange" />
      <PromotionByProductTable :promotions="promotionResponse.promotions"
        :handleDeletePromotionProduct="handleDeletePromotionProduct" @activate-promotion="handleActivatePromotion"
        @deactivate-promotion="handleDeactivatePromotion" />
      <Pagination :totalItem="promotionResponse.totalItems" :pageSize="promotionResponse.pageSize"
        :currentPage="promotionResponse.currentPage" @change-page="handlePageChange" />
    </div>
    <EmptyPage v-else />
  </div>
</template>