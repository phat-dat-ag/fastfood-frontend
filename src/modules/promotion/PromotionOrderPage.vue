<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { Filter } from '../../types/filter.types';
import AdminFilterHeader from '../../components/AdminFilterHeader.vue';
import PromotionOrderTable from './components/tables/PromotionOrderTable.vue';
import type { PromotionResponse } from '../../types/promotion.types';
import { deletePromotion, getPromotionOrder } from '../../service/promotion.service';
import { PROMOTION_ORDER_MESSAGE } from '../../constants/messages';
import { useApiHandler } from '../../composables/useApiHandler';
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
        size: PAGE_SIZE.PROMOTION.BY_ORDER,
    }
    await useApiHandler<PromotionResponse>(
        () => getPromotionOrder(request),
        {
            loading: PROMOTION_ORDER_MESSAGE.get,
            error: PROMOTION_ORDER_MESSAGE.getError,
        },
        (data: PromotionResponse) => promotionResponse.value = data,
    )
}
onMounted(loadPromotions);

async function handleDeletePromotionOrder(promotionId: number) {
    const confirmed: boolean = await openConfirmDeleteMessage("Bạn thực sự muốn xóa khuyến mãi cho đơn hàng này?");
    if (!confirmed) return;
    await useApiHandler(
        () => deletePromotion(promotionId),
        {
            loading: PROMOTION_ORDER_MESSAGE.delete,
            success: PROMOTION_ORDER_MESSAGE.deleteSuccess,
            error: PROMOTION_ORDER_MESSAGE.deleteError,
        },
        () => { },
        loadPromotions,
    )
}

async function handlePageChange(page: number) {
    await loadPromotions(page);
}

</script>
<template>
    <div class="p-6 bg-orange-50 min-h-screen text-gray-800">
        <h2 class="text-2xl font-semibold text-orange-500">
            Quản lý mã khuyến mãi cho đơn hàng
        </h2>
        <AdminFilterHeader :filterOptions="filterOptions" @update:search="handleSearchChange"
            @update:filter="handleFilterChange" />

        <div v-if="promotionResponse">
            <PromotionOrderTable :promotions="promotionResponse.promotions"
                :handleDeletePromotionOrder="handleDeletePromotionOrder" />
            <Pagination :totalItem="promotionResponse.totalItems" :pageSize="promotionResponse.pageSize"
                :currentPage="promotionResponse.currentPage" @change-page="handlePageChange" />
        </div>
    </div>
</template>